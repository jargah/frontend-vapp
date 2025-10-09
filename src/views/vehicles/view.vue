<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Vehículo #{{ id }}</h1>
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
                    <div class="text-h6">No se encontró el recurso.</div>
                </v-sheet>
            </template>

            <template v-else>
                <v-card-item>
                    <div class="d-flex align-center ga-4">
                        <v-avatar color="primary" size="56">
                            <v-icon size="32">mdi-source-repository</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-h6">{{ view?.name }}</div>
                            <div class="text-medium-emphasis">ID: {{ id }}</div>
                        </div>
                    </div>
                </v-card-item>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Información</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Nombre:</span>
                                    <strong>{{ view?.name }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Rama:</span>
                                    <strong>{{ view?.branch }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Modelo:</span>
                                    <strong>{{ view?.model }}</strong>
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                    <v-btn color="primary" :to="{ name: 'vehicles-edit', params: { id } }"
                        prepend-icon="mdi-pencil-outline">
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

const view = computed(() => store.getters['vehicles/view'])

async function load() {
    try {
        loading.value = true
        await store.dispatch('vehicles/view', id.value)
    } catch (e: any) {
        error.value = e?.message ?? 'No se pudo cargar el recurso.'
    } finally {
        loading.value = false
    }
}

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'vehicles-list' })
}

onMounted(() => {
    id.value = Number(route.params.id)
    load()
})

watch(
    () => route.params.id,
    () => {
        id.value = Number(route.params.id)
        load()
    }
)
</script>

<style scoped>
.border {
    border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
