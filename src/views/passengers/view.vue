<!-- src/views/passengers/view.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Pasajero #{{ id }}</h1>
            </div>
            <v-btn color="primary" prepend-icon="mdi-pencil-outline"
                :to="{ name: 'passengers-edit', params: { id } }">Editar</v-btn>
        </div>

        <v-card rounded="xl" elevation="8">
            <template v-if="loading">
                <v-skeleton-loader class="pa-6" type="article, list-item-two-line" />
            </template>
            <template v-else-if="error">
                <v-alert type="error" variant="tonal" class="ma-6">{{ error }}</v-alert>
            </template>
            <template v-else-if="!item">
                <v-sheet class="pa-10 text-center">
                    <v-icon size="48" class="mb-2">mdi-file-search-outline</v-icon>
                    <div class="text-h6">No se encontró el pasajero.</div>
                </v-sheet>
            </template>
            <template v-else>
                <v-card-item>
                    <div class="d-flex align-center ga-4">
                        <v-avatar color="primary" size="56"><v-icon size="32">mdi-account</v-icon></v-avatar>
                        <div>
                            <div class="text-h6">{{ item.name }}</div>
                            <div class="text-medium-emphasis">ID: {{ item.id }}</div>
                        </div>
                    </div>
                </v-card-item>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Contacto</div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">Correo:</span><strong>{{ item.email }}</strong>
                                </div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">Teléfono:</span><strong>{{ item.phone }}</strong>
                                </div>
                                <div class="d-flex justify-space-between"><span class="text-medium-emphasis">Viajes
                                        realizados:</span><strong>{{ item.trips_count }}</strong></div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">Status:</span><v-chip size="small"
                                        :color="item.status === 'ACTIVE' ? 'success' : 'warning'">{{ item.status
                                        }}</v-chip></div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">Creación:</span><strong>{{
                                        formatDate(item.created_at) }}</strong></div>
                            </v-sheet>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Datos Fiscales</div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">RFC:</span><strong>{{ item.tax.rfc }}</strong>
                                </div>
                                <div class="d-flex justify-space-between"><span class="text-medium-emphasis">Razón
                                        social:</span><strong>{{ item.tax.business_name }}</strong></div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">Régimen:</span><strong>{{ item.tax.regime
                                        }}</strong></div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">CP:</span><strong>{{ item.tax.zip }}</strong></div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                    <v-btn color="primary" :to="{ name: 'passengers-edit', params: { id } }"
                        prepend-icon="mdi-pencil-outline">Editar</v-btn>
                </v-card-actions>
            </template>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PassengersService, type Passenger } from '@/services/passengers.service'

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const loading = ref(true)
const error = ref<string | null>(null)
const item = ref<Passenger | null>(null)

onMounted(load)
watch(() => route.params.id, () => { id.value = Number(route.params.id); load() })

async function load() {
    try {
        loading.value = true
        error.value = null
        item.value = await PassengersService.getById(id.value)
        if (!item.value) error.value = 'No encontrado.'
    } catch (e: any) {
        error.value = e?.message ?? 'Error al cargar.'
    } finally {
        loading.value = false
    }
}

function formatDate(iso: string) {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    }).format(d)
}
function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'passengers-list' })
}
</script>

<style scoped>
.border {
    border: 1px solid rgba(0, 0, 0, .08);
}
</style>
