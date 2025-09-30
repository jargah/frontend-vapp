<!-- src/views/operators/add.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Agregar Operador</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
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
                            <v-text-field v-model.number="form.vehicle.mileage" label="Kilometraje" variant="outlined"
                                type="number" :rules="[rules.minValue(0)]" suffix="km" />
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider />
                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cancelar</v-btn>
                    <v-btn color="primary" :loading="saving" :disabled="saving" type="submit"
                        prepend-icon="mdi-content-save-outline">Guardar</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

        <v-snackbar v-model="snackbar.success.open" color="success" :timeout="2500">{{ snackbar.success.msg
            }}</v-snackbar>
        <v-snackbar v-model="snackbar.error.open" color="error" :timeout="3500">{{ snackbar.error.msg }}</v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { OperatorsService, type Operator } from '@/services/operators.service'

const router = useRouter()
const formRef = ref<any>(null)
const saving = ref(false)

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

const snackbar = reactive({ success: { open: false, msg: '' }, error: { open: false, msg: '' } })

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (!valid) return
    try {
        saving.value = true
        form.phone = normalizePhone(form.phone)
        form.tax.rfc = toRFC(form.tax.rfc)
        form.vehicle.plates = toPlates(form.vehicle.plates)
        const created = await OperatorsService.create({ ...form })
        snackbar.success = { open: true, msg: 'Operador creado.' }
        router.push({ name: 'operators-view', params: { id: created.id } })
    } catch (e: any) {
        snackbar.error = { open: true, msg: e?.message ?? 'No se pudo crear.' }
    } finally {
        saving.value = false
    }
}
function goBack() { if (history.length > 1) router.back(); else router.push({ name: 'operators-list' }) }
</script>
