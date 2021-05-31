import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://10.236.206.252:1016/v1/'
Vue.prototype.$http = axios

Vue.prototype.$localTest = false

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
