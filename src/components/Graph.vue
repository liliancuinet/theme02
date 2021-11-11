<template>
  <div>
    GRAPHIQUE Generale
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
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
  },
  data () {
    return {
      user_id_connected: -1,
      user_role_connected: ""
    }
  }
}
</script>

<style>

</style>