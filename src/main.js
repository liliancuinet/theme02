import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import GraphUser from './components/GraphUser.vue';
import Graph from './components/Graph.vue';
import WorkingTimes from './components/WorkingTimes.vue';
import WorkingTime from './components/WorkingTime.vue';
import Clock from './components/Clock.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

Vue.use(VueRouter);
Vue.config.productionTip = false;

const routes = [
  { path: '/graph/:userId', component: GraphUser },
  { path: '/', component: Graph },
  { path: '/workingtimes/:userId', component: WorkingTimes },
  { path: '/workingtime/:userId/:workingtimeid', component: WorkingTime },
  { path: '/clock/:userId', component: Clock },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
