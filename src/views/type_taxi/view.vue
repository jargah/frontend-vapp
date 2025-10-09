<!-- src/views/operators/view.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">

            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Usuario #{{ view?.id_user }}</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <template v-if="loading">
                <v-skeleton-loader class="pa-6" type="article, list-item-two-line" />
            </template>
            <template v-else-if="error">
                <v-alert type="error" variant="tonal" class="ma-6">{{ error }}</v-alert>
            </template>
            <template v-else-if="!view">
                <v-sheet class="pa-10 text-center">
                    <v-icon size="48" class="mb-2">mdi-file-search-outline</v-icon>
                    <div class="text-h6">No se encontró el operador.</div>
                </v-sheet>
            </template>
            <template v-else>
                <v-card-item>
                    <div class="d-flex align-center ga-4">
                        <v-avatar color="primary" size="56"><v-icon size="32">mdi-account-hard-hat</v-icon></v-avatar>
                        <div>
                            <div class="text-h6">{{ view?.first_name }} {{ view?.last_name }} </div>
                            <div class="text-medium-emphasis">ID: {{ view?.id_user }}</div>
                        </div>
                    </div>
                </v-card-item>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">
                                    Contacto
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Nombre:
                                    </span>
                                    <strong>
                                        {{ view?.first_name }}
                                    </strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Apellido:
                                    </span>
                                    <strong>
                                        {{ view?.last_name }}
                                    </strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Usuario:
                                    </span>
                                    <strong>
                                        {{ view?.username }}
                                    </strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Email:
                                    </span>
                                    <strong>
                                        {{ view?.email }}
                                    </strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Teléfono:
                                    </span>
                                    <strong>
                                        {{ view?.phone }}
                                    </strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Creación:
                                    </span>
                                    <strong>
                                        {{ formatDate(view?.creation) }}
                                    </strong>
                                </div>
                            </v-sheet>
                        </v-col>

                
                    </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                    <v-btn 
                        color="primary" 
                        :to="{ name: 'users-edit', params: { id } }"
                        prepend-icon="mdi-pencil-outline"
                    >
                            Editar
                    </v-btn>
                </v-card-actions>
            </template>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { store } from '@/store'

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(() => {
    id.value = Number(route.params.id)
    load()
})

watch(() => route.params.id, () => { 
    id.value = Number(route.params.id);
})

const view = computed(() => store.getters['users/view'])

async function load() {

    await store.dispatch('users/view', id.value)
    loading.value = false
}
function formatDate(iso: string) {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', { 
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    }).format(d)
}
function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'prospects-list' })
}
</script>

<style scoped>
.border {
    border: 1px solid rgba(0, 0, 0, .08);
}
</style>
