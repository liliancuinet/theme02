<template>
  <div class="graphUser">
    <Nav/>
  </div>
</template>

<script>
import Nav from './Nav.vue'
export default {
  components: {
    Nav
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