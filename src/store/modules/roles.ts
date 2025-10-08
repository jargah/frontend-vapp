import type { Module } from 'vuex'
import { getJson, setDefaultHeaders } from '@/utils/http'
import type { DatatableParams } from '@/types/datatable'



export type RolesState = {
    table: DatatableParams,
    select: Array<any>
}

export const roles: Module<RolesState, any> = {
    namespaced: true,
    state: () => ({
        select: [],
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
        select: (state) => state.select,
        table: (state) => state.table
    },
    mutations: {
        SET_SELECT(state, payload) {
            state.select = payload
        },
        SET_TABLE(state, payload) {
            state.table = payload
        },
    },
    actions: {
        
        async select({ commit, rootGetters }) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson<{roles: Array<any>}>(
                `administrator/configuration/roles/select`
            );

            if (!result.success) {
                return null
            }
            
            commit('SET_SELECT', result.data?.roles)

        },
    },
}
