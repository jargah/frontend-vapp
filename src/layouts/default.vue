<template>
    <v-app>
        <v-app-bar :elevation="2">
            <v-app-bar-nav-icon @click="onNavClick" class="me-2" />
            <v-toolbar-title>Mi App</v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="toggleTheme">
                <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :rail="rail" :permanent="isDesktop" :temporary="!isDesktop">
            <div class="d-flex align-center pa-4">
                <v-avatar size="40" class="me-3">
                    <img src="https://i.pravatar.cc/100?img=12" alt="User" />
                </v-avatar>
                <div v-if="!rail" class="text-body-2">
                    <div class="text-subtitle-2">{{ email }}</div>
                    <div class="text-medium-emphasis">Admin</div>
                </div>
                <v-spacer />
            </div>

            <v-divider />

            <v-list density="comfortable" nav>
                <v-list-item v-for="it in items" :key="it.to.name" :to="it.to" :prepend-icon="it.icon" :title="it.title"
                    rounded="lg" link />
            </v-list>

            <template #append>
                <v-divider />
                <v-list>
                    <v-list-item prepend-icon="mdi-logout" title="Salir" @click="onLogout" rounded="lg" />
                </v-list>
            </template>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useStore } from 'vuex'
import type { RouteLocationNamedRaw } from 'vue-router'

const store = useStore()
const { mdAndUp } = useDisplay()
const vuetifyTheme = useTheme()

// --- Drawer / Rail desde Vuex (ui)
const drawer = computed({
    get: () => store.state.ui.drawer,
    set: (v: boolean) => store.commit('ui/SET_DRAWER', v),
})
const rail = computed({
    get: () => store.state.ui.rail,
    set: (v: boolean) => store.commit('ui/SET_RAIL', v),
})
const isDesktop = computed(() => mdAndUp.value)

onMounted(() => {
    if (isDesktop.value) store.dispatch('ui/setDesktopDefaults')
    else store.dispatch('ui/setMobileDefaults')
})

function onNavClick() {
    if (isDesktop.value) store.dispatch('ui/toggleRail')
    else store.dispatch('ui/toggleDrawer')
}
function toggleRail() { store.dispatch('ui/toggleRail') }

// --- Tema con Vuex + Vuetify
const isDark = computed(() => store.getters['ui/isDark'])
function toggleTheme() {
    store.dispatch('ui/toggleTheme')
    vuetifyTheme.global.name.value = isDark.value ? 'dark' : 'light'
}

// --- Auth
const email = computed(() => store.getters['auth/userEmail'])
function onLogout() {
    store.dispatch('auth/logout')
    window.location.href = '/login'
}

// Items del menú
type Item = { title: string; icon: string; to: RouteLocationNamedRaw }

const items: Item[] = [
  { title: 'Inicio',  icon: 'mdi-home-outline',  to: { name: 'home' } },
  { title: 'Flotillas',  icon: 'mdi-home-outline',  to: { name: 'fleets-list' } },
  { title: 'Operadores',  icon: 'mdi-home-outline',  to: { name: 'operators-list' } },
  { title: 'Pasajeros',  icon: 'mdi-home-outline',  to: { name: 'passengers-list' } },
  { title: 'Facturación',  icon: 'mdi-home-outline',  to: { name: 'invoice' } },
  { title: 'Programa de recomensas',  icon: 'mdi-home-outline',  to: { name: 'referrals-list' } },
  { title: 'Ajustes', icon: 'mdi-cog-outline',   to: { name: 'settings-list' } },
]
</script>
