<template>
  <div class="registerPage d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row mt-4 mb-4">
        <h4>Registration</h4>
      </div>
      <div class="row d-flex align-items-center">
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
            <label for="pwd" class="form-label">Password :</label>
            <input type="text" class="form-control" id="pwd" v-model="pwd_input" placeholder="Password">
          </div>
        </form>
      </div>
      <div class="row mt-4">
        <div class="col-6">
          <button type="button" class="btn" v-on:click="goToLogin">Login</button>
        </div>
        <div class="col-6">
          <button type="button" class="btn"  v-on:click="createUser">Register</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      email_input: "",
      username_input: "",
      pwd_input: ""
    }
  },
  beforeCreate() {
    if (!localStorage.user_role) {
      this.$router.push("/");
    }
  },
  methods: {
    goToLogin() {
      this.$router.push("/login")
    },
    createUser() {
      const object = { "user": {
        "username": this.username_input,
        "email": this.email_input,
        "password": this.pwd_input,
        "role": "user"
        }
      };
      console.log(JSON.stringify(object));
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/users/", myInit)
      .then(this.$router.push("/login"))
    }
  }
}
</script>

<style>
.registerPage {
  height: 43em;
}
.registerPage .container{
  background-color: #39697b;
  width: 24em;
  height: 28em;
  border: solid 2px #39697b;
}
.registerPage .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  color: #e7e7e7;
}
.registerPage .btn:hover{
  background-color: #4f76a0;
}
.registerPage input{
  background-color: #596869;
  color: #e7e7e7;;
}
.registerPage ::placeholder{
  color: #e7e7e7;
  opacity: 0.6;
}
</style>