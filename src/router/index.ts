import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'
import settings from './modules/settings'
import fleets from './modules/fleets'
import operators from './modules/operators'
import passengers from './modules/passengers'
import invoice from './modules/invoice'
import referral from './modules/referral'

const Home = () => import('@/views/HomeView.vue')
const Profile = () => import('@/views/ProfileView.vue')
const Settings = () => import('@/views/settings/index.vue')
const Login = () => import('@/views/LoginView.vue')

const routes = [
    { 
        path: '/', 
        name: 'home', 
        component: Home,
        meta: { 
            public: false,
            layout: 'default-layout' 
        }
    },
    { 
        path: '/login', 
        name: 'login', 
        component: Login, 
        meta: { 
            public: true,
            layout: 'auth-layout' 
        } 
    },
    ...fleets,
    ...operators,
    ...passengers,
    ...invoice,
    ...referral,
    ...settings
]

export const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
    const isAuth = store.getters['auth/isAuthenticated']
    if (!to.meta.public && !isAuth) return { name: 'login' }
    if (to.name === 'login' && isAuth) return { name: 'home' }
})
