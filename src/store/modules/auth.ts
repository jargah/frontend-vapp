import type { Module } from 'vuex'
import { getJson, postJson, setDefaultHeaders } from '@/utils/http'
import { router } from '@/router/index'


type Profile = {
    email: string,
    phone: string
    rol_id: number
    id: number
    username: string
}

export type AuthState = {
    token: string | null
    appid: string | null
    user: Profile | null,
}

/* const token = localStorage.getItem('auth_token')
const user = localStorage.getItem('auth_user') */

export const auth: Module<AuthState, any> = {
    namespaced: true,
    state: () => ({
        token: null,
        appid: null,
        user: null,
    }),
    getters: {
        appid: (state) => state.appid,
        token: (state) => state.token,
        isAuthenticated: (s) => !!s.token,
        user: (state) => state.user,
    },
    mutations: {
        SET_PROFILE(state, payload) {
            state.user = payload
        },
        SET_SESSION(state, payload) {
            state.appid = payload
            localStorage.setItem('appid', payload.appid)
            localStorage.setItem('session', payload.token)
        },
        GET_SESSION(state) {
            const appid = localStorage.getItem('appid')
            const session = localStorage.getItem('session')
            state.appid = appid
            state.token = session
        },
        CLEAR_SESSION(state) {
            state.appid = null
            state.token = null
            state.user = null
            localStorage.removeItem('appid')
        },

    },
    actions: {
        async login({ commit }, { username, password }: { username: string; password: string }) {

            const result = await postJson<{ token: string, appid: string }>('administrator/auth/login', {
                username, password
            });

            if (!result.success) {
                commit('SET_ALERT', { 
                    open: true,
                    type: 'error',
                    title: 'Credenciales incorrectas',
                    message: 'Verifica tus credenciales e intentalo nuevamente',
                }, { root: true })
                return null
            }

            
            commit('SET_SESSION', result.data)

        },

        async me({ commit, rootGetters }, payload) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson<{me: Profile }>('administrator/profile/me');

            if(!result) {
                localStorage.removeItem('appid')
                /* router.push({
                    name: 'login'
                }) */
                return
            }

            if (!result.success) {
                commit('SET_ALERT', { 
                    open: true,
                    type: 'error',
                    title: 'Credenciales incorrectas',
                    message: 'Verifica tus credenciales e intentalo nuevamente',
                }, { root: true })
                return null
            }

            commit('SET_PROFILE', result.data.me)

        },

        logout({ commit }) {
            commit('CLEAR_SESSION')
        },
    },
}
