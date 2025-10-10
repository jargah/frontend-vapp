<!-- src/layouts/AppShell.vue -->
<template>
    <v-app class="app-root">
        <v-app-bar :elevation="2">
            <v-app-bar-nav-icon @click="onNavClick" class="me-2" />
            <v-toolbar-title>
                <v-img :src="logo" :width="140" />
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="toggleTheme" :aria-label="isDark ? 'Cambiar a claro' : 'Cambiar a oscuro'">
                <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :rail="rail" :permanent="isDesktop" :temporary="!isDesktop"
            :expand-on-hover="isDesktop && rail">
            <div class="d-flex align-center pa-4">
                <v-avatar size="40" class="me-3">
                    <img src="https://i.pravatar.cc/100?img=12" alt="User" />
                </v-avatar>

                <div v-if="!rail" class="text-body-2">
                    <div class="text-subtitle-2">{{ user?.role_name }}</div>
                    <div class="text-medium-emphasis">{{ user?.username }}</div>
                </div>
                <v-spacer />
            </div>

            <v-divider />

            <v-list density="comfortable" nav v-model:opened="opened">
                <template v-for="(it, idx) in visibleItems" :key="'root-'+idx">
                    <v-list-group v-if="'children' in it" :value="groupId(it, idx)" no-action>
                        <template #activator="{ props }">
                            <v-list-item v-bind="props" :prepend-icon="it.icon || undefined" :title="it.title"
                                rounded="lg" />
                        </template>

                        <v-list-item v-for="(child, cIdx) in it.children.filter(canSee)" :key="`sub-${idx}-${cIdx}`"
                            :to="child.to" :prepend-icon="child.icon || undefined" :title="child.title" rounded="lg"
                            link />
                    </v-list-group>

                    <v-list-item v-else :key="`uq-${idx}`" :to="it.to" :prepend-icon="it.icon || undefined"
                        :title="it.title" rounded="lg" link />
                </template>
            </v-list>

            <template #append>
                <v-divider />
                <v-list>
                    <v-list-item prepend-icon="mdi-logout" title="Salir" @click="onLogout" rounded="lg" />
                </v-list>
            </template>
        </v-navigation-drawer>

        <v-main class="main-full">
            <!-- <v-container fluid class="fill-height pa-4"> Always Center screen-->
                <v-container fluid>
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useStore } from 'vuex'
import { useRoute, type RouteLocationNamedRaw, useRouter } from 'vue-router'
import logo from '@/assets/images/logo.png'

const store = useStore()
const route = useRoute()
const router = useRouter()
const { mdAndUp } = useDisplay()
const vuetifyTheme = useTheme()

const isDesktop = computed(() => mdAndUp.value)
onMounted(() => {
    isDesktop.value ? store.dispatch('ui/setDesktopDefaults') : store.dispatch('ui/setMobileDefaults')
})

const drawer = computed({
    get: () => store.state.ui.drawer,
    set: (v: boolean) => store.commit('ui/SET_DRAWER', v),
})
const rail = computed({
    get: () => store.state.ui.rail,
    set: (v: boolean) => store.commit('ui/SET_RAIL', v),
})
function onNavClick() {
    isDesktop.value ? store.dispatch('ui/toggleRail') : store.dispatch('ui/toggleDrawer')
}

const isDark = computed(() => store.getters['ui/isDark'])
watchEffect(() => {
    vuetifyTheme.global.name.value = isDark.value ? 'dark' : 'light'
})
function toggleTheme() {
    store.dispatch('ui/toggleTheme')
}

const user = computed(() => store.getters['auth/user'])
function onLogout() {
    store.dispatch('auth/logout')
    router.push({ name: 'login' })
}

type AccessRoles = Array<number>
type BaseItem = { title: string; icon: string; access?: AccessRoles }
type LinkItem = BaseItem & { to: RouteLocationNamedRaw }
type GroupItem = BaseItem & { children: LinkItem[] }
type Item = LinkItem | GroupItem

const canSee = (it: Item | LinkItem) => {
    const roles = (it as Item).access ?? []
    if (roles.length === 0) return true
    const uidRole = user.value?.rol_id
    return roles.includes(uidRole)
}

const baseItems: Item[] = [
    { title: 'Inicio', icon: 'mdi-home-outline', to: { name: 'home' }, access: [] },
    { title: 'Prospectos', icon: 'mdi-account-search-outline', to: { name: 'prospects-list' }, access: [1, 2, 3] },
    {
        title: 'Catálogos',
        icon: 'mdi-view-dashboard-outline',
        children: [
            { title: 'Vehículos', to: { name: 'vehicles-list' }, access: [1, 2] },
            { title: 'Tipo Motor', to: { name: 'type-motor-list' }, access: [1, 2] },
            { title: 'Tipo Pago', to: { name: 'type-payment-list' }, access: [1, 2] },
            { title: 'Tipo Taxi', to: { name: 'type-taxi-list' }, access: [1, 2] },
        ],
    } as GroupItem,
    {
        title: 'Flotillas',
        icon: 'mdi-view-dashboard-outline',
        children: [
            { title: 'Cedulas', to: { name: 'fleets-list' }, access: [1, 2] },
        ],
    } as GroupItem,
    {
        title: 'Operación',
        icon: 'mdi-clipboard-text-outline',
        children: [
            { title: 'Pasajeros', to: { name: 'passengers-list' }, access: [1, 2] },
            { title: 'Operadores', to: { name: 'operators-list' }, access: [1, 2] },
            { title: 'Viajes', to: { name: 'travels-list' }, access: [1, 2] },
        ],
    } as GroupItem,
    {
        title: 'Configuraciones',
        icon: 'mdi-cog-outline',
        children: [
            { title: 'Usuarios', to: { name: 'users-list' }, access: [1, 2, 4] },
            { title: 'Comisiones', to: { name: 'config-commissions' }, access: [1, 2] },
            { title: 'Tarifas Normales', to: { name: 'config-normal-rates' }, access: [1, 2] },
            { title: 'Tarifas Ejecutivas', to: { name: 'config-executive-rates' }, access: [1, 2] }
        ],
    } as GroupItem,
]

const visibleItems = computed<Item[]>(() => {
    const out: Item[] = []
    for (let i = 0; i < baseItems.length; i++) {
        const it = baseItems[i]
        if ('children' in it) {
            if (!canSee(it)) continue
            const kids = it.children.filter(canSee)
            if (kids.length) out.push({ ...it, children: kids })
        } else if (canSee(it)) {
            out.push(it)
        }
    }
    return out
})

const opened = ref<string[]>([])
function slugify(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '-')
}
function groupId(group: GroupItem, idx: number) {
    return `grp-${idx}-${slugify(group.title)}`
}
function syncOpenedWithRoute() {
    const currentName = route.name as string | undefined
    if (!currentName) return
    const idsToOpen: string[] = []
    visibleItems.value.forEach((it, idx) => {
        if ('children' in it) {
            if (it.children.some(c => (typeof c.to === 'object' && 'name' in (c.to as any)) && (c.to as any).name === currentName)) {
                idsToOpen.push(groupId(it, idx))
            }
        }
    })
    opened.value = idsToOpen
}
watch(() => route.name, syncOpenedWithRoute, { immediate: true })
watch(visibleItems, syncOpenedWithRoute)
</script>

<style>
html,
body,
#app {
    height: 100%;
}

.v-application {
    min-height: 100%;
}

.app-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-full {
    flex: 1 1 auto;
    display: flex;
    min-height: 0;
}

.v-main__wrap {
    display: flex;
    flex: 1 1 auto;
}
</style>
