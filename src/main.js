import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import store from './store';

import axios from 'axios'
import VueAxios from 'vue-axios';

Vue.config.productionTip = false

Vue.use(VueAxios, axios);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
