<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Agregar Referido</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8" class="mb-6">
            <v-form ref="formRef" @submit.prevent="onSubmit">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.operator_name" label="Nombre operador" variant="outlined"
                                :rules="[rules.required, rules.min(2)]" autocomplete="off" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.email" label="Correo" variant="outlined"
                                :rules="[rules.required, rules.email]" autocomplete="off" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.phone" label="Teléfono (E.164)" variant="outlined"
                                placeholder="+5213312345678" :rules="[rules.phone]"
                                @blur="form.phone = normalizePhone(form.phone)" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select v-model="form.program_level" :items="levels" label="Nivel programa"
                                variant="outlined" :rules="[rules.required]" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select v-model="form.status" :items="statusItems" label="Status" variant="outlined"
                                :rules="[rules.required]" />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cancelar</v-btn>
                    <v-btn color="primary" type="submit" :loading="saving" :disabled="saving"
                        prepend-icon="mdi-content-save-outline">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

        <!-- Redenciones -->
        <v-card rounded="xl" elevation="8" class="mb-6">
            <v-card-title class="d-flex align-center justify-space-between">
                Puntos redimidos
                <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addRedeemRow">Agregar</v-btn>
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="redeemHeaders" :items="form.redeemed" item-key="id" :items-per-page="5">
                    <template #item.product_name="{ item }">
                        <v-autocomplete v-model="item.product_name" :items="productNames" label="Producto" hide-details
                            density="comfortable" />
                    </template>
                    <template #item.points_spent="{ item }">
                        <v-text-field v-model.number="item.points_spent" type="number" min="0" hide-details
                            density="comfortable" />
                    </template>
                    <template #item.created_at="{ item }">
                        <v-text-field v-model="item.created_at" type="datetime-local" hide-details
                            density="comfortable" />
                    </template>
                    <template #item.actions="{ item }">
                        <v-btn icon="mdi-delete-outline" variant="text" color="error"
                            @click="removeRedeemRow(item.id)" />
                    </template>
                    <template #no-data>
                        <v-sheet class="pa-6 text-center"><v-icon class="mb-2">mdi-gift-off</v-icon>Sin
                            redenciones</v-sheet>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!-- Viajes -->
        <v-card rounded="xl" elevation="8">
            <v-card-title class="d-flex align-center justify-space-between">
                Viajes completados
                <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addTripRow">Agregar</v-btn>
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="tripHeaders" :items="form.trips" item-key="id" :items-per-page="5"
                    density="comfortable">
                    <template #item.passenger_name="{ item }">
                        <v-text-field v-model="item.passenger_name" hide-details density="comfortable" />
                    </template>
                    <template #item.trip_title="{ item }"><v-text-field v-model="item.trip_title" hide-details
                            density="comfortable" /></template>
                    <template #item.origin="{ item }"><v-text-field v-model="item.origin" hide-details
                            density="comfortable" /></template>
                    <template #item.destination="{ item }"><v-text-field v-model="item.destination" hide-details
                            density="comfortable" /></template>
                    <template #item.duration_min="{ item }"><v-text-field v-model.number="item.duration_min"
                            type="number" min="0" hide-details density="comfortable" /></template>
                    <template #item.km="{ item }"><v-text-field v-model.number="item.km" type="number" min="0"
                            hide-details density="comfortable" /></template>
                    <template #item.points_generated="{ item }"><v-text-field v-model.number="item.points_generated"
                            type="number" min="0" hide-details density="comfortable" /></template>
                    <template #item.created_at="{ item }"><v-text-field v-model="item.created_at" type="datetime-local"
                            hide-details density="comfortable" /></template>
                    <template #item.actions="{ item }"><v-btn icon="mdi-delete-outline" variant="text" color="error"
                            @click="removeTripRow(item.id)" /></template>
                    <template #no-data>
                        <v-sheet class="pa-6 text-center"><v-icon class="mb-2">mdi-car-off</v-icon>Sin viajes</v-sheet>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <v-snackbar v-model="snackbar.success.open" color="success" :timeout="2500">{{ snackbar.success.msg
            }}</v-snackbar>
        <v-snackbar v-model="snackbar.error.open" color="error" :timeout="3500">{{ snackbar.error.msg }}</v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ReferralsService, type Referral, type RedeemedDetail, type TripDetail } from '@/services/referrals.service'
import { ReferralProductsService } from '@/services/referralProducts.service'

const router = useRouter()
const formRef = ref<any>(null)
const saving = ref(false)

const levels = ['Oro', 'Plata', 'Platino']
const statusItems = ['ACTIVE', 'INACTIVE']

const form = reactive<Omit<Referral, 'id' | 'created_at'>>({
    operator_name: '', email: '', phone: '', program_level: 'Plata', status: 'ACTIVE',
    redeemed: [], trips: [],
})

const rules = {
    required: (v: any) => (!!v || v === 0) || 'Requerido',
    min: (n: number) => (v: string) => (!v || v.length >= n) || `Mínimo ${n} caracteres`,
    email: (v: string) => (!!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Correo inválido',
    phone: (v: string) => (!v || /^\+\d{6,15}$/.test(v)) || 'Teléfono E.164 inválido',
}
function normalizePhone(v?: string) { if (!v) return ''; let s = String(v).replace(/[\s()-]/g, ''); if (s && s[0] !== '+') s = '+' + s; return s.slice(0, 16) }

/* Productos (sin top-level await) */
const products = ref<any[]>([])
onMounted(async () => {
    products.value = await ReferralProductsService.list()
})
const productNames = computed(() => products.value.map(p => p.name))

/* Redenciones */
const redeemHeaders = [
    { title: 'Producto', key: 'product_name' },
    { title: 'Puntos gastados', key: 'points_spent', width: 160 },
    { title: 'Creación', key: 'created_at', width: 200 },
    { title: '', key: 'actions', width: 80, align: 'end' },
]
function addRedeemRow() {
    const id = (form.redeemed.at(-1)?.id ?? 0) + 1
    const row: RedeemedDetail = {
        id, product_id: 0, product_name: '',
        points_spent: 0, created_at: new Date().toISOString().slice(0, 16)
    }
    form.redeemed.push(row)
}
function removeRedeemRow(id: number) { form.redeemed = form.redeemed.filter(r => r.id !== id) as any }

/* Viajes */
const tripHeaders = [
    { title: 'Nombre pasajero', key: 'passenger_name' },
    { title: 'Viaje', key: 'trip_title' },
    { title: 'Origen', key: 'origin' },
    { title: 'Destino', key: 'destination' },
    { title: 'Tiempo (min)', key: 'duration_min', width: 120 },
    { title: 'KM', key: 'km', width: 100 },
    { title: 'Puntos generados', key: 'points_generated', width: 160 },
    { title: 'Creación', key: 'created_at', width: 200 },
    { title: '', key: 'actions', width: 80, align: 'end' },
]
function addTripRow() {
    const id = (form.trips.at(-1)?.id ?? 0) + 1
    const row: TripDetail = {
        id, passenger_name: '', trip_title: '', origin: '', destination: '',
        duration_min: 0, km: 0, points_generated: 0, created_at: new Date().toISOString().slice(0, 16)
    }
    form.trips.push(row)
}
function removeTripRow(id: number) { form.trips = form.trips.filter(t => t.id !== id) as any }

const snackbar = reactive({ success: { open: false, msg: '' }, error: { open: false, msg: '' } })

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (!valid) return
    try {
        saving.value = true
        form.phone = normalizePhone(form.phone)
        const created = await ReferralsService.create({ ...form })
        snackbar.success = { open: true, msg: 'Referido creado.' }
        router.push({ name: 'referrals-view', params: { id: created.id } })
    } catch (e: any) {
        snackbar.error = { open: true, msg: e?.message ?? 'No se pudo crear.' }
    } finally {
        saving.value = false
    }
}
function goBack() { if (history.length > 1) router.back(); else router.push({ name: 'referrals-list' }) }
</script>
