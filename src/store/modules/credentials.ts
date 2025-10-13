import type { Module } from 'vuex'
import { getJson, putJson, setDefaultHeaders } from '@/utils/http'
import { useToastify } from '@/composables/useToastify'

export type CredentialsState = {
    rate: any
}

const toast = useToastify({ autoClose: 2000 })

export const credentials: Module<CredentialsState, any> = {
    namespaced: true,
    state: () => ({
        rate: null
    }),
    getters: {
        credentials: (state) => state.rate
    },
    mutations: {
        SET_CREDENTIALS(state, payload) {
            state.rate = payload
        }
    },
    actions: {
        async list({ commit, rootGetters }) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await getJson('/administrator/configuration/credentials')

            if(!result.success) {
                commit('SET_ALERT', { 
                    open: true,
                    type: 'error',
                    title: 'Credenciales',
                    message: 'No se encontraron credenciales, intentalo nuevamente',
                }, { root: true })
                return null
            }

            commit('SET_CREDENTIALS', result.data)
        },
        async edit({ commit, rootGetters }, payload) {

            setDefaultHeaders({
                'session': rootGetters['auth/token']
            })

            const result = await putJson('/administrator/configuration/credentials', payload)
            console.log(result)

            if(!result.success) {
                toast.error('Las configuraciones no se han actualizado')
                return null
            }

            toast.success('Las configuraciones se han actualizado correctamente')
            
        }
    }
}