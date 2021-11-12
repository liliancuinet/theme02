<template>
  <div class="WorkingtimesUser">
    <Nav v-if="user_role_connected != 'user'"/>
    <div class="ms-5 row" v-if="user_role_connected != 'user'">
      <div class="col-1 d-flex align-items-center divdivchevron">
        <div class="btn p-2 bd-highlight bla d-flex align-items-center justify-content-center" v-on:click="removeWeek">
          <i class="fas fa-chevron-circle-left chevron" style="color: #e7e7e7"></i>
        </div>
      </div>
      <div class="col-10">
        <input type="date" class="form-control" v-on:change="selectWeek" v-model="calendar_choose">
        <table>
          <thead>
            <tr>
              <th class="hours">
                <a href="#" style="display: none" id="openModalWTN" data-bs-toggle="modal" data-bs-target="#ModalWorkingTime">
                  <i class="fas fa-plus"></i>
                </a>
              </th>
              <th>
                <span class="day">Mon {{ date[0] }}</span>
              </th>
              <th>
                <span class="day">Tue {{ date[1] }}</span>
              </th>
              <th>
                <span class="day">We {{ date[2] }}</span>
              </th>
              <th>
                <span class="day">Thur {{ date[3] }}</span>
              </th>
              <th>
                <span class="day">Fri {{ date[4] }}</span>
              </th>
              <th>
                <span class="day">Sat {{ date[5] }}</span>
              </th>
              <th>
                <span class="day">Sun {{ date[6] }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableau" v-bind:key="index">
              <td class="hour"><span>{{ index }}:00</span></td>
              <td v-for="(item, index2) in row" v-on:click="goToWT(item.id, $event)" :id="index+'-'+index2" v-bind:key="index2" v-bind:class="{ 'working': item.bool }">
                <span> {{ item.data }} </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-1 d-flex align-items-center divdivchevron">
        <div class="btn p-2 bd-highlight bla d-flex align-items-center justify-content-center" v-on:click="addWeek">
          <i class="fas fa-chevron-circle-right chevron" style="color: #e7e7e7"></i>
        </div>
      </div>
    </div>
    <div class="ms-5 mt-5 row" v-if="user_role_connected == 'user'">
      <div class="col-1 d-flex align-items-center divdivchevron">
        <div class="btn p-2 bd-highlight bla d-flex align-items-center justify-content-center" v-on:click="removeWeek">
          <i class="fas fa-chevron-circle-left chevron" style="color: #e7e7e7"></i>
        </div>
      </div>
      <div class="col-10">
        <input type="date" class="form-control" v-on:change="selectWeek" v-model="calendar_choose">
        <table>
          <thead>
            <tr>
              <th class="hours"></th>
              <th>
                <span class="day">Mon {{ date[0] }}</span>
              </th>
              <th>
                <span class="day">Tue {{ date[1] }}</span>
              </th>
              <th>
                <span class="day">We {{ date[2] }}</span>
              </th>
              <th>
                <span class="day">Thur {{ date[3] }}</span>
              </th>
              <th>
                <span class="day">Fri {{ date[4] }}</span>
              </th>
              <th>
                <span class="day">Sat {{ date[5] }}</span>
              </th>
              <th>
                <span class="day">Sun {{ date[6] }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableau" v-bind:key="index">
              <td class="hour"><span>{{ index }}:00</span></td>
              <td v-for="(item, index2) in row" v-bind:key="index2" v-bind:class="{ 'working': item.bool }">
                <span> {{ item.data }} </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-1 d-flex align-items-center divdivchevron">
        <div class="btn p-2 bd-highlight bla d-flex align-items-center justify-content-center" v-on:click="addWeek">
          <i class="fas fa-chevron-circle-right chevron" style="color: #e7e7e7"></i>
        </div>
      </div>
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
                  <input type="datetime-local" class="form-control" id="startend" v-model="end_input" :min="start_input">
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
import jwt_decode from "jwt-decode";
import Nav from "./Nav.vue";
import swal from 'sweetalert';
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
      reload: 0,
      user_id_connected: -1,
      user_role_connected: "",
      week_choose: 0,
      calendar_choose: ""
    }
  },
  mounted: function () {
    if (localStorage.token) {
      var decoded = jwt_decode(localStorage.token);
      this.user_role_connected = decoded.user_role;
      this.user_id_connected = decoded.user_id;
      if (this.user_role_connected == "user" && this.$route.params.userId != this.user_id_connected) {
        this.$router.push("/workingtimes/"+this.user_id_connected);
      }
      this.getWorkingTimes();
      this.reload = 0;
    }else{
      this.$router.push("/login");
    }
  },
  updated: function () {
    if (this.reload==0) {
      this.getWorkingTimes();
      this.reload=1;
    }
  },
  methods: {
    selectWeek () {
      var selectdate = new Date(this.calendar_choose);
      var first1 = selectdate.getDate() - selectdate.getDay() + 1
      var sunday = false;
      if (selectdate.getDay() == 0) {
        sunday = true;
      }
      var now = new Date;
      var first2 = now.getDate() - now.getDay() + 1
      var selectdate2 = new Date(selectdate.setDate(first1))
      var now2 = new Date(now.setDate(first2))
      let diffInMilliSeconds = (selectdate2 - now2) / 1000;
      if (diffInMilliSeconds>=0) {
        const week = Math.floor(diffInMilliSeconds / 86400) % 6;
        diffInMilliSeconds -= week*86400
        const week2 = Math.floor(diffInMilliSeconds / 86400) / 6;
        this.week_choose = week2;
      }else{
        const week = Math.floor(diffInMilliSeconds / 86400) % 6;
        diffInMilliSeconds -= week*86400
        var week2 = Math.floor(diffInMilliSeconds / 86400) / 6;
        this.week_choose = week2;
      }
      if (sunday) {
        this.week_choose = this.week_choose - 1;
      }
      this.getWorkingTimes();
    },
    addWeek () {
      this.week_choose = this.week_choose + 1;
      this.getWorkingTimes();
    },
    removeWeek () {
      this.week_choose = this.week_choose - 1;
      this.getWorkingTimes();
    },
    goToWT (wtId, event) {
      if (wtId!=-1) {
        this.$router.push({ path: `/workingtime/${this.$route.params.userId}/${wtId}` })
      }else{
        var id = (event.target.id).split("-");
        var jour = this.date[parseInt(id[1])].split("/")[0];
        var mois = this.date[parseInt(id[1])].split("/")[1];
        if (id[0] < 10) {
          id[0] = "0" + id[0];
        }
        this.start_input = "2021-"+mois+"-"+jour+"T"+id[0]+":00";
        document.getElementById("openModalWTN").click();
      }
    },
    getWorkingTimes () {
      var curr = new Date;
      var curr2 = new Date; // get current date
      var first = null;
      var last = null
      first = curr.getDate() - curr.getDay() + 1 + ( this.week_choose * 7 ); // First day is the day of the month - the day of the week
      last = curr.getDate() - curr.getDay() + 7 + ( this.week_choose * 7 ); // last day is the first day + 6

      this.date = new Array(7);

      for (let i = 1; i < 8; i++) {
        var curr3 = new Date;
        var jour = curr.getDate() - curr.getDay() + i + ( this.week_choose * 7 );
        var thedate = new Date(curr3.setDate(jour));
        var month = "";
        if (thedate.getMonth()+1 < 10) {
          month = "0"+(thedate.getMonth()+1);
        }else{
          month = ""+(thedate.getMonth()+1);
        }
        if (thedate.getDate() < 10) {
          this.date[i-1] = "0"+thedate.getDate()+"/"+month;
        }else{
          this.date[i-1] = thedate.getDate()+"/"+month;
        }
        
      }

      var firstday = new Date(curr.setDate(first)).toISOString().split("T")[0]+" 00:00:00";
      var lastday = new Date(curr2.setDate(last)).toISOString().split("T")[0]+" 23:59:59";


      var myInit = { method: 'GET',
        headers: {'Authorization': localStorage.token},
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
      for (let i = 0; i < 7; i++) {
        var curr = new Date;
        var jour = curr.getDate() - curr.getDay() + i + 1 + ( this.week_choose * 7 );
        curr.setDate(jour);
        if (this.workingtimes!=undefined) {
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
                  let minute = hdebut.getMinutes();
                  if (minute < 10) {
                    minute = "0" + minute;
                  }
                  this.tableau[h2][i2].data = hdebut.getHours()+":"+minute;
                }
                if (h == hours - 1) {
                  let minute = hfin.getMinutes();
                  if (minute < 10) {
                    minute = "0" + minute;
                  }
                  this.tableau[h2][i2].data = hfin.getHours()+":"+minute;
                }
              }
            }
          });
        }
      }
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
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.token},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/workingtimes/"+this.$route.params.userId, myInit)
      .then(res => {
          if (res.ok) {
            document.getElementById("modalBtnCloseWT").click()
          }else{
            swal("Error", "Information send are wrong", "error");
          }
        }).then(this.getWorkingTimes)
    }
  }
}
</script>

<style> 
.WorkingtimesUser .col-10 input{
  width: 10em;
  height: 1.5em;
  margin-bottom: 0.5em;
}
.WorkingtimesUser .divdivchevron{
  margin-top: -2em;
}
.WorkingtimesUser .chevron{
  font-size: 1.5em;
}
.WorkingtimesUser .bla{
  height: 3.5em;
  width: 3.5em;
}
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
  background-color: #4d99b6;
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
.WorkingtimesUser table thead tr th.hours i {
  font-size: 1.5em;
}
.WorkingtimesUser table thead tr th:first-child {
  border-radius:3px 0 0 0;
}
.WorkingtimesUser table thead tr th:last-child {
  border-radius:0 3px 0 0;
}
.WorkingtimesUser table thead tr th .day {
  display: block;
  font-size: 1em;
  border-radius: 50%;
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