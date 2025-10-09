import type { Module } from 'vuex'
import { postJson, putJson, getJson, setDefaultHeaders } from '@/utils/http'
import type { DatatableParams } from '@/types/datatable'


export type FleetsState = {
    dialog: boolean
}

export const fleets: Module<FleetsState, any> = {
    namespaced: true,
    state: () => ({
        dialog: false
    }),
    getters: {
        dialog: (state) => state.dialog
    },
    mutations: {
       SET_DIALOG(state, payload) {
            state.dialog  = payload
       }
    },
    actions: {
        view({ commit, dispatch }, payload) {
            const session = dispatch('session')

            commit('SET_DIALOG', true)
        } ,
        session() {

        }
    },
}
