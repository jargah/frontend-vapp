<template>
    <v-app>
        <v-app-bar :elevation="2">
            <v-app-bar-nav-icon @click="onNavClick" class="me-2" />
            <v-toolbar-title>
                <v-img :src="logo" :width="140" />
            </v-toolbar-title>
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
                    <div class="text-subtitle-2">{{ user?.role_name }}</div>
                    <div class="text-medium-emphasis">{{ user?.username }}</div>
                </div>
                <v-spacer />
            </div>

            <v-divider />

            <v-list density="comfortable" nav v-model:opened="opened">
                <template v-for="(it, idx) in visibleItems" :key="'root-'+idx">

                    <v-list-group v-if="'children' in it" :key="'grp-' + idx" :value="groupId(it, idx)" no-action>
                        <template #activator="{ props }">
                            <v-list-item v-bind="props" :prepend-icon="it.icon ?? null" :title="it.title"
                                rounded="lg" />
                        </template>

                        <v-list-item v-for="(child, cIdx) in it.children.filter(canSee)" :key="`sub-${idx}-${cIdx}`"
                            :to="child.to" :prepend-icon="child.icon ?? null" :title="child.title" rounded="lg" link />
                    </v-list-group>


                    <v-list-item v-else :key="`uq-${idx}`" :to="it.to" :prepend-icon="it.icon ?? null" :title="it.title"
                        rounded="lg" link />
                </template>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useStore } from 'vuex'
import { useRoute, type RouteLocationNamedRaw, useRouter } from 'vue-router'
import logo from '@/assets/images/logo.png'

const store = useStore()
const route = useRoute()
const router = useRouter()
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

// --- Tema con Vuex + Vuetify
const isDark = computed(() => store.getters['ui/isDark'])
function toggleTheme() {
    store.dispatch('ui/toggleTheme')
    vuetifyTheme.global.name.value = isDark.value ? 'dark' : 'light'
}

// --- Auth
const user = computed(() => store.getters['auth/user'])
function onLogout() {
    store.dispatch('auth/logout')
    router.push({name: 'login'})
}

// -----------------------------
// Menú con soporte de submenús
// -----------------------------

type AccessRoles = Array<number>

type BaseItem = {
    title: string
    icon: string
    access?: AccessRoles
}

type LinkItem = BaseItem & {
    to: RouteLocationNamedRaw
}

type GroupItem = BaseItem & {
    children: LinkItem[]
}

type Item = LinkItem | GroupItem

const canSee = (it: Item | LinkItem) => {
    const roles = (it as Item).access ?? []
    if (roles.length === 0) return true
    const uidRole = user.value?.rol_id
    return roles.includes(uidRole)
}

const items = computed<Item[]>(() => [
    { title: 'Inicio', icon: 'mdi-home-outline', to: { name: 'home' }, access: [] },
    { title: 'Prospectos', icon: 'mdi-home-outline', to: { name: 'prospects-list' }, access: [1, 2, 3] },
    {
        title: 'Catalogos',
        icon: 'mdi-shield-crown-outline',
        children: [
            { title: 'Vehículos', to: { name: 'vehicles-list' }, access: [1, 2] },
            { title: 'Tipo Motor', to: { name: 'type-motor-list' }, access: [1, 2] },
            { title: 'Tipo Pago', to: { name: 'type-payment-list' }, access: [1, 2] },
            { title: 'Tipo Taxi', to: { name: 'type-taxi-list' }, access: [1, 2] },
        ],
    } as GroupItem,
    {
        title: 'Operación',
        icon: 'mdi-shield-crown-outline',
        children: [
            { 
                title: 'Pasajeros', 
                to: { name: 'passengers-list' },
                access: [1, 2] 
            },
            { 
                title: 'Operadores', 
                to: { name: 'operators-list' },
                access: [1, 2] 
            },
            { 
                title: 'Viajes', 
                to: { name: 'travels-list' },
                access: [1, 2] 
            },
        ],
    } as GroupItem,
    {
        title: 'Configuraciones',
        icon: 'mdi-shield-crown-outline',
        children: [
            { title: 'Usuarios', to: { name: 'users-list' }, access: [1, 2, 4] },
        ],
    } as GroupItem,
])

const visibleItems = computed<Item[]>(() =>
    items.value
        .map((it) => {
            if ('children' in it) {
                const visibleChildren = it.children.filter(canSee)
                if (!canSee(it) || visibleChildren.length === 0) return null
                return { ...it, children: visibleChildren } as GroupItem
            }
            return canSee(it) ? it : null
        })
        .filter(Boolean) as Item[]
)

// --- Control de grupos abiertos con IDs únicos
const opened = ref<string[]>([])

/**
 * Genera un ID único y estable por grupo.
 * Combina índice + slug del título para evitar colisiones si repiten títulos.
 */
function groupId(group: GroupItem, idx: number) {
    const slug = group.title.toLowerCase().replace(/\s+/g, '-')
    return `grp-${idx}-${slug}`
}

/**
 * Mantiene `opened` en sincronía con la ruta actual:
 * abre el grupo que contiene el child con `to.name` = route.name
 */
function syncOpenedWithRoute() {
    const currentName = route.name as string | undefined
    if (!currentName) return

    const idsToOpen: string[] = []

    visibleItems.value.forEach((it, idx) => {
        if ('children' in it) {
            const hasMatch = it.children.some((c) => {
                const name = (typeof c.to === 'object' && c.to && 'name' in c.to) ? (c.to as any).name : undefined
                return name === currentName
            })
            if (hasMatch) idsToOpen.push(groupId(it, idx))
        }
    })

    opened.value = idsToOpen
}

// Sincroniza en carga y en cada cambio de ruta o visibleItems
watch(() => route.name, syncOpenedWithRoute, { immediate: true })
watch(visibleItems, syncOpenedWithRoute)
</script>
