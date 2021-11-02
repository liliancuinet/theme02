<template>
  <div id="app">
    <div class="row">
      <div class="col-9">
        <router-view></router-view>
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
