<template>
  <div class="ClockUser">
    <div class="row my-4 d-flex justify-content-center">
      <div>
        {{ timeDiff }}
      </div>
    </div>
    <div class="row px-5 d-flex justify-content-center">
      <p class="btn py-3 pointer" v-if="!clockIn"  v-on:click="clock">Start your day</p>
      <p class="btn py-3 pointer" v-if="clockIn"  v-on:click="clock">Finish your day</p>
    </div>
    <div class="mx-5">
      <div class="tabClock">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Date / Hours</th>
              <th scope="col">Status</th>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: 'ClockUser',
  data () {
    return {
      clocks: {},
      clockIn: false,
      startDateTime: null,
      timeDiff: "Travail non démarré",
      user_id_connected: -1,
      user_role_connected: ""
    }
  },
  mounted: function () {
    if (localStorage.token) {
      var decoded = jwt_decode(localStorage.token);
      this.user_role_connected = decoded.user_role;
      this.user_id_connected = decoded.user_id;
      this.getClocks();
      window.setInterval(() => {
        if (this.clockIn) {
          this.refresh();
        }
      }, 100)
    }
  },
  methods: {
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
      if (this.clocks.length != 0) {
        this.clockIn = this.clocks[0].status;
      }else{
        this.clockIn = false;
      }
      if (this.clockIn) {
        this.startDateTime = new Date(this.clocks[0].time);
        this.refresh();
      }else{
        this.startDateTime = null;
        this.timeDiff = "Travail non démarré";
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
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.token},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/clocks/"+this.$route.params.userId, myInit)
        .then(res => {
          return res.json();
        }).then(this.getClocks);
    }
  }
}
</script>

<style>
.ClockUser .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  color: #e7e7e7;
  background-color: #39697b;
}
.ClockUser .btn:hover{
  background-color: #4f76a0;
}
.ClockUser tbody {
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
  height: 30em;
}
.ClockUser thead {
  width: calc( 100% - 1em );
  display: table;
  width: 100%;
  table-layout: fixed;
}
.ClockUser tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;/* even columns width , fix width of table too*/
}
.ClockUser tbody::-webkit-scrollbar-track
{
	border-radius: 10px;
	background-color: #1e4753;
}
.ClockUser tbody::-webkit-scrollbar
{
	width: 9px;
	background-color: #1e4753;
}
.ClockUser tbody::-webkit-scrollbar-thumb
{
	border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #296172;
}
.pointer{
  cursor: pointer;
}
.ClockUser .link-graph-user{
  text-decoration: none;
  color: #e7e7e7;
  width: auto;
}
.ClockUser .table{
  color: #e7e7e7;
}
.ClockUser td,th {
  border-style: none;
}
.ClockUser thead {
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.ClockUser tbody tr:hover{
  background-color: #4f76a0;
}
</style>