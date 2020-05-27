import Vue from 'vue'
import App from './App.vue'
import 'w3-css/w3.css'
import 'font-awesome/css/font-awesome.css'
import VueAxios from 'vue-axios'
import axios from './AxiosInit'

Vue.use(VueAxios, axios)

new Vue({
  render: h => h(App),
}).$mount('#app')
