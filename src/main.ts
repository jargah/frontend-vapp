import { createApp } from 'vue'
import App from '@/App.vue'
import { store } from '@/store'
import { router } from '@/router/index'
import { vuetify } from '@/plugins/vuetify'
import '@/assets/styles/style.scss'
import 'vue3-toastify/dist/index.css';

import AuthLayout from '@/layouts/auth.vue'
import DefaultLayout from '@/layouts/default.vue'

import { vCapital } from '@/directives/capital'
import { vOnlyDigits } from '@/directives/onlyDigits'
import { vOnlyNumber } from '@/directives/onlyNumber'
import vAlphanumSpaces from '@/directives/alphanum-spaces'
import vAlphanumSpacesAt from '@/directives/alphanum-spaces-at';

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vuetify)

app.directive('capital', vCapital)
app.directive('only-digits', vOnlyDigits)
app.directive('only-number', vOnlyNumber)
app.directive('alphanum-spaces', vAlphanumSpaces)
app.directive('alphanum-spaces-at', vAlphanumSpacesAt);

app.component('auth-layout', AuthLayout)
app.component('default-layout', DefaultLayout)

app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);

app.mount('#app')
