<!-- src/views/operators/view.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Servicio #{{ view?.service?.id }}</h1>
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
                    <div class="text-h6">No se encontró el servicio.</div>
                </v-sheet>
            </template>

            <template v-else>
                <!-- Header con resumen -->
                <v-card-item>
                    <div class="d-flex align-center justify-space-between flex-wrap ga-4">
                        <div class="min-w-0">
                            <div class="text-h6 text-truncate">{{ view.service?.origin ?? '—' }}</div>
                            <div class="text-medium-emphasis d-flex align-center flex-wrap ga-2">
                                <v-icon size="18">mdi-arrow-right</v-icon>
                                <span class="text-truncate">{{ view.service?.destination ?? '—' }}</span>
                            </div>
                        </div>

                        <div class="d-flex align-center flex-wrap ga-2">
                            <v-chip size="small" variant="tonal" prepend-icon="mdi-ruler">
                                {{ formatKm(view.metrics?.distance_km) }} km
                            </v-chip>
                            <v-chip size="small" variant="tonal" prepend-icon="mdi-timer-outline">
                                {{ view.metrics?.duration_hhmmss ?? formatDuration(view.metrics?.duration_s) }}
                            </v-chip>
                            <v-chip size="small" variant="tonal" prepend-icon="mdi-speedometer">
                                {{ formatNumber(view.metrics?.avg_speed_kmh) }} km/h
                            </v-chip>
                            <v-chip size="small" color="primary" variant="tonal" prepend-icon="mdi-cash-multiple">
                                {{ formatMoney(view.service?.amount) }} (tarifa)
                            </v-chip>
                            <v-chip size="small" color="success" variant="tonal" prepend-icon="mdi-cash">
                                {{ formatMoney(view.service?.amount_final) }} (cobrado)
                            </v-chip>
                        </div>
                    </div>
                </v-card-item>

                <v-divider />

                <v-card-text>
                    <v-row>
                        <!-- Servicio -->
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Servicio</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">ID Servicio:</span>
                                    <strong>{{ view.service?.id ?? '—' }}</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="m-1">
                                    <span class="text-medium-emphasis">Origen:</span>
                                    <div class="text-body-2 mt-1">{{ view.service?.origin ?? '—' }}</div>
                                </div>
                                <div class="m-1">
                                    <span class="text-medium-emphasis">Destino:</span>
                                    <div class="text-body-2 mt-1">{{ view.service?.destination ?? '—' }}</div>
                                </div>

                                <v-divider class="my-2" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Salida:</span>
                                    <strong>{{ formatDateTime(view.service?.departure_origin) }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Llegada:</span>
                                    <strong>{{ formatDateTime(view.service?.arrival_destination) }}</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Distancia:</span>
                                    <strong>{{ formatKm(view.metrics?.distance_km) }} km</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Duración:</span>
                                    <strong>{{ view.metrics?.duration_hhmmss ?? formatDuration(view.metrics?.duration_s)
                                        }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Velocidad promedio:</span>
                                    <strong>{{ formatNumber(view.metrics?.avg_speed_kmh) }} km/h</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Tarifa estimada (amount):</span>
                                    <strong>{{ formatMoney(view.service?.amount) }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Cobrado (amount_final):</span>
                                    <strong>{{ formatMoney(view.service?.amount_final) }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Impuesto (tax):</span>
                                    <strong>{{ formatPercent(view.service?.tax) }}</strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <!-- Métricas -->
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Métricas</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">$/km (desde amount):</span>
                                    <strong>{{ formatMoney(view.metrics?.unit_prices?.per_km_from_amount) }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">$/km (desde amount_final):</span>
                                    <strong>{{ formatMoney(view.metrics?.unit_prices?.per_km_from_amount_final)
                                        }}</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="text-subtitle-2 mb-1">Cálculo de impuestos (asumiendo exclusiva):</div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Impuesto:</span>
                                    <strong>{{ formatMoney(view.metrics?.tax_calc_assuming_exclusive?.tax_amount)
                                        }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Total:</span>
                                    <strong>{{ formatMoney(view.metrics?.tax_calc_assuming_exclusive?.total) }}</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="text-subtitle-2 mb-1">Cálculo de impuestos (asumiendo inclusiva):</div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Impuesto:</span>
                                    <strong>{{ formatMoney(view.metrics?.tax_calc_assuming_inclusive?.tax_amount)
                                        }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Subtotal:</span>
                                    <strong>{{ formatMoney(view.metrics?.tax_calc_assuming_inclusive?.subtotal)
                                        }}</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="text-subtitle-2 mb-1">Timestamps</div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Diferencia (s):</span>
                                    <strong>{{ view.metrics?.timestamps_check?.diff_seconds ?? '—' }}</strong>
                                </div>
                                <div class="m-1">
                                    <span class="text-medium-emphasis">Nota:</span>
                                    <div class="text-body-2 mt-1">{{ view.metrics?.timestamps_check?.consistency_note ??
                                        '—' }}</div>
                                </div>
                            </v-sheet>
                        </v-col>

                        <!-- Pasajero -->
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Pasajero</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">ID Pasajero:</span>
                                    <strong>{{ view.passenger?.id ?? view.service?.id_pasajero ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Nombre:</span>
                                    <strong>{{ passengerName }}</strong>
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

                                <v-divider class="my-2" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Calificación:</span>
                                    <v-chip size="small" variant="tonal" prepend-icon="mdi-star-outline">
                                        {{ view.passenger?.score ?? '—' }}
                                    </v-chip>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Registro:</span>
                                    <strong>{{ formatDateTime(view.passenger?.register_date) }}</strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <!-- Taxi -->
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Taxi</div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">ID Taxi:</span>
                                    <strong>{{ view.taxi?.id ?? view.taxi?.id_taxi ?? view.service?.id_taxi ?? '—'
                                        }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Marca:</span>
                                    <strong>{{ view.taxi?.marca ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Submarca:</span>
                                    <strong>{{ view.taxi?.submarca ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Modelo:</span>
                                    <strong>{{ view.taxi?.model ?? view.taxi?.modelo ?? '—' }}</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Placas:</span>
                                    <strong>{{ view.taxi?.placa ?? view.taxi?.placas ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">No. Económico:</span>
                                    <strong>{{ view.taxi?.num_eco || '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Serie (VIN):</span>
                                    <strong class="text-mono">{{ view.taxi?.serie || '—' }}</strong>
                                </div>

                                <v-divider class="my-2" />

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Tipo Taxi (ID):</span>
                                    <strong>{{ view.taxi?.id_tipo_taxi ?? '—' }}</strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Tipo Motor (ID):</span>
                                    <strong>{{ view.taxi?.id_tipo_motor ?? '—' }}</strong>
                                </div>

                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">Estatus:</span>
                                    <div class="d-flex align-center ga-2">
                                        <v-chip size="small" variant="tonal"
                                            :color="truthy(view.taxi?.activo) ? 'success' : 'warning'">
                                            {{ truthy(view.taxi?.activo) ? 'Activo' : 'Inactivo' }}
                                        </v-chip>
                                        <v-chip size="small" variant="tonal"
                                            :color="truthy(view.taxi?.conectado) ? 'success' : 'default'">
                                            {{ truthy(view.taxi?.conectado) ? 'Conectado' : 'Desconectado' }}
                                        </v-chip>
                                        <v-chip size="small" variant="tonal"
                                            :color="truthy(view.taxi?.ocupado) ? 'warning' : 'default'">
                                            {{ truthy(view.taxi?.ocupado) ? 'Ocupado' : 'Libre' }}
                                        </v-chip>
                                    </div>
                                </div>
                            </v-sheet>
                        </v-col>

                        <!-- Ruta -->
                        <v-col cols="12" v-if="hasRoute">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Ruta</div>

                                <GoogleMap ref="mapRef" 
                                    :api-key="apiKey" style="width: 100%; height: 500px"
                                    :center="center" :zoom="zoom" :disable-default-ui="true" :map-type-id="'roadmap'">
                                    <!-- Polyline de la ruta -->
                                    <Polyline :options="polylineOptions" />

                                    <!-- Origen -->
                                    <Marker :options="markerOptionsOrigin" />
                                    <!-- Destino -->
                                    <Marker :options="markerOptionsDestination" />

                                    <!-- Inicio / Fin reales -->
                                    <Circle v-if="startLatLng" :options="circleOptions(startLatLng)" />
                                    <Circle v-if="endLatLng" :options="circleOptions(endLatLng)" />
                                    <Marker v-if="endLatLng" :options="markerOptionsEnd" />
                                </GoogleMap>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                </v-card-actions>
            </template>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'
import { GoogleMap, Polyline, Circle, Marker } from 'vue3-google-map'

/* --------- Tipos --------- */
interface Service {
    id: number
    origin: string
    destination: string
    id_taxi: number
    id_pasajero: number
    latitud_origin?: string
    longitud_origin?: string
    latitud_destination?: string
    longitud_destination?: string
    distance: number
    time: number
    amount: number
    amount_final?: number
    tax?: number
    departure_origin?: string
    arrival_destination?: string
}
interface Metrics {
    distance_m?: number
    distance_km?: number
    duration_s?: number
    duration_min?: number
    duration_hhmmss?: string
    avg_speed_kmh?: number
    unit_prices?: { per_km_from_amount?: number; per_km_from_amount_final?: number }
    tax_rate_assumed?: number
    tax_calc_assuming_exclusive?: { tax_amount?: number; total?: number; note?: string }
    tax_calc_assuming_inclusive?: { tax_amount?: number; subtotal?: number; note?: string }
    timestamps_check?: { departure_origin?: string; arrival_destination?: string; diff_seconds?: number | null; consistency_note?: string }
}
interface Passenger {
    id: number
    first_name?: string
    last_name?: string
    second_surname?: string
    phone?: string
    email?: string
    username?: string
    register_date?: string
    score?: number
}
interface Taxi {
    id?: number
    id_taxi?: number
    marca?: string
    submarca?: string
    model?: string | number
    modelo?: string | number
    placa?: string
    placas?: string
    num_eco?: string
    num_motor?: string
    serie?: string
    color?: string
    id_tipo_taxi?: number
    id_tipo_motor?: number
    activo?: number | boolean
    ocupado?: number | boolean | null
    conectado?: number | boolean
    id_empresa?: number
}
interface RoutePoint { latitude?: number; longitude?: number }
interface ViewPayload {
    service?: Service
    metrics?: Metrics
    passenger?: Passenger
    taxi?: Taxi
    route?: RoutePoint[]
}
type LatLng = { lat: number; lng: number }

/* --------- Estado / carga --------- */
const $route = useRoute()
const router = useRouter()
const id = ref<number>(Number($route.params.id))
const loading = ref(true)
const error = ref<string | null>(null)

const view = computed<ViewPayload | null>(() => store.getters['serviceTravel/view'] ?? null)

/* --------- Helpers --------- */
const toNum = (v: unknown) => {
    const n = typeof v === 'string' ? parseFloat(v) : Number(v)
    return Number.isFinite(n) ? n : 0
}
const truthy = (v: unknown) => v === true || v === 1 || v === '1'

/* --------- Origen/Destino --------- */
const service = computed(() => view.value?.service ?? null)
const origin = computed<LatLng>(() => ({ lat: toNum(service.value?.latitud_origin), lng: toNum(service.value?.longitud_origin) }))
const destination = computed<LatLng>(() => ({ lat: toNum(service.value?.latitud_destination), lng: toNum(service.value?.longitud_destination) }))

/* --------- Ruta limpia --------- */
const routePoints = computed<LatLng[]>(() =>
    (view.value?.route ?? [])
        .map(p => ({ lat: toNum(p.latitude), lng: toNum(p.longitude) }))
        .filter(p => p.lat !== 0 && p.lng !== 0)
)
const hasRoute = computed(() => routePoints.value.length > 0)

/* --------- Inicio / Fin reales --------- */
const startLatLng = computed<LatLng | null>(() => (hasRoute.value ? routePoints.value[0] : null))
const endLatLng = computed<LatLng | null>(() => (hasRoute.value ? routePoints.value[routePoints.value.length - 1] : null))

/* --------- Etiquetas --------- */
const passengerName = computed(() => {
    const p = view.value?.passenger
    const parts = [p?.first_name, p?.last_name, p?.second_surname].filter(Boolean)
    return parts.join(' ').trim() || 'Pasajero'
})

/* --------- Centro/zoom --------- */
function midpoint(a: LatLng, b: LatLng): LatLng { return { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 } }
function bboxCenter(points: LatLng[]): LatLng {
    const lats = points.map(p => p.lat)
    const lngs = points.map(p => p.lng)
    const minLat = Math.min(...lats), maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
    return { lat: minLat + (maxLat - minLat) / 2, lng: minLng + (maxLng - minLng) / 2 }
}
const center = computed<LatLng>(() => (hasRoute.value ? bboxCenter(routePoints.value) : midpoint(origin.value, destination.value)))
const zoom = ref(14.5)

/* --------- Map & fitBounds (sin tipar google) --------- */
const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null)
function fitBounds() {
    const map = mapRef.value?.map
    const g = (globalThis as any).google?.maps
    if (!map || !g || !hasRoute.value) return

    const bounds = new g.LatLngBounds()
    routePoints.value.forEach(p => bounds.extend(p))
    bounds.extend(origin.value)
    bounds.extend(destination.value)
    map.fitBounds(bounds)
}
onMounted(() => nextTick(fitBounds))
watch(routePoints, () => nextTick(fitBounds))
watch([origin, destination], () => nextTick(fitBounds))

/* --------- Polyline & Circle --------- */
const polylineOptions = computed(() => ({
    path: routePoints.value,
    geodesic: true,
    strokeColor: '#0761c7',
    strokeOpacity: 1.0,
    strokeWeight: 2.5
}))
const circleOptions = (center: LatLng) => ({
    center,
    radius: 30,
    strokeOpacity: 0.8,
    strokeWeight: 0,
    fillColor: '#0761c7',
    fillOpacity: 0.35
})

/* --------- Marker options (evita error de tipos) --------- */
const markerOptionsOrigin = computed(() => ({
    position: origin.value,
    label: { text: 'Origen', color: '#08103A', fontSize: '12px' }
}) as any)

const markerOptionsDestination = computed(() => ({
    position: destination.value,
    label: { text: 'Destino', color: '#08103A', fontSize: '12px' }
}) as any)

const markerOptionsEnd = computed(() => ({
    position: endLatLng.value!,
    label: { text: passengerName.value, color: '#08103A', fontSize: '12px' }
}) as any)

/* --------- API Key --------- */
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/* --------- Carga de datos --------- */
onMounted(load)
watch(() => $route.params.id, (val) => { id.value = Number(val); load() })

async function load() {
    try {
        loading.value = true
        await store.dispatch('serviceTravel/view', id.value)
    } catch (e: any) {
        error.value = e?.message ?? 'Error al cargar el servicio'
    } finally {
        loading.value = false
    }
}

/* --------- Helpers formato --------- */
function formatDateTime(iso?: string | null) {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d)
}
function formatMoney(v?: number) {
    if (v === undefined || v === null || Number.isNaN(v)) return '—'
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(v)
}
function formatNumber(v?: number, digits = 2) {
    if (v === undefined || v === null || Number.isNaN(v)) return '—'
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v)
}
function formatKm(v?: number) {
    if (v === undefined || v === null || Number.isNaN(v)) return '—'
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(v)
}
function formatPercent(v?: number) {
    if (v === undefined || v === null || Number.isNaN(v)) return '—'
    const pct = v <= 1 ? v * 100 : v
    return `${formatNumber(pct, 0)}%`
}
function formatDuration(seconds?: number) {
    if (!Number.isFinite(seconds as number)) return '—'
    const s = Math.max(0, Math.floor(seconds as number))
    const hh = Math.floor(s / 3600)
    const mm = Math.floor((s % 3600) / 60)
    const ss = s % 60
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${hh}:${pad(mm)}:${pad(ss)}`
}
function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'services-list' })
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
