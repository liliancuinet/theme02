<template>
  <div class="ClockManager">
    <Nav/>
    <div class="row ms-5 d-flex justify-content-center">
      <div class="col-4 d-flex align-items-center justify-content-center">
        <div v-if="clockIn">
          {{ timeDiff }}
        </div>
      </div>
      <div class="col-4">
        <p class="btn py-3 pointer" v-if="!clockIn"  v-on:click="clock">Start your day</p>
        <p class="btn py-3 pointer" v-if="clockIn"  v-on:click="clock">Finish your day</p>
      </div>
      <div class="col-4">
        <p class="btn py-3 pointer" v-if="clockIn" v-on:click="refresh">Refresh the time</p>
      </div>
    </div>
    <div class="ms-5">
      <div class="tabClock">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Date / Hours</th>
              <th scope="col">Status</th>
              <th scope="col" v-if="user_role_connected != 'user'">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="clock in clocks" v-bind:key="clock.id">
              <td class="ps-0 pe-0">
                <div style="height:100%;width:100%">
                  {{ clock.time.replace("T", " ") }}
                </div>
              </td>
              <td class="ps-0 pe-0">
                <div v-if="clock.status" style="color: lightgreen">
                  Started
                </div>
                <div v-if="!clock.status" style="color: red">
                  Finished
                </div>
              </td>
              <td class="ps-0 pe-0" v-if="user_role_connected != 'user'">
                <div style="height:100%;width:100%" class="pointer" v-on:click="deleteClock(clock.id)">
                  <i class="fas fa-trash"></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import Nav from './Nav.vue'
export default {
  name: 'Clock',
  components: { Nav },
  data () {
    return {
      clocks: {},
      clockIn: false,
      startDateTime: null,
      timeDiff: "",
      user_id_connected: -1,
      user_role_connected: ""
    }
  },
  created: function () {
    if (localStorage.token) {
      var decoded = jwt_decode(localStorage.token);
      this.user_role_connected = decoded.user_role;
      this.user_id_connected = decoded.user_id;
      this.getClocks();
      window.setInterval(() => {
        this.refresh()
      }, 100)
    }else{
      this.$router.push("/login");
    }
  },
  methods: {
    deleteClock (clockId) {
      var myInit = { method: 'DELETE',
        headers: { 'Authorization': localStorage.token },
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/clocks/"+clockId, myInit).then(this.getClocks());
    },
    getClocks () {
      var myInit = { method: 'GET',
        headers: { 'Authorization': localStorage.token },
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/clocks/"+this.$route.params.userId, myInit)
        .then(res => {
          return res.json();
        }).then(this.setResults);
    },
    setResults (results) {
      this.clocks = results.data;
      this.clockIn = this.clocks[0].status;
      if (this.clockIn) {
        this.startDateTime = new Date(this.clocks[0].time);
        this.refresh;
      }else{
        this.startDateTime = null;
      }
    },
    refresh() {
      var now = new Date;
      let diffInMilliSeconds = Math.abs(now - this.startDateTime) / 1000;

      const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
      diffInMilliSeconds -= hours * 3600;

      const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
      diffInMilliSeconds -= minutes * 60;

      const secondes = Math.floor(diffInMilliSeconds) % 60;
      diffInMilliSeconds -= secondes * 60;

      if (hours<=0) {
        if (minutes<=0) {
          this.timeDiff = secondes + " s";
        }else{
          this.timeDiff = minutes + " min " + secondes + " s";
        }
      }else{
        this.timeDiff = hours + " h " + minutes + " min " + secondes + " s";
      }
    },
    clock() {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).split(".")[0];

      const object = { "clock": {
        "status": !this.clockIn,
        "time": localISOTime
        }
      };
      console.log(localISOTime);
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.token},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/clocks/"+this.$route.params.userId, myInit)
        .then(this.getClocks);
    }
  }
}
</script>

<style>
.ClockManager .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  color: #e7e7e7;
  background-color: #39697b;
}
.ClockManager .btn:hover{
  background-color: #4f76a0;
}
.ClockManager tbody {
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
  height: 30em;
}
.ClockManager thead {
  width: calc( 100% - 1em );
  display: table;
  width: 100%;
  table-layout: fixed;
}
.ClockManager tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;/* even columns width , fix width of table too*/
}
.ClockManager tbody::-webkit-scrollbar-track
{
	border-radius: 10px;
	background-color: #1e4753;
}
.ClockManager tbody::-webkit-scrollbar
{
	width: 9px;
	background-color: #1e4753;
}
.ClockManager tbody::-webkit-scrollbar-thumb
{
	border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #296172;
}
.pointer{
  cursor: pointer;
}
.ClockManager .link-graph-user{
  text-decoration: none;
  color: #e7e7e7;
  width: auto;
}
.ClockManager .table{
  color: #e7e7e7;
}
.ClockManager td,th {
  border-style: none;
}
.ClockManager thead {
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.ClockManager tbody tr:hover{
  background-color: #4f76a0;
}
</style>