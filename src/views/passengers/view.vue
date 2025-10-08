<!-- src/views/passengers/view.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Operador #{{ view?.passenger?.id }}</h1>
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
                <!-- Header -->
                <v-card-item>
                    <div class="d-flex align-center ga-4">
                        <v-avatar color="primary" size="56">
                            <v-icon size="32">mdi-account</v-icon>
                        </v-avatar>

                        <div class="min-w-0">
                            <div class="text-h6 text-truncate">
                                {{ view.passenger?.first_name }} {{ view.passenger?.last_name }}
                            </div>

                            <div class="text-medium-emphasis d-flex align-center flex-wrap ga-2">
                                <span>ID: {{ view.passenger?.id }}</span>

                                <!-- Verificación facial -->
                                <v-chip size="small" :color="view.metrics?.facial_verification ? 'success' : 'warning'"
                                    variant="tonal"
                                    :prepend-icon="view.metrics?.facial_verification ? 'mdi-check-decagram' : 'mdi-alert-circle-outline'">
                                    {{ view.metrics?.facial_verification ? 'Verificación facial aprobada' :
                                    'Verificación facial pendiente' }}
                                </v-chip>
                            </div>
                        </div>
                    </div>
                </v-card-item>

                <v-divider />

                <v-card-text>
                    <v-row>
                        <!-- Información de contacto (Passenger) -->
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Información de contacto</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Nombre(s):</span>
                                    <strong>{{ view.passenger?.first_name ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Apellido paterno:</span>
                                    <strong>{{ view.passenger?.last_name ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Apellido materno:</span>
                                    <strong>{{ view.passenger?.second_surname || '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Usuario:</span>
                                    <strong>{{ view.passenger?.username ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Correo:</span>
                                    <strong>{{ view.passenger?.email ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Teléfono:</span>
                                    <strong>{{ view.passenger?.phone ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Género:</span>
                                    <div class="d-flex align-center ga-2">
                                        <v-chip size="small" variant="tonal" prepend-icon="mdi-gender-male-female">
                                            {{ mapGender(view.passenger?.gender) }}
                                        </v-chip>
                                    </div>
                                </div>

                                <v-divider class="my-3" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Código Postal (domicilio):</span>
                                    <strong>{{ view.passenger?.zipcode_passenger ?? '—' }}</strong>
                                </div>

                                <v-divider class="my-3" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Fecha de registro:</span>
                                    <strong>{{ formatDateTime(view.passenger?.register_date) }}</strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <!-- Fiscal -->
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Datos fiscales</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">RFC / Tax ID:</span>
                                    <strong>{{ view.fiscal?.taxid ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Régimen / Tax:</span>
                                    <strong>{{ view.fiscal?.tax ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Código Postal fiscal:</span>
                                    <strong>{{ view.fiscal?.zipcode_fiscal ?? '—' }}</strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <!-- Métricas -->
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Métricas</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Calificación:</span>
                                    <div class="d-flex align-center ga-2">
                                        <strong>{{ view.metrics?.score ?? '—' }}</strong>
                                        <v-chip size="small" variant="tonal" prepend-icon="mdi-star-outline">
                                            {{ view.metrics?.score ?? '—' }}
                                        </v-chip>
                                    </div>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Verificación facial:</span>
                                    <v-chip size="small"
                                        :color="view.metrics?.facial_verification ? 'success' : 'warning'"
                                        variant="tonal"
                                        :prepend-icon="view.metrics?.facial_verification ? 'mdi-check' : 'mdi-close'">
                                        {{ view.metrics?.facial_verification ? 'Sí' : 'No' }}
                                    </v-chip>
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                    <!-- <v-btn color="primary" :to="{ name: 'users-edit', params: { id } }"
                        prepend-icon="mdi-pencil-outline">
                        Editar
                    </v-btn> -->
                </v-card-actions>
            </template>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'

/** ===== Tipos basados en tu payload ===== */
interface Passenger {
    id: number
    first_name: string
    last_name: string
    second_surname?: string | null
    phone: string
    username: string
    email: string
    zipcode_passenger?: string | null
    gender?: 'M' | 'F' | string | null
    register_date?: string | null
}
interface Fiscal {
    zipcode_fiscal?: string | null
    tax?: string | null
    taxid?: string | null
}
interface Metrics {
    score?: number | null
    facial_verification?: boolean | null
}
interface ViewPayload {
    passenger?: Passenger
    fiscal?: Fiscal
    metrics?: Metrics
}

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const loading = ref(true)
const error = ref<string | null>(null)

/** Importante: mantenemos el namespace del store 'passengers' */
const view = computed<ViewPayload | null>(() => store.getters['passengers/view'] ?? null)

onMounted(load)

watch(
    () => route.params.id,
    (val) => {
        id.value = Number(val)
        load()
    }
)

async function load() {
    try {
        loading.value = true
        await store.dispatch('passengers/view', id.value)
    } catch (e: any) {
        error.value = e?.message ?? 'Error al cargar el operador'
    } finally {
        loading.value = false
    }
}

/* ------------ Helpers ------------ */
function formatDateTime(iso?: string | null) {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
}

function mapGender(g?: string | null) {
    if (!g) return '—'
    if (g === 'M') return 'Masculino'
    if (g === 'F') return 'Femenino'
    return g
}

function goBack() {
    router.push({ name: 'passengers-list' })
}
</script>

<style scoped>
.border {
    border: 1px solid rgba(0, 0, 0, .08);
}

.text-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

.min-w-0 {
    min-width: 0;
}
</style>
