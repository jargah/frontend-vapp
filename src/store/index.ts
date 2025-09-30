import { createStore } from 'vuex'
import { ui } from './modules/ui'
import { auth } from './modules/auth'
import { prospects } from './modules/prospects'

type DialogState = {
    type: string
    open: boolean
    title?: string | null
    message?: string | null
    success?: Function
    cancel?: Function
}

type AlertState = {
    type: string
    open: boolean
    title?: string | null
    message?: string | null
    close?: Function
}

type GlobalState = {
    dialog: DialogState,
    alert: AlertState
}

// Tipar el store con GlobalState
export const store = createStore<GlobalState>({
    state: () => ({
        dialog: { 
            type: 'default', 
            open: false, 
            title: null, 
            message: null, 
            success: () => {}, 
            cancel: () => {}
        },
        alert: { 
            type: 'default', 
            open: false, 
            title: null, 
            message: null, 
            close: () => {}, 
        }
    }),
    getters: {
        dialog: (state) => state.dialog,
        alert: (state) => state.alert
    },
    mutations: {
        SET_DIALOG: (state, payload) => state.dialog = payload,
        SET_CLOSE_DIALOG: (state) => state.dialog = { 
            type: 'default', 
            open: false, 
            title: null, 
            message: null, 
            success: () => {}, 
            cancel: () => {}
        },
        SET_ALERT: (state, payload) => state.alert = payload,
        SET_CLOSE_ALERT: (state) => state.alert = { 
            type: 'default', 
            open: false, 
            title: null, 
            message: null, 
            close: () => {}
        }
    },
    modules: { 
        ui, 
        auth,
        prospects
    },
})

// RootState = GlobalState
export type RootState = GlobalState