<template>
  <div class="graphUser">
    <div class="row menu d-flex justify-content-center">
      <div class="col-auto d-flex align-items-center justify-content-center">
        <router-link :to="'/graph/'+$route.params.userId" class="btn py-3">Statistics</router-link>
      </div>
      <div class="col-auto d-flex align-items-center justify-content-center ms-5 me-5">
        <router-link :to="'/workingtimes/'+$route.params.userId" class="btn py-3">Working Times</router-link>
      </div>
      <div class="col-auto d-flex align-items-center justify-content-center">
        <router-link :to="'#'" class="btn py-3">Edit Statistics</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  
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