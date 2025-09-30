import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'

/* import settings from './modules/settings'
import fleets from './modules/fleets'
import operators from './modules/operators'
import passengers from './modules/passengers'
import invoice from './modules/invoice'
import referral from './modules/referral' */

import prospects from './modules/prospects'


const Home = () => import('@/views/HomeView.vue')
const Profile = () => import('@/views/ProfileView.vue')
const Settings = () => import('@/views/settings/index.vue')
const Login = () => import('@/views/LoginView.vue')


const routes = [
    { 
        path: '/', 
        name: 'login', 
        component: Login, 
        meta: { 
            public: true,
            layout: 'auth-layout' 
        } 
    },
    { 
        path: '/dashboard', 
        name: 'home', 
        component: Home,
        meta: { 
            public: false,
            layout: 'default-layout' 
        }
    },
    ...prospects,
    /* ...fleets,
    ...operators,
    ...passengers,
    ...invoice,
    ...referral,
    ...settings */
]

export const router = createRouter({ 
    history: createWebHistory(), 
    routes 
})

router.beforeEach(async(from, to, next) => {


    store.commit('auth/GET_SESSION')
    const appid = store.getters['auth/appid']
    await store.dispatch('auth/me')

    console.log(appid, 'appid')
    console.log(from.meta, 'from')
    console.log(to.meta, 'to')

    console.log(appid, from.meta.public)


    if(appid == null && !from.meta.public) {
        console.log(1231)
        next({
            name: 'login'
        })
        return
    }
    else if(appid != null && from.meta.public) {

        next({
            name: 'home'
        })
        return
    }
    
    console.log(333)
    next()

    /* const isAuth = store.getters['auth/isAuthenticated']
    if (!to.meta.public && !isAuth) return { name: 'login' }
    if (to.name === 'login' && isAuth) return { name: 'home' } */
})
