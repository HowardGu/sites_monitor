import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://10.236.206.252:1016/v1/auth/'
Vue.prototype.$http = axios

Vue.prototype.$localTest = true

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
