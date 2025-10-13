import type { Module } from 'vuex'
import { getJson, putJson, setDefaultHeaders } from '@/utils/http'
import { useToastify } from '@/composables/useToastify'

export type NormalRatesState = {
    rate: any
}

const toast = useToastify({ autoClose: 2000 })

export const executiveRates: Module<NormalRatesState, any> = {
    namespaced: true,
    state: () => ({
        rate: null
    }),
    getters: {
        rates: (state) => state.rate
    },
    mutations: {
        SET_RATES(state, payload) {
            state.rate = payload
        }
    },
    actions: {
        async list({ commit, rootGetters }) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson('/administrator/configuration/executive-rates')

            if(!result.success) {
                commit('SET_ALERT', { 
                    open: true,
                    type: 'error',
                    title: 'Usuarios',
                    message: 'No se encontraron comisiones, intentalo nuevamente',
                }, { root: true })
                return null
            }


            commit('SET_RATES', result.data)
        },
        async edit({ commit, rootGetters }, payload) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await putJson('/administrator/configuration/executive-rates', payload)

            if(!result.success) {
                toast.error('Las configuraciones no se han actualizado')
                return null
            }

            toast.success('Las configuraciones se han actualizado correctamente')
            
        }
    }
}