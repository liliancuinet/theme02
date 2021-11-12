<template>
  <div class="WorkingtimeUser">
    <Nav/>
    <div class="mt-7 ms-5">
      <div class="row mt-5">
        <h3>WorkingTime's N°{{ $route.params.workingtimeid }}</h3>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <h5>User's informations</h5>
          <p class="mt-4 mb-1">Username: {{ user.username }}</p>
          <p class="mt-1 mb-1">Email: {{ user.email }}</p>
          <p class="mt-1">Role: {{ user.role }}</p>
        </div>
        <div class="col-6">
          <h5>WorkingTime's informations</h5>
          <p class="mt-4 mb-1">Start at: {{ workingtime.start }}</p>
          <p class="mt-1">End at: {{ workingtime.end }}</p>
        </div>
      </div>
      <div class="row d-flex justify-content-center mt-5">
        <div class="col-auto d-flex align-items-center justify-content-center">
          <a href="#" class="btn py-3" data-bs-toggle="modal" data-bs-target="#ModalWorkingTimeUpdate">Update WorkingTime</a>
        </div>
        <div class="col-auto d-flex align-items-center justify-content-center">
          <button class="btn py-3" v-on:click="deleteWorkingtime">Delete WorkingTime</button>
        </div>
      </div>
    </div>
    <div class="modal fade" id="ModalWorkingTimeUpdate" tabindex="-1" aria-labelledby="ModalUserLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalUserWTULabel">Update WorkingTimes</h5>
            <button type="button" id="modalBtnCloseWTU" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="startdate" class="form-label">Start :</label>
                <input type="datetime-local" class="form-control" id="startdate" v-model="start_update_input">
              </div>
              <div class="mb-3">
                <label for="startend" class="form-label">End :</label>
                <input type="datetime-local" class="form-control" id="startend" v-model="end_update_input">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" v-on:click="resetInput">Reset</button>
            <button type="button" class="btn" v-on:click="updateWorkingTime">Update</button>
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
  name: 'WorkingTime',
  props: {},
  components: {
    Nav
  },
  data () {
    return {
      workingtime: {},
      user: {},
      start_input: "",
      end_input: "",
      start_update_input: "",
      end_update_input: "",
      user_id_connected: -1,
      user_role_connected: ""
    }
  },
  mounted: function () {
    if (localStorage.token) {
      var decoded = jwt_decode(localStorage.token);
      this.user_role_connected = decoded.user_role;
      this.user_id_connected = decoded.user_id;
      if (this.user_role_connected == "user") {
        this.$router.push("/workingtimes/"+this.user_id_connected);
      }else{
        this.getWorkingTime();
        this.getUser();
      }
    }else{
      this.$router.push("/login");
    }
  },
  methods: {
    deleteWorkingtime () {

      var myInit = { method: 'DELETE',
        headers: { 'Authorization': localStorage.token },
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/workingtimes/"+this.$route.params.workingtimeid, myInit)
      .then(this.$router.push("/workingtimes/"+this.$route.params.userId));
    },
    updateWorkingTime () {
      const object = { "working_time": {
        "start": this.start_update_input,
        "end": this.end_update_input
        }
      };
      var myInit = { method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.token},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/workingtimes/"+this.$route.params.workingtimeid, myInit)
      .then(res => {
          if (res.ok) {
            document.getElementById("modalBtnCloseWTU").click()
          }else{
            swal("Error", "Information send are wrong", "error");
          }
        }).then(this.getWorkingTime)
    },
    getUser () {

      var myInit = { method: 'GET',
        headers: { 'Authorization': localStorage.token },
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/users/"+this.$route.params.userId, myInit)
        .then(res => {
          return res.json();
        }).then(this.setUserResults);
    },
    setUserResults (results) {
      this.user = results.data;
    },
    getWorkingTime () {

      var myInit = { method: 'GET',
        headers: { 'Authorization': localStorage.token },
        mode: 'cors',
        cache: 'default' };

      fetch(`http://127.0.0.1:4000/api/workingtimes/${this.$route.params.userId}/${this.$route.params.workingtimeid}`, myInit)
        .then(res => {
          return res.json();
        }).then(this.setResults);
    },
    setResults (results) {
      this.workingtime = results.data;
      var start = this.workingtime.start;
      var end = this.workingtime.end;
      this.start_update_input = this.workingtime.start;
      this.end_update_input = this.workingtime.end;
      this.workingtime.start = start.replace("T", " ");
      this.workingtime.end = end.replace("T", " ");
    },
    resetInput (){
      this.start_input = "";
      this.end_input = "";
    }
  }
}
</script>

<style>
.WorkingtimeUser .mt-7{
  margin-top: 7em;
}
.WorkingtimeUser .modal-body input{
  background-color: #596869;
  color: #e7e7e7;
}
.WorkingtimeUser .modal-body ::placeholder{
  color: #e7e7e7;
  opacity: 0.6;
}
.WorkingtimeUser .modal-content{
  background-color: #1e4753;
}
.menu{
  height: 7em;
}
.WorkingtimeUser .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #39697b;
  color: #e7e7e7;
}
.WorkingtimeUser .btn:hover{
  background-color: #4f76a0;
}
</style>