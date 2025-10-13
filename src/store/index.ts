import { createStore } from 'vuex'
import { ui } from './modules/ui'
import { auth } from './modules/auth'
import { prospects } from './modules/prospects'
import { users } from './modules/users'
import { roles } from './modules/roles'
import { passengers } from './modules/passengers'
import { operators } from './modules/operators'
import { vehicles } from './modules/vehicles'
import { typeMotor } from './modules/type_motor'
import { typePayment } from './modules/type_payment'
import { typeTaxi } from './modules/type_taxi'
import { serviceTravel } from './modules/serviceTravel'
import { fleets } from './modules/fleets'
import { commissions }  from './modules/commissions_fees'
import { normalRates }  from './modules/normal_rates'
import { executiveRates }  from './modules/executive_rates'
import { dailyRates }  from './modules/daily_rates'
import { credentials } from './modules/credentials'

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
        prospects,
        users,
        roles,
        passengers,
        operators,
        vehicles,
        typeMotor,
        typePayment,
        typeTaxi,
        serviceTravel,
        fleets,
        commissions,
        normalRates,
        executiveRates,
        dailyRates,
        credentials
    },
})

export type RootState = GlobalState