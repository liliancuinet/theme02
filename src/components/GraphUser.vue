<template>
  <div class="graphUser">
    <Nav/>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import Nav from "./Nav.vue";
export default {
  components: {
    Nav
  },
  data () {
    return {
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
      }
    }else{
      this.$router.push("/login");
    }
  }
}
</script>

<style>
.graphUser .menu{
  height: 7em;
}
.graphUser .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #39697b;
  color: #e7e7e7;
}
.graphUser .btn:hover{
  background-color: #4f76a0;
}
</style>