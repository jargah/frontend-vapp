import type { Module } from 'vuex'
import { getJson, delJson, setDefaultHeaders } from '@/utils/http'

type DatatableParams = {
    datatable: boolean
    page: number
    rows: number
    search: string
    order_by: string
    order_asc: boolean
}

type DatatableMeta = {
    page: number
    rows: number
    total_items: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
}

type Datatable = {
    list: any
    meta: DatatableMeta
}

export type UIState = {
    drawer: boolean
    rail: boolean
    theme: 'light' | 'dark'
    datatableParams: DatatableParams,
    datatable: Datatable
}

const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'

export const ui: Module<UIState, any> = {
    namespaced: true,
    state: () => ({
        drawer: true,
        rail: false,
        theme: savedTheme,
        datatableParams: {
            datatable: true,
            page: 1,
            rows: 10,
            search: '',
            order_by: 'id',
            order_asc: true,
        },
        datatable: {
            list: null,
            meta: {
                page: 1,
                rows: 10,
                total_items: 0,
                total_pages: 0,
                has_next: false,
                has_prev: false
            }
        }
    }),
    getters: {
        isDark: (s) => s.theme === 'dark',
        datatable: (state) => state.datatable,
        datatableParams: (state) => state.datatableParams
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
        SET_DATATABLE: (state, payload) => {
            state.datatable = payload
        },
        SET_DATATABLE_ORDER(state, payload) {
            state.datatableParams.order_asc = payload
        },
        SET_DATATABLE_PARAMS(state, payload) {
            state.datatableParams = payload
        },
        SET_DATATABLE_PAGE(state, payload) {
            state.datatableParams.page = payload
        },
        SET_DATATABLE_ROWS(state, payload) {
            console.log(payload)
            state.datatableParams.rows = payload
        },
        SET_DATATABLE_SEARCH(state, payload) {
            state.datatableParams.search = payload
        },
        SET_DATATABLE_PARAMS_RESET(state) {
            state.datatableParams = {
                datatable: true,
                page: 1,
                rows: 10,
                search: '',
                order_by: 'id',
                order_asc: true,
            }
        }
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
        async datatable({ commit, rootGetters }, payload) {
            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson(
                payload.url,
                payload.params
            );

            commit('SET_DATATABLE', result.data)
        },
        async datatableDelete({ rootGetters }, payload) {
            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            await delJson(
                payload.url
            );

        }
    },
}
