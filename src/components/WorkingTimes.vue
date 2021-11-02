<template>
  <div class="WorkingtimesUser">
    <Nav/>
    <div class="ms-5">
      <table>
        <thead>
          <tr>
            <th class="hours"></th>
            <th>
              <span class="day">{{ date[0] }}</span>
              <span class="long">Monday</span>
              <span class="short">Mon</span>
            </th>
            <th>
              <span class="day">{{ date[1] }}</span>
              <span class="long">Tuesday</span>
              <span class="short">Tue</span>
            </th>
            <th>
              <span class="day">{{ date[2] }}</span>
              <span class="long">Wednesday</span>
              <span class="short">We</span>
            </th>
            <th>
              <span class="day">{{ date[3] }}</span>
              <span class="long">Thursday</span>
              <span class="short">Thur</span>
            </th>
            <th>
              <span class="day">{{ date[4] }}</span>
              <span class="long">Friday</span>
              <span class="short">Fri</span>
            </th>
            <th>
              <span class="day">{{ date[5] }}</span>
              <span class="long">Saturday</span>
              <span class="short">Sat</span>
            </th>
            <th>
              <span class="day">{{ date[6] }}</span>
              <span class="long">Sunday</span>
              <span class="short">Sun</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableau" v-bind:key="index">
            <td class="hour"><span>{{ index }}:00</span></td>
            <td v-for="(item, index2) in row" v-on:click="goToWT(item.id)" v-bind:key="index2" v-bind:class="{ 'working': item.bool }">
              <span> {{ item.data }} </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="ModalWorkingTime" tabindex="-1" aria-labelledby="ModalUserLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalUserLabel">Create Working Times</h5>
              <button type="button" id="modalBtnCloseWT" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="startdate" class="form-label">Start :</label>
                  <input type="datetime-local" class="form-control" id="startdate" v-model="start_input">
                </div>
                <div class="mb-3">
                  <label for="startend" class="form-label">End :</label>
                  <input type="datetime-local" class="form-control" id="startend" v-model="end_input">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" v-on:click="resetInput">Reset</button>
              <button type="button" class="btn" v-on:click="createWorkingTime">Create</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Nav from './Nav.vue'
export default {
  name: 'WorkingTimes',
  props: {},
  components: {
    Nav
  },
  data () {
    return {
      workingtimes: {},
      tableau: [],
      start_input: "",
      end_input: "",
      date: [],
      test: 0
    }
  },
  created: function () {
    this.getWorkingTimes();
    this.test = 0;
  },
  updated: function () {
    if (this.test==0) {
      this.getWorkingTimes();
      this.test=1;
    }
  },
  methods: {
    goToWT (wtId) {
      if (wtId!=-1) {
        this.$router.push(`/workingtime/${this.$route.params.userId}/${wtId}`)
      }
    },
    getWorkingTimes () {
      var curr = new Date;
      var curr2 = new Date; // get current date
      var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      var last = curr.getDate() - curr.getDay() + 7; // last day is the first day + 6
      this.date = new Array(7);

      for (let i = 1; i < 8; i++) {
        var curr3 = new Date;
        var jour = curr.getDate() - curr.getDay() + i;
        var thedate = new Date(curr3.setDate(jour));
        this.date[i-1] = thedate.getDate();
      }

      var firstday = new Date(curr.setDate(first)).toISOString().split("T")[0]+" 00:00:00";
      var lastday = new Date(curr2.setDate(last)).toISOString().split("T")[0]+" 23:59:59";

      var myHeaders = new Headers();

      var myInit = { method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default' };

      fetch(`http://127.0.0.1:4000/api/workingtimes/${this.$route.params.userId}?start=${firstday}&end=${lastday}`, myInit)
        .then(res => {
          return res.json();
        }).then(this.setResults);
    },
    setResults (results) {
      this.workingtimes = results.data;
      this.tableau = new Array(24);
      for (let i = 0; i < 24; i++) {
        this.tableau[i] = new Array(7);
        for (let j = 0; j < 7; j++) {
          this.tableau[i][j] = {"bool": false, "data": "", "id": -1};
        }
      }
      console.log(this.workingtimes);
      for (let i = 0; i < 7; i++) {
        var curr = new Date;
        var jour = curr.getDate() - curr.getDay() + i + 1;
        curr.setDate(jour);
        this.workingtimes.forEach(workingtime => {
          var workingtimeStart = new Date(workingtime.start)
          if (curr.getDate() == workingtimeStart.getDate()) {
            var hdebut = new Date(workingtime.start);
            var hfin = new Date(workingtime.end);
            let diffInMilliSeconds = Math.abs(hfin - hdebut) / 1000;
            const hours = Math.floor(diffInMilliSeconds / 3600);
            for (let h = 0; h < hours; h++) {
              let h2 = (hdebut.getHours()+h) %24;
              let i2 = i + ((hdebut.getHours()+h-h2) /24);
              this.tableau[h2][i2].bool = true;
              this.tableau[h2][i2].id = workingtime.id;
              if (h == 0) {
                this.tableau[h2][i2].data = hdebut.getHours()+":00";
              }
              if (h == hours - 1) {
                this.tableau[h2][i2].data = hfin.getHours()+":00";
              }
            }
          }
        });
      }
      console.log(this.tableau);
    },
    resetInput (){
      this.start_input = "";
      this.end_input = "";
    },
    createWorkingTime () {
      const object = { "working_time": {
        "start": this.start_input+":00",
        "end": this.end_input+":00"
        }
      };
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/workingtimes/"+this.$route.params.userId, myInit)
      .then(res => {
          if (res.ok) {
            document.getElementById("modalBtnCloseWT").click()
          }
        }).then(this.getWorkingTimes)
    }
  }
}
</script>

<style>
.WorkingtimesUser .modal-body input{
  background-color: #596869;
  color: #e7e7e7;;
}
.WorkingtimesUser .modal-body ::placeholder{
  color: #e7e7e7;
  opacity: 0.6;
}
.WorkingtimesUser .modal-content{
  background-color: #1e4753;
}
.menu{
  height: 7em;
}
.WorkingtimesUser .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #39697b;
  color: #e7e7e7;
}
.WorkingtimesUser .btn:hover{
  background-color: #4f76a0;
}
.WorkingtimesUser .working {
  background-color: blue;
  color: black;
  font-size: 13px;
  cursor: pointer;
}
.WorkingtimesUser table {
  font-family:sans-serif;
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;
  table-layout: fixed;
  margin-bottom: 50px;
}
.WorkingtimesUser table thead tr th {
  background: #626E7E;
  color: lighten(#626E7E, 40%);
  padding: 0.5em;
  overflow: hidden;
}
.WorkingtimesUser table thead tr th.hours {
  width: 4em;
}
.WorkingtimesUser table thead tr th:first-child {
  border-radius:3px 0 0 0;
}
.WorkingtimesUser table thead tr th:last-child {
  border-radius:0 3px 0 0;
}
.WorkingtimesUser table thead tr th .day {
  display: block;
  font-size: 1.2em;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 auto 5px;
  padding: 5px;
  line-height: 1.8;
}
.WorkingtimesUser table thead tr th .short {
  display: none;
}
.WorkingtimesUser table thead tr th i {
  vertical-align: middle;
  font-size: 2em;
}
.WorkingtimesUser table tbody tr:nth-child(nth-child(4n+0)) td {
  border-bottom:1px solid #626E7E;
}
.WorkingtimesUser table tbody tr td {
  text-align: center;
  vertical-align: middle;
  border-left: 1px solid #626E7E;
  position: relative;
  height: 23px;
  background: lightgray;
}
.WorkingtimesUser table tbody tr td:last-child {
  border-right:1px solid #626E7E;
}
.WorkingtimesUser table tbody tr .hour {
  font-size: 10px;
  padding: 0;
  color: #626E7E;
  background: #fff;
  border-bottom:1px solid #626E7E;
  border-collapse: separate;
  min-width: 100px;
}

.WorkingtimesUser table tbody tr .hour span {
  display: block;
}
</style>