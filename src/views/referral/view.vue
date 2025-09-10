<!-- src/views/referrals/view.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Referido #{{ id }}</h1>
            </div>
            <v-btn color="primary" prepend-icon="mdi-pencil-outline"
                :to="{ name: 'referrals-edit', params: { id } }">Editar</v-btn>
        </div>

        <v-card rounded="xl" elevation="8" class="mb-6">
            <v-card-item>
                <div class="d-flex align-center ga-4">
                    <v-avatar color="primary" size="56"><v-icon size="32">mdi-account-plus-outline</v-icon></v-avatar>
                    <div>
                        <div class="text-h6">{{ item?.operator_name }}</div>
                        <div class="text-medium-emphasis">
                            Nivel:
                            <v-chip size="x-small" :color="levelColor(item?.program_level || '')">
                                {{ item?.program_level }}
                            </v-chip>
                        </div>
                        <div class="text-medium-emphasis">Creación: {{ item && formatDate(item.created_at) }}</div>
                    </div>
                </div>
            </v-card-item>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-sheet class="pa-4 rounded-lg border">
                            <div class="text-overline mb-2">Contacto</div>
                            <div class="d-flex justify-space-between"><span
                                    class="text-medium-emphasis">Correo:</span><strong>{{ item?.email }}</strong></div>
                            <div class="d-flex justify-space-between"><span
                                    class="text-medium-emphasis">Teléfono:</span><strong>{{ item?.phone }}</strong>
                            </div>
                            <div class="d-flex justify-space-between"><span
                                    class="text-medium-emphasis">Status:</span><v-chip size="small"
                                    :color="item?.status === 'ACTIVE' ? 'success' : 'warning'">{{ item?.status }}</v-chip>
                            </div>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card rounded="xl" elevation="8" class="mb-6">
            <v-card-title>Puntos redimidos</v-card-title>
            <v-data-table :headers="redeemHeaders" :items="item?.redeemed || []" item-key="id" :items-per-page="5">
                <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
                <template #no-data>
                    <v-sheet class="pa-6 text-center"><v-icon class="mb-2">mdi-gift-off</v-icon>Sin
                        redenciones</v-sheet>
                </template>
            </v-data-table>
        </v-card>

        <v-card rounded="xl" elevation="8">
            <v-card-title>Viajes completados</v-card-title>
            <v-data-table :headers="tripHeaders" :items="item?.trips || []" item-key="id" :items-per-page="5"
                density="comfortable">
                <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
                <template #no-data>
                    <v-sheet class="pa-6 text-center"><v-icon class="mb-2">mdi-car-off</v-icon>Sin viajes</v-sheet>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ReferralsService, type Referral } from '@/services/referrals.service'

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const item = ref<Referral | null>(null)
onMounted(load)
watch(() => route.params.id, () => { id.value = Number(route.params.id); load() })

async function load() { item.value = await ReferralsService.getById(id.value) }
function levelColor(lvl: string) { return lvl === 'Oro' ? 'amber' : lvl === 'Plata' ? 'grey' : '' }
function formatDate(iso: string) { const d = new Date(iso); return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d) }
function goBack() { if (history.length > 1) router.back(); else router.push({ name: 'referrals-list' }) }

const redeemHeaders = [
    { title: 'Producto', key: 'product_name' },
    { title: 'Puntos gastados', key: 'points_spent', width: 160 },
    { title: 'Creación', key: 'created_at', width: 180 },
]
const tripHeaders = [
    { title: 'Nombre pasajero', key: 'passenger_name' },
    { title: 'Viaje', key: 'trip_title' },
    { title: 'Origen', key: 'origin' },
    { title: 'Destino', key: 'destination' },
    { title: 'Tiempo (min)', key: 'duration_min', width: 120 },
    { title: 'KM', key: 'km', width: 90 },
    { title: 'Puntos generados', key: 'points_generated', width: 160 },
    { title: 'Creación', key: 'created_at', width: 180 },
]
</script>

<style scoped>
.border {
    border: 1px solid rgba(0, 0, 0, .08);
}
</style>
