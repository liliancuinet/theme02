<template>
  <div id="app">
    <div v-if="isLoginpath()">
      <router-view></router-view>
    </div>
    <div class="row" v-if="!isLoginpath()">
      <div class="col-9">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <div class="col-3 d-flex justify-content-end">
        <User/>
      </div>
    </div>
  </div>
</template>

<script>
import User from './components/User.vue'

export default {
  name: 'App',
  components: {
    User
  },
  created() {
    if (localStorage.token) {
      const object = {
        "token": localStorage.token
      };
      var myInit = { method: 'POST',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        body: JSON.stringify(object),
        cache: 'default' };
      
      fetch("http://127.0.0.1:4000/api/verif", myInit)
      .then(res => {
          if (res.status == 401) {
            delete localStorage.token;
          }
        })
    }
  },
  methods: {
    isLoginpath () {
      if (this.$route.path === '/login' || this.$route.path === '/register') {
        return true;
      }else{
        return false;
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e7e7e7;
  background-color: #1e4753;
  overflow: hidden;
  height: 100%;
}
</style>
