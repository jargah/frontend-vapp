import type { Module } from 'vuex'
import { getJson, setDefaultHeaders } from '@/utils/http'

export type CommissionsFeeState = {
    commission: any
}

export const commissions: Module<CommissionsFeeState, any> = {
    namespaced: true,
    state: () => ({
        commission: null
    }),
    getters: {
        commissions: (state) => state.commission
    },
    mutations: {
        SET_COMMISSION(state, payload) {
            state.commission = payload
        }
    },
    actions: {
        async commissions({ commit, rootGetters }) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson('/administrator/configuration/commission-fee')

            if(!result.success) {
                commit('SET_ALERT', { 
                    open: true,
                    type: 'error',
                    title: 'Usuarios',
                    message: 'No se encontraron comisiones, intentalo nuevamente',
                }, { root: true })
                return null
            }


            commit('SET_COMMISSION', result.data)
        }
    }
}