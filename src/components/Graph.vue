<template>
  <div>
    GRAPHIQUE Generale
  </div>
</template>

<script>
export default {
  created: function () {
    if (localStorage.user_role) {
      this.user_role_connected = localStorage.user_role;
      this.user_id_connected = localStorage.user_id;
      if (localStorage.user_role == "user") {
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