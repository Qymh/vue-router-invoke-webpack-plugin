import Vue from 'vue';
import App from './App.vue';
import router from '../.invoke/router';

console.log(1);

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
