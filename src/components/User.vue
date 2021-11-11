<template>
    <div class="userList">
      <div class="container deco d-flex justify-content-center align-items-center">
        <div class="row">
          <div class="col-8 pointer" data-bs-toggle="modal" data-bs-target="#ModalUserUp">
            {{ user_current.username }}
          </div>
          <div class="col-4 pointer" v-on:click="logout">
            <i class="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
      <div class="container m-4" v-if="user_role_connected != 'user'">
        <div class="row d-flex justify-content-center mt-3">
          <div class="col-6">
            <router-link :to="'/'" class="btn py-3">Dashboard</router-link>
          </div>
          <div class="col-6">
            <a href="#" class="btn py-3" data-bs-toggle="modal" data-bs-target="#ModalUser" v-on:click="addUser">Create User</a>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-auto mt-3">
            <p class="title-user ">All Users</p>
          </div>
        </div>
        <div class="tabUser">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" v-bind:key="user.id">
                <td class="ps-0 pe-0">
                  <router-link :to="'/graph/'+user.id" class="link-graph-user">
                    <div style="height:100%;width:100%">
                      {{user.username}}
                    </div>
                  </router-link>
                </td>
                <td>
                  <div class="row ps-3 d-flex justify-content-center">
                    <a href="#" class="link-graph-user">
                      <div data-bs-toggle="modal" data-bs-target="#ModalUser" v-on:click="editUser(user.id)">
                        <i class="far fa-edit"></i>
                      </div>
                    </a>
                    <a href="#" class="link-graph-user">
                      <div v-on:click="deleteUser(user.id)">
                        <i class="fas fa-trash"></i>
                      </div>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ClockUser v-if="user_role_connected == 'user'"/>
      <div class="modal fade" id="ModalUser" tabindex="-1" aria-labelledby="ModalUserLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalUserLabel">{{ titleModal }} User</h5>
              <button type="button" id="modalBtnClose" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="username" class="form-label">Username :</label>
                  <input type="text" class="form-control" id="username" v-model="username_input" placeholder="username">
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email :</label>
                  <input type="text" class="form-control" id="email" v-model="email_input" placeholder="email">
                </div>
                <div class="mb-3">
                  <label for="role" class="form-label">Select a role :</label>
                  <select class="form-select" aria-label="Default select example"  v-model="role_select">
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" v-on:click="resetInput">Reset</button>
              <button type="button" class="btn" v-if="titleModal == 'Create'" v-on:click="createUser">{{titleModal}}</button>
              <button type="button" class="btn" v-if="titleModal == 'Update'" v-on:click="updateUser">{{titleModal}}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="ModalUserUp" tabindex="-1" aria-labelledby="ModalUserUPLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalUserLabel">Update my profile</h5>
              <button type="button" id="modalBtnClose2" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="username" class="form-label">Username :</label>
                  <input type="text" class="form-control" id="username2" v-model="username_input2" placeholder="username">
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email :</label>
                  <input type="text" class="form-control" id="email2" v-model="email_input2" placeholder="email">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password :</label>
                  <input type="password" class="form-control" id="password" v-model="pwd_input" placeholder="password">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" v-on:click="updateCurrentUser">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import jwt_decode from "jwt-decode";
var sha256 = require('js-sha256').sha256;
import swal from 'sweetalert';
import ClockUser from './ClockUser.vue';
export default {
  name: 'User',
  props: {},
  components: {
    ClockUser
  },
  data () {
    return {
      users: {},
      titleModal: "Create",
      email_input: "",
      username_input: "",
      email_input2: "",
      username_input2: "",
      pwd_input: "",
      role_select: "",
      id_input: -1,
      user_id_connected: -1,
      user_role_connected: "",
      user_current: {}
    }
  },
  mounted() {
    if (localStorage.token) {
      var decoded = jwt_decode(localStorage.token);
      this.user_role_connected = decoded.user_role;
      this.user_id_connected = decoded.user_id;
      if (this.user_role_connected!="user") {
        this.getUser();
      }
      this.getCurrentUser();
    }else{
      this.$router.push("/login");
    }
  },
  methods: {
    getCurrentUser() {
      var myInit = { method: 'GET',
      headers: {'Authorization': localStorage.token},
      mode: 'cors',
      cache: 'default' };

      fetch("http://127.0.0.1:4000/api/users/"+this.user_id_connected, myInit)
        .then(res => {
          return res.json();
        }).then(this.setResults2);
    },
    setResults2 (results) {
      this.user_current = results.data;
      this.username_input2 = this.user_current.username;
      this.email_input2 = this.user_current.email;
    },
    logout () {
      delete localStorage.token;
      this.$router.push("/login");
    },
    updateCurrentUser () {
      const object = { "user": {
        "username": this.username_input2,
        "email": this.email_input2,
        "role": this.user_role_connected,
        "password": sha256(this.pwd_input)
        }
      };
      var myInit = { method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.token},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/users/"+this.user_id_connected, myInit)
      .then(res => {
          if (res.ok) {
            document.getElementById("modalBtnClose2").click()
          }else{
            swal("Error", "Information send are wrong", "error");
          }
        }).then(this.getUser)
    },
    updateUser () {
      const object = { "user": {
        "username": this.username_input,
        "email": this.email_input,
        "role": this.role_select
        }
      };
      var myInit = { method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.token},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/users/"+this.id_input, myInit)
      .then(res => {
          if (res.ok) {
            document.getElementById("modalBtnClose").click()
          }else{
            swal("Error", "Information send are wrong", "error");
          }
        }).then(this.getUser)
    },
    editUser (userId) {
      this.titleModal = "Update";
      this.id_input = userId;
      var username;
      var email;
      var role;
      this.users.forEach(function(user){
        if (user.id == userId) {
          username = user.username;
          email = user.email;
          role = user.role;
        }
      });
      this.username_input = username;
      this.email_input = email;
      this.role_select = role;
    },
    addUser () {
      this.username_input = "";
      this.email_input = "";
      this.role_select = "user";
      this.id_input = -1;
      this.titleModal = "Create"
    },
    createUser () {
      const object = { "user": {
        "username": this.username_input,
        "email": this.email_input,
        "password": sha256("default"),
        "role": this.role_select
        }
      };
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.token},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/users/", myInit)
      .then(res => {
          if (res.ok) {
            document.getElementById("modalBtnClose").click()
          }else{
            swal("Error", "Information send are wrong", "error");
          }
        }).then(this.getUser)
    },
    resetInput (){
      this.email_input = "";
      this.username_input = "";
    },
    deleteUser (userId) {

      var myInit = { method: 'DELETE',
        headers: {'Authorization': localStorage.token},
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/users/"+userId, myInit).then(this.getUser);
    },
    getUser () {

      var myInit = { method: 'GET',
        headers: {'Authorization': localStorage.token},
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/users", myInit)
        .then(res => {
          return res.json();
        }).then(this.setResults);
    },
    setResults (results) {
      this.users = results.data;
    }
  }
}
</script>

<style >
.userList .deco{
  height: 3em !important;
}
.userList .link-graph-user{
  text-decoration: none;
  color: #e7e7e7;
  width: auto;
}
.userList tbody {
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
  height: 29em;
}
.userList thead {
  width: calc( 100% - 1em );
  display: table;
  width: 100%;
  table-layout: fixed;
}
.userList tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;/* even columns width , fix width of table too*/
}
.userList tbody::-webkit-scrollbar-track
{
	border-radius: 10px;
	background-color: #39697b;
}

.userList tbody::-webkit-scrollbar
{
	width: 9px;
	background-color: #39697b;
}

.userList tbody::-webkit-scrollbar-thumb
{
	border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #296172;
}
.userList .container{
  background-color: #39697b;
  width: 20em;
  height: 42em;
  border: solid 2px #39697b;
}
.userList .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  color: #e7e7e7;
}
.userList .btn:hover{
  background-color: #4f76a0;
}
.userList .title-user{
  font-size: 1.4em;
  border-bottom: solid 2px #e7e7e7;
}
.userList .table{
  color: #e7e7e7;
}
.userList td,th {
  border-style: none;
}
.userList thead {
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.userList tbody tr:hover{
  background-color: #4f76a0;
}
.userList .modal-content{
  background-color: #1e4753;
}
.userList .btn-close{
  color: #e7e7e7;
}
.userList .modal-body input{
  background-color: #596869;
  color: #e7e7e7;
}
.userList .modal-body ::placeholder{
  color: #e7e7e7;
  opacity: 0.6;
}
.userList .modal-body select{
  background-color: #596869;
  color: #e7e7e7;
}
</style>