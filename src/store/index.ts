import { createStore } from 'vuex'
import { ui } from './modules/ui'
import { auth } from './modules/auth'

export const store = createStore({
    modules: { ui, auth },
})

export type RootState = ReturnType<typeof store['state']>