import type { Module } from 'vuex'
import { postJson, putJson, getJson, setDefaultHeaders } from '@/utils/http'
import type { DatatableParams } from '@/types/datatable'


export type PassengersState = {
    view?: any,
    table: DatatableParams
}

export const passengers: Module<PassengersState, any> = {
    namespaced: true,
    state: () => ({
        prospects: null,
        table: {
            database: true,
            page: 1,
            rows: 10,
            search: '',
            order_by: 'id',
            order_asc: true
        }
    }),
    getters: {
        view: (state) => state.view,
        table: (state) => state.table
    },
    mutations: {
        SET_VIEW(state, payload) {
            state.view = payload
        },
        SET_TABLE(state, payload) {
            state.table = payload
        },
    },
    actions: {
        async list({ commit, rootGetters }, payload: DatatableParams) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson(
                'administrator/passengers/list', {
                    datatable: payload.database,
                    page: payload.page,
                    rows: payload.rows,
                    search: payload.search,
                    order_by: 'id',
                    order_asc: true
                }
            );

            if (!result.success) {
                return null
            }

            commit('SET_TABLE', result.data)

        },
        async create({ commit, rootGetters }, payload) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await postJson(
                'administrator/passengers/create', 
                payload
            );

            if (!result.success) {
                commit('SET_ALERT', { 
                    open: true,
                    type: 'error',
                    title: 'Usuarios',
                    message: 'El Usuario no se ha creado, intentalo nuevamente',
                }, { root: true })
                return null
            }

            return result.data

        },
        async view({ commit, rootGetters }, payload: number) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson(
                `administrator/passengers/${payload}/view`
            );

            if (!result.success) {
                return null
            }
            
            commit('SET_VIEW', result.data)

        },
        async edit({ commit, rootGetters }, payload) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await putJson(
                `administrator/passengers/${payload.id}/edit`, 
                payload.body
            );

            if (!result.success) {
                commit('SET_ALERT', { 
                    open: true,
                    type: 'error',
                    title: 'Usuarios',
                    message: 'El Usuario no se ha actualizado, intentalo nuevamente',
                }, { root: true })
                return null
            }

            return result.data

        },
        logout({ commit }) {
            commit('CLEAR_SESSION')
        },
    },
}
