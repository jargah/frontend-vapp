import { createApp } from 'vue'
import App from '@/App.vue'
import { store } from '@/store'
import { router } from '@/router/index'
import { vuetify } from '@/plugins/vuetify'
import '@/assets/styles/style.scss'

import AuthLayout from '@/layouts/auth.vue'
import DefaultLayout from '@/layouts/default.vue'

import { vCapital } from './directives/capital'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vuetify)

app.directive('capital', vCapital)

app.component('auth-layout', AuthLayout)
app.component('default-layout', DefaultLayout)

app.mount('#app')
