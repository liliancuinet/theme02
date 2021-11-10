<template>
  <div>
    <div class="row menu d-flex justify-content-center ms-5" v-if="user_role_connected != 'user'">
      <div class="col-auto d-flex align-items-center justify-content-center" >
        <router-link :to="'/graph/'+$route.params.userId" class="btn py-3">Statistics</router-link>
      </div>
      <div class="col-auto d-flex align-items-center justify-content-center ms-5 me-5">
        <router-link :to="'/workingtimes/'+$route.params.userId" class="btn py-3">Working Times</router-link>
      </div>
      <div class="col-auto d-flex align-items-center justify-content-center">
        <router-link :to="'/clock/'+$route.params.userId" class="btn py-3">Manage Clock</router-link>
      </div>
    </div>
    <div class="row menu d-flex justify-content-center ms-5" v-if="user_role_connected == 'user'">
      <div class="col-auto d-flex align-items-center justify-content-center ms-5 me-5">
        <router-link :to="'/workingtimes/'+user_id_connected" class="btn py-3">Working Times</router-link>
      </div>
      <div class="col-auto d-flex align-items-center justify-content-center">
        <router-link :to="'/clock/'+user_id_connected" class="btn py-3">Clock</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: 'Nav',
  data () {
    return {
      user_id_connected: -1,
      user_role_connected: ""
    }
  },
  created: function () {
    if (localStorage.token) {
      var decoded = jwt_decode(localStorage.token);
      this.user_role_connected = decoded.user_role;
      this.user_id_connected = decoded.user_id;
    }else{
      this.$router.push("/login");
    }
  }
}
</script>

<style>
.menu{
  height: 7em;
}
.menu .btn{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #39697b;
  color: #e7e7e7;
  width: 135px;
}
.menu .btn:hover{
  background-color: #4f76a0;
}
</style>