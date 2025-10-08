import type { Module } from 'vuex'
import { postJson, putJson, getJson, setDefaultHeaders } from '@/utils/http'
import type { DatatableParams } from '@/types/datatable'


export type ServiceTravelState = {
    view?: any,
    table: DatatableParams
}

export const serviceTravel: Module<ServiceTravelState, any> = {
    namespaced: true,
    state: () => ({
        prospects: null,
        table: {
            database: true,
            page: 1,
            rows: 10,
            search: '',
            order_by: 'id',
            order_asc: false
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
                'administrator/service-travel/list', {
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
                `administrator/service-travel/${payload}/view`
            );

            if (!result.success) {
                return null
            }
            
            commit('SET_VIEW', result.data)

        }
    },
}
