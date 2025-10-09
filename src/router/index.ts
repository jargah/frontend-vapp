import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'


import users from './modules/users'
import prospects from './modules/prospects'
import operators from './modules/operators'
import passengers from './modules/passengers'
import vehicles from './modules/vehicles'
import typeMotor from './modules/type_motor'
import typePayment from './modules/type_payment'
import typeTaxi from './modules/type_taxi'
import travels from './modules/travels'
import fleets from './modules/fleets'


const Home = () => import('@/views/HomeView.vue')
const Login = () => import('@/views/LoginView.vue')


const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
        meta: {
            public: true,
            layout: 'auth-layout',
        }
    },
    {
        path: '/dashboard',
        name: 'home',
        component: Home,
        meta: {
            public: false,
            layout: 'default-layout',
            access: [1,2,3,4]
        }
    },
    {
        path: '/no-access',
        name: 'no-access',
        component: () => import('@/views/NoAccessView.vue'),
        meta: {
            public: false,
            layout: 'default-layout',
            access: [1,2,3,4]
        }
    },
    ...users,
    ...prospects,
    ...operators,
    ...passengers,
    ...vehicles,
    ...typeMotor,
    ...typePayment,
    ...typeTaxi,
    ...travels,
    ...fleets,
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFound.vue'),
        meta: { 
            public: true 
        },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to) => {

    console.log(to)

    store.commit('auth/GET_SESSION')
    const appid = store.getters['auth/appid']

    if (appid) {
        try { await store.dispatch('auth/me') } catch (_) { }
    }


    const isPublic = to.matched.some(r => r.meta?.public === true)

    if (!appid && !isPublic && to.name !== 'login') {
        return { name: 'login', replace: true }
    }

    if (appid && (to.name === 'login' || to.meta?.guest === true)) {
        return { name: 'home', replace: true }
    }

    console.log('here', isPublic, to.name, to.meta)

    return true
})
