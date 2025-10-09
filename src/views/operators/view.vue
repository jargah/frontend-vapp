<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Operador #{{ view?.operator?.id }}</h1>
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
                        <v-avatar size="56">
                            <template v-if="view.operator?.picture">
                                <v-img :src="view.operator.picture" />
                            </template>
                            <template v-else>
                                <v-avatar color="primary" size="56">
                                    <v-icon size="32">mdi-account-hard-hat</v-icon>
                                </v-avatar>
                            </template>
                        </v-avatar>

                        <div class="min-w-0">
                            <div class="text-h6 text-truncate">
                                {{ view.operator?.first_name }} {{ view.operator?.last_name }}
                            </div>
                            <div class="text-medium-emphasis d-flex align-center flex-wrap ga-2">
                                <span>ID: {{ view.operator?.id }}</span>

                                <v-chip size="small" variant="tonal" prepend-icon="mdi-domain">
                                    {{ view.operator?.empresa_operador?.name ?? '—' }}
                                </v-chip>

                                <v-chip size="small"
                                    :prepend-icon="view.operator?.email_verify ? 'mdi-check-decagram' : 'mdi-alert-circle-outline'"
                                    :color="view.operator?.email_verify ? 'success' : 'warning'" variant="tonal">
                                    {{ view.operator?.email_verify ? 'Email verificado' : 'Email sin verificar' }}
                                </v-chip>

                                <!-- NUEVO: Estado -->
                                <!-- <v-chip size="small" :color="statusColor(view.operator?.status)" variant="tonal"
                                    :prepend-icon="statusIcon(view.operator?.status)">
                                    {{ mapStatusLabel(view.operator?.status) }}
                                </v-chip> -->
                            </div>
                        </div>
                    </div>
                </v-card-item>

                <v-divider />

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Información de contacto</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Nombre(s):</span>
                                    <strong>{{ view.operator?.first_name ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Apellido paterno:</span>
                                    <strong>{{ view.operator?.last_name ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Apellido materno:</span>
                                    <strong>{{ view.operator?.second_surname ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Usuario:</span>
                                    <strong>{{ view.operator?.username ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Correo:</span>
                                    <div class="d-flex align-center ga-2">
                                        <strong>{{ view.operator?.email ?? '—' }}</strong>
                                        <v-chip size="x-small"
                                            :color="view.operator?.email_verify ? 'success' : 'warning'"
                                            variant="tonal">
                                            {{ view.operator?.email_verify ? 'Verificado' : 'Sin Verificar' }}
                                        </v-chip>
                                    </div>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Teléfono:</span>
                                    <strong>{{ view.operator?.phone ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Género:</span>
                                    <div class="d-flex align-center ga-2">
                                        <v-chip size="small" variant="tonal" prepend-icon="mdi-gender-male-female">
                                            {{ mapGender(view.operator?.gender) }}
                                        </v-chip>
                                    </div>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Fecha de nacimiento:</span>
                                    <strong>{{ formatDate(view.operator?.birthday) }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">CURP:</span>
                                    <strong>{{ view.operator?.curp ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">RFC:</span>
                                    <strong>{{ view.operator?.taxid ?? '—' }}</strong>
                                </div>

                                <v-divider class="my-3" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Dirección:</span>
                                    <strong>{{ view.operator?.address ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Colonia:</span>
                                    <strong>{{ view.operator?.suburb ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Código Postal:</span>
                                    <strong>{{ view.operator?.zipcode ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Estado:</span>
                                    <strong>{{ view.operator?.state ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Municipio/Alcaldía:</span>
                                    <strong>{{ view.operator?.municipality ?? '—' }}</strong>
                                </div>

                                <v-divider class="my-3" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Fecha de registro:</span>
                                    <strong>{{ formatDateTime(view.operator?.register_date) }}</strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Vehículo / Taxi</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Empresa:</span>
                                    <strong>{{ view.taxi?.empresa?.name ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Marca:</span>
                                    <strong>{{ view.taxi?.branch ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Submarca:</span>
                                    <strong>{{ view.taxi?.sub_branch ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Modelo:</span>
                                    <strong>{{ view.taxi?.model ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">No. Económico:</span>
                                    <strong>{{ view.taxi?.number_eco ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Placas:</span>
                                    <strong>{{ view.taxi?.number_plate ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Serie (VIN):</span>
                                    <strong class="text-mono">{{ view.taxi?.serie ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Clasificación:</span>
                                    <div class="d-flex align-center ga-2">
                                        <v-chip size="small" variant="tonal" prepend-icon="mdi-steering">
                                            {{ view.taxi?.type_taxi?.name ?? '—' }}
                                        </v-chip>
                                        <v-chip size="small" variant="tonal" prepend-icon="mdi-engine">
                                            {{ view.taxi?.type_motor?.name ?? '—' }}
                                        </v-chip>
                                    </div>
                                </div>
                            </v-sheet>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Balance</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Total acumulado:</span>
                                    <div class="d-flex align-center ga-2">
                                        <strong>{{ formatMoney(view.balance?.total) }}</strong>
                                        <v-chip v-if="(view.balance?.pending ?? 0) > 0" size="x-small" color="warning"
                                            variant="tonal">
                                            Pendientes
                                        </v-chip>
                                    </div>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Pendiente de liquidar:</span>
                                    <strong>{{ formatMoney(view.balance?.pending) }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Facturación:</span>
                                    <strong>{{ formatMoney(view.balance?.invoice) }}</strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Métricas</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Calificación:</span>
                                    <div class="d-flex align-center ga-2">
                                        <strong>{{ (view.metrics?.score ?? '—') }}</strong>
                                        <v-chip size="small" variant="tonal" prepend-icon="mdi-star-outline">
                                            {{ view.metrics?.score ?? '—' }}
                                        </v-chip>
                                    </div>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Viajes completados:</span>
                                    <v-chip size="small" variant="tonal" prepend-icon="mdi-counter">
                                        {{ view.metrics?.travels ?? '—' }}
                                    </v-chip>
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                    <v-btn color="primary" :to="{ name: 'users-edit', params: { id } }"
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

interface Empresa { id: number; name: string }
interface Operator {
    id: number
    first_name: string
    last_name: string
    second_surname?: string | null
    username: string
    phone: string
    email: string
    email_verify?: number | boolean
    picture?: string
    taxid?: string | null
    curp?: string | null
    gender?: 'M' | 'F' | string
    birthday?: string | null
    address?: string | null
    suburb?: string | null
    zipcode?: string | null
    state?: string | null
    municipality?: string | null
    empresa_operador?: Empresa
    register_date?: string
    status?: string | number | boolean 
}
interface Taxi {
    empresa?: Empresa
    branch?: string
    sub_branch?: string
    model?: string | number
    number_eco?: string
    number_plate?: string
    serie?: string
    type_taxi?: Empresa
    type_motor?: Empresa
}
interface Balance { total?: number; pending?: number; invoice?: number }
interface Metrics { score?: number; travels?: number }
interface ViewPayload {
    operator?: Operator
    taxi?: Taxi
    balance?: Balance
    metrics?: Metrics
}

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const loading = ref(true)
const error = ref<string | null>(null)
const view = computed<ViewPayload | null>(() => store.getters['operators/view'] ?? null)

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
        await store.dispatch('operators/view', id.value)
    } catch (e: any) {
        error.value = e?.message ?? 'Error al cargar el operador'
    } finally {
        loading.value = false
    }
}

function formatDate(iso?: string | null) {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

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

function formatMoney(v?: number) {
    if (v === undefined || v === null || Number.isNaN(v)) return '—'
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(v)
}

function mapGender(g?: string) {
    if (!g) return '—'
    if (g === 'M') return 'Masculino'
    if (g === 'F') return 'Femenino'
    return g
}

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'operators-list' })
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
