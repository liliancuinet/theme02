<template>
  <div class="LoginPage d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row mt-4 mb-4">
        <h4>Login</h4>
      </div>
      <div class="row d-flex align-items-center">
        <form>
          <div class="mb-3">
            <label for="email" class="form-label">Email :</label>
            <input type="text" class="form-control" id="email" v-model="email_input" placeholder="email">
          </div>
          <div class="mb-3">
            <label for="pwd" class="form-label">Password :</label>
            <input type="password" class="form-control" id="pwd" v-model="pwd_input" placeholder="Password">
          </div>
        </form>
      </div>
      <div class="row mt-4">
        <div class="col-6">
          <button type="button" class="btn" v-on:click="goToRegister">Register</button>
        </div>
        <div class="col-6">
          <button type="button" class="btn"  v-on:click="login">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert';
var sha256 = require('js-sha256').sha256;
export default {
  name: 'Register',
  data () {
    return {
      email_input: "",
      pwd_input: ""
    }
  },
  beforeMount() {
    if (localStorage.token ) {
      this.$router.push("/");
    }
  },
  methods: {
    goToRegister() {
      this.$router.push("/register")
    },
    login() {
      const object = { 
          "email": this.email_input,
          "password": sha256(this.pwd_input)
      };
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/login", myInit)
      .then(res => {
          return res.json();
        }).then(this.setResults);
    },
    setResults (results) {
      if (results.token) {
        localStorage.token = results.token;
        if (results.user_role == "user") {
          this.$router.push("/workingtimes/"+results.user_id);
        }else{
          this.$router.push("/");
        }
      }else{
        swal("Error", "Information send are wrong", "error");
      }
    }
  }
}
</script>

<style>
.LoginPage {
  height: 43em;
}
.LoginPage .container{
  background-color: #39697b;
  width: 24em;
  height: 23em;
  border: solid 2px #39697b;
}
.LoginPage .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  color: #e7e7e7;
}
.LoginPage .btn:hover{
  background-color: #4f76a0;
}
.LoginPage input{
  background-color: #596869;
  color: #e7e7e7;;
}
.LoginPage ::placeholder{
  color: #e7e7e7;
  opacity: 0.6;
}
</style>