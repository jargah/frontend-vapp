<!-- src/views/operators/edit.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Editar Operador #{{ id }}</h1>
            </div>
            <v-btn color="secondary" variant="tonal" prepend-icon="mdi-eye-outline"
                :to="{ name: 'operators-view', params: { id } }">Ver</v-btn>
        </div>

        <v-card rounded="xl" elevation="8">
            <template v-if="loading">
                <v-skeleton-loader class="pa-6" type="article, list-item-two-line" />
            </template>
            <template v-else-if="error">
                <v-alert type="error" variant="tonal" class="ma-6">{{ error }}</v-alert>
            </template>
            <template v-else>
                <v-form ref="formRef" @submit.prevent="onSubmit">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="form.name" label="Nombre" variant="outlined"
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
                                <v-select v-model="form.status" label="Status" variant="outlined" :items="statusItems"
                                    :rules="[rules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field :model-value="formatDate(createdAt)" label="Creación" variant="outlined"
                                    readonly />
                            </v-col>
                        </v-row>

                        <v-divider class="my-6" />

                        <div class="text-subtitle-1 mb-2 d-flex align-center ga-2">
                            <v-icon>mdi-file-document-edit-outline</v-icon> Datos Fiscales
                        </div>
                        <v-row dense>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="form.tax.rfc" label="RFC" variant="outlined"
                                    :rules="[rules.required, rules.rfc]" @blur="form.tax.rfc = toRFC(form.tax.rfc)" />
                            </v-col>
                            <v-col cols="12" md="8">
                                <v-text-field v-model="form.tax.business_name" label="Razón social" variant="outlined"
                                    :rules="[rules.required]" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="form.tax.regime" label="Régimen fiscal" variant="outlined"
                                    :items="regimeItems" :rules="[rules.required]" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="form.tax.zip" label="CP" variant="outlined"
                                    :rules="[rules.required, rules.cp]" maxlength="5" />
                            </v-col>
                        </v-row>

                        <v-divider class="my-6" />

                        <div class="text-subtitle-1 mb-2 d-flex align-center ga-2">
                            <v-icon>mdi-car</v-icon> Vehículo asignado
                        </div>
                        <v-row dense>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="form.vehicle.plates" label="Placas" variant="outlined"
                                    :rules="[rules.required, rules.plates]"
                                    @blur="form.vehicle.plates = toPlates(form.vehicle.plates)" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="form.vehicle.color" label="Color" variant="outlined"
                                    :rules="[rules.required]" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model.number="form.vehicle.year" label="Año" variant="outlined"
                                    type="number" :rules="[rules.year]" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model.number="form.vehicle.mileage" label="Kilometraje"
                                    variant="outlined" type="number" :rules="[rules.minValue(0)]" suffix="km" />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider />
                    <v-card-actions class="justify-end">
                        <v-btn variant="text" @click="goBack">Cancelar</v-btn>
                        <v-btn color="primary" :loading="saving" :disabled="saving" type="submit"
                            prepend-icon="mdi-content-save-outline">Guardar cambios</v-btn>
                    </v-card-actions>
                </v-form>
            </template>
        </v-card>

        <v-snackbar v-model="snackbar.success.open" color="success" :timeout="2500">{{ snackbar.success.msg
            }}</v-snackbar>
        <v-snackbar v-model="snackbar.error.open" color="error" :timeout="3500">{{ snackbar.error.msg }}</v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { OperatorsService, type Operator } from '@/services/operators.service'

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formRef = ref<any>(null)
const createdAt = ref<string>('')

const form = reactive<Omit<Operator, 'id' | 'created_at'>>({
    name: '', email: '', phone: '', status: 'ACTIVE',
    tax: { rfc: '', business_name: '', regime: 'RÉGIMEN GENERAL', zip: '' },
    vehicle: { plates: '', color: '', year: new Date().getFullYear(), mileage: 0 },
})

const statusItems = [{ title: 'ACTIVO', value: 'ACTIVE' }, { title: 'INACTIVO', value: 'INACTIVE' }]
const regimeItems = ['RÉGIMEN GENERAL', 'RIF', 'ASALARIADOS']

const rules = {
    required: (v: any) => (!!v || v === 0) || 'Requerido',
    min: (n: number) => (v: string) => (!v || v.length >= n) || `Mínimo ${n} caracteres`,
    minValue: (n: number) => (v: number) => (v === undefined || v === null || v >= n) || `Mínimo ${n}`,
    email: (v: string) => (!!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Correo inválido',
    phone: (v: string) => (!v || /^\+\d{6,15}$/.test(v)) || 'Teléfono E.164 inválido',
    rfc: (v: string) => (!!v && /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/.test(v)) || 'RFC inválido',
    cp: (v: string) => (!!v && /^\d{5}$/.test(v)) || 'CP inválido',
    plates: (v: string) => (!!v && /^[A-Z0-9-]{5,10}$/.test((v || '').toUpperCase())) || 'Placas inválidas',
    year: (v: number) => {
        const y = Number(v); const now = new Date().getFullYear() + 1
        return (y >= 1980 && y <= now) || `Año entre 1980 y ${now}`
    },
}

function normalizePhone(v?: string) { if (!v) return ''; let s = String(v).replace(/[\s()-]/g, ''); if (s && s[0] !== '+') s = '+' + s; return s.slice(0, 16) }
function toRFC(v?: string) { return (v ?? '').trim().toUpperCase() }
function toPlates(v?: string) { return (v ?? '').trim().toUpperCase() }

onMounted(load)

async function load() {
    try {
        loading.value = true
        error.value = null
        const data = await OperatorsService.getById(id.value)
        if (!data) { error.value = 'No encontrado.'; return }
        form.name = data.name
        form.email = data.email
        form.phone = data.phone
        form.status = data.status
        form.tax = { ...data.tax }
        form.vehicle = { ...data.vehicle }
        createdAt.value = data.created_at
    } catch (e: any) {
        error.value = e?.message ?? 'Error al cargar.'
    } finally {
        loading.value = false
    }
}

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (!valid) return
    try {
        saving.value = true
        form.phone = normalizePhone(form.phone)
        form.tax.rfc = toRFC(form.tax.rfc)
        form.vehicle.plates = toPlates(form.vehicle.plates)
        await OperatorsService.update(id.value, { ...form })
        snackbar.success = { open: true, msg: 'Cambios guardados.' }
        router.push({ name: 'operators-view', params: { id: id.value } })
    } catch (e: any) {
        snackbar.error = { open: true, msg: e?.message ?? 'No se pudo guardar.' }
    } finally {
        saving.value = false
    }
}
function formatDate(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d)
}
function goBack() { if (history.length > 1) router.back(); else router.push({ name: 'operators-list' }) }

const snackbar = reactive({ success: { open: false, msg: '' }, error: { open: false, msg: '' } })
</script>
