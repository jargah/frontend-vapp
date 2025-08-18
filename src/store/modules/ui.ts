import type { Module } from 'vuex'

export type UIState = {
    drawer: boolean
    rail: boolean
    theme: 'light' | 'dark'
}

const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light'

export const ui: Module<UIState, any> = {
    namespaced: true,
    state: () => ({
        drawer: true,
        rail: false,
        theme: savedTheme,
    }),
    getters: {
        isDark: (s) => s.theme === 'dark',
    },
    mutations: {
        SET_DRAWER(s, v: boolean) { s.drawer = v },
        TOGGLE_DRAWER(s) { s.drawer = !s.drawer },
        SET_RAIL(s, v: boolean) { s.rail = v },
        TOGGLE_RAIL(s) { s.rail = !s.rail },
        SET_THEME(s, theme: 'light' | 'dark') {
            s.theme = theme
            localStorage.setItem('theme', theme)
        },
        TOGGLE_THEME(s) {
            s.theme = s.theme === 'dark' ? 'light' : 'dark'
            localStorage.setItem('theme', s.theme)
        },
    },
    actions: {
        toggleDrawer({ commit }) { commit('TOGGLE_DRAWER') },
        toggleRail({ commit }) { commit('TOGGLE_RAIL') },
        toggleTheme({ commit }) { commit('TOGGLE_THEME') },
        setDesktopDefaults({ commit }) {
            // abierto en desktop por defecto
            commit('SET_DRAWER', true)
            commit('SET_RAIL', false)
        },
        setMobileDefaults({ commit }) {
            // cerrado en móvil por defecto
            commit('SET_DRAWER', false)
            commit('SET_RAIL', false)
        },
    },
}
