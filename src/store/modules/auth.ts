import type { Module } from 'vuex'

export type User = { email: string } | null
export type AuthState = {
    token: string | null
    user: User
}

const token = localStorage.getItem('auth_token')
const user = localStorage.getItem('auth_user')

export const auth: Module<AuthState, any> = {
    namespaced: true,
    state: () => ({
        token,
        user: user ? JSON.parse(user) : null,
    }),
    getters: {
        isAuthenticated: (s) => !!s.token,
        userEmail: (s) => s.user?.email || 'usuario',
    },
    mutations: {
        SET_SESSION(s, { token, user }: { token: string; user: User }) {
            s.token = token
            s.user = user
            localStorage.setItem('auth_token', token)
            localStorage.setItem('auth_user', JSON.stringify(user))
        },
        CLEAR_SESSION(s) {
            s.token = null
            s.user = null
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        },
    },
    actions: {
        async login({ commit }, { email, password }: { email: string; password: string }) {
            // Simulación; reemplaza por tu API
            await new Promise((r) => setTimeout(r, 400))
            commit('SET_SESSION', { token: 'demo-token', user: { email } })
        },
        logout({ commit }) {
            commit('CLEAR_SESSION')
        },
    },
}
