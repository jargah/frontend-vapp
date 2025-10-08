import type { Module } from 'vuex'
import { getJson, setDefaultHeaders } from '@/utils/http'
import type { DatatableParams } from '@/types/datatable'

type ProspectView = {
    vehicle: any
    documents: any
    prospect: any

}

export type ProspectState = {
    prospect?: ProspectView,
    table: DatatableParams
}

export const prospects: Module<ProspectState, any> = {
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
        prospect: (state) => state.prospect,
        table: (state) => state.table
    },
    mutations: {
        SET_PROSPECT(state, payload) {
            state.prospect = payload
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
                'administrator/prospects/list', {
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
        async view({ commit, rootGetters }, payload: number) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson(
                `administrator/prospects/${payload}/view`
            );

            if (!result.success) {
                return null
            }
            
            commit('SET_PROSPECT', result.data)

        },
        logout({ commit }) {
            commit('CLEAR_SESSION')
        },
    },
}
