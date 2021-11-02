import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import GraphUser from './components/GraphUser.vue';
import Graph from './components/Graph.vue';
import WorkingTimes from './components/WorkingTimes.vue';
import WorkingTime from './components/WorkingTime.vue';

Vue.use(VueRouter);
Vue.config.productionTip = false;

const routes = [
  { path: '/graph/:userId', component: GraphUser },
  { path: '/', component: Graph },
  { path: '/workingtimes/:userId', component: WorkingTimes },
  { path: '/workingtime/:userId/:workingtimeid', component: WorkingTime }
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
