import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import RealtimeMap from '../components/RealtimeMap.vue'
import Sites from '../components/Sites.vue'
import SiteInfo from '../components/SiteInfo.vue'
import SiteManagement from '../components/SiteManagement.vue'
import History from '../components/History.vue'
import Logs from '../components/Logs.vue'
import UserManagement from '../components/UserManagement.vue'
import Help from '../components/Help.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/realtimeMap',
        children: [
            {
                path: '/realtimeMap',
                component: RealtimeMap
            },
            {
                path: '/sites',
                component: Sites
            },
            {
                path: '/siteInfo',
                component: SiteInfo
            },
            {
                path: '/siteManagement',
                component: SiteManagement
            },
            {
                path: '/history',
                component: History
            },
            {
                path: '/logs',
                component: Logs
            },
            {
                path: '/userManagement',
                component: UserManagement
            },
            {
                path: '/help',
                component: Help
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next();
    }

    const tokenStr = store.state.userModule.token;
    if (!tokenStr) {
        return next('/login');
    } else {
        next();
    }
})

export default router
