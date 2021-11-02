<template>
  <div class="NavWT">
    <div class="row menu d-flex justify-content-center">
      <div class="col-auto d-flex align-items-center justify-content-center">
        <router-link :to="'/graph/'+$route.params.userId" class="btn py-3">Statistics</router-link>
      </div>
      <div class="col-auto d-flex align-items-center justify-content-center ms-5 me-5">
        <router-link :to="'/workingtimes/'+$route.params.userId" class="btn py-3">Working Times</router-link>
      </div>
      <div class="col-auto d-flex align-items-center justify-content-center">
        <a href="#" class="btn py-3" data-bs-toggle="modal" data-bs-target="#ModalWorkingTime">Create WorkingTimes</a>
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
export default {
  name: 'Nav',
  props: {},
  data () {
    return {
      start_input: "",
      end_input: "",
    }
  },
  methods: {
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
.NavWT .modal-body input{
  background-color: #596869;
  color: #e7e7e7;;
}
.NavWT .modal-body ::placeholder{
  color: #e7e7e7;
  opacity: 0.6;
}
.NavWT .modal-content{
  background-color: #1e4753;
}
.menu{
  height: 7em;
}
.NavWT .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #39697b;
  color: #e7e7e7;
}
.NavWT .btn:hover{
  background-color: #4f76a0;
}
.NavWT .working {
  background-color: blue;
  color: black;
  font-size: 13px;
  cursor: pointer;
}
.NavWT table {
  font-family:sans-serif;
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;
  table-layout: fixed;
  margin-bottom: 50px;
}
.NavWT table thead tr th {
  background: #626E7E;
  color: lighten(#626E7E, 40%);
  padding: 0.5em;
  overflow: hidden;
}
.NavWT table thead tr th.hours {
  width: 4em;
}
.NavWT table thead tr th:first-child {
  border-radius:3px 0 0 0;
}
.NavWT table thead tr th:last-child {
  border-radius:0 3px 0 0;
}
.NavWT table thead tr th .day {
  display: block;
  font-size: 1.2em;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 auto 5px;
  padding: 5px;
  line-height: 1.8;
}
.NavWT table thead tr th .short {
  display: none;
}
.NavWT table thead tr th i {
  vertical-align: middle;
  font-size: 2em;
}
.NavWT table tbody tr:nth-child(nth-child(4n+0)) td {
  border-bottom:1px solid #626E7E;
}
.NavWT table tbody tr td {
  text-align: center;
  vertical-align: middle;
  border-left: 1px solid #626E7E;
  position: relative;
  height: 23px;
  background: lightgray;
}
.NavWT table tbody tr td:last-child {
  border-right:1px solid #626E7E;
}
.NavWT table tbody tr .hour {
  font-size: 10px;
  padding: 0;
  color: #626E7E;
  background: #fff;
  border-bottom:1px solid #626E7E;
  border-collapse: separate;
  min-width: 100px;
}

.NavWT table tbody tr .hour span {
  display: block;
}
</style>