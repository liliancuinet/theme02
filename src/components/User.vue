<template>
    <div class="userList">
      <div class="container m-4">
        <div class="row d-flex justify-content-center mt-3">
          <div class="col-6">
            <a href="#" class="btn py-3">Dashboard</a>
          </div>
          <div class="col-6">
            <a href="#" class="btn py-3" data-bs-toggle="modal" data-bs-target="#ModalUser">Create User</a>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-auto mt-3">
            <p class="title-user ">All Users</p>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" v-bind:key="user.id">
              <td>{{user.username}}</td>
              <td class="d-flex justify-content-center">
                <i class="far fa-edit me-2" data-bs-toggle="modal" data-bs-target="#ModalUser" v-on:click="editUser(user.id)"></i>
                <i class="fas fa-trash" v-on:click="deleteUser(user.id)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal fade" id="ModalUser" tabindex="-1" aria-labelledby="ModalUserLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalUserLabel">{{ titleModal }}</h5>
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
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" v-on:click="resetInput">Reset</button>
              <button type="button" class="btn" v-on:click="createUser">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'User',
  props: {},
  data () {
    return {
      users: {},
      titleModal: "Create User",
      email_input: "",
      username_input: "",
      id_input: -1
    }
  },
  created: function () {
    this.getUser();
  },
  methods: {
    editUser (userId) {
      this.titleModal = "Update User";
      this.id_input = userId;
      var username;
      var email;
      this.users.forEach(function(user){
        if (user.id == userId) {
          username = user.username;
          email = user.email;
        }
      });
      this.username_input = username;
      this.email_input = email;
    },
    createUser () {
      const object = { "user": {
        "username": this.username_input,
        "email": this.email_input
        }
      };
      console.log(JSON.stringify(object));
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/users/", myInit)
      .then(res => {
          if (res.ok) {
            document.getElementById("modalBtnClose").click()
          }
        }).then(this.getUser)
    },
    resetInput (){
      this.email_input = "";
      this.username_input = "";
    },
    deleteUser (userId) {
      var myHeaders = new Headers();

      var myInit = { method: 'DELETE',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/users/"+userId, myInit).then(this.getUser);
    },
    getUser () {
      var myHeaders = new Headers();

      var myInit = { method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default' };

      fetch("http://127.0.0.1:4000/api/users", myInit)
        .then(res => {
          return res.json();
        }).then(this.setResults);
    },
    setResults (results) {
      this.users = results.data;
      console.log(this.users);
    }
  }
}
</script>

<style >
.userList .container{
  background-color: #39697b;
  width: 20em;
  height: 44em;
  border: solid 2px #1b3b5e;
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
  color: #e7e7e7;;
}
.userList .modal-body ::placeholder{
  color: #e7e7e7;
  opacity: 0.6;
}
</style>