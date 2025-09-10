<!-- src/views/fleets/add.vue -->
<template>
    <v-container fluid class="py-6">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Agregar Flotilla</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <v-form ref="formRef" @submit.prevent="onSubmit">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name" label="Nombre de la flotilla" variant="outlined"
                                :rules="[rules.required, rules.min(3)]" autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="form.code" label="Código" variant="outlined"
                                :rules="[rules.required]" autocomplete="off" hint="Ej. FLT-0001" persistent-hint />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-select v-model="form.status" label="Estado" variant="outlined" :items="statusItems"
                                :rules="[rules.required]" chips />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model.number="form.administrator_id" label="ID Administrador"
                                variant="outlined" type="number" :rules="[rules.required, rules.minValue(1)]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model.number="form.units_count" label="Unidades" variant="outlined"
                                type="number" :rules="[rules.minValue(0)]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.contact_name" label="Nombre de contacto" variant="outlined" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.contact_phone" label="Teléfono (E.164)" variant="outlined"
                                placeholder="+5213322238886" :rules="[rules.phone]"
                                @blur="form.contact_phone = normalizePhone(form.contact_phone)" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.contact_email" label="Correo" variant="outlined"
                                :rules="[rules.email]" />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="form.description" label="Descripción" variant="outlined" auto-grow
                                rows="3" />
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider />

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cancelar</v-btn>
                    <v-btn color="primary" :loading="saving" :disabled="saving" type="submit"
                        prepend-icon="mdi-content-save-outline">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

        <!-- Snackbars -->
        <v-snackbar v-model="snackbar.success.open" :timeout="2500" color="success">
            {{ snackbar.success.msg }}
        </v-snackbar>
        <v-snackbar v-model="snackbar.error.open" :timeout="3500" color="error">
            {{ snackbar.error.msg }}
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

type Fleet = {
    id: number | string
    code: string
    name: string
    administrator_id: number
    contact_name?: string
    contact_phone?: string
    contact_email?: string
    status: 'ACTIVE' | 'INACTIVE' | string
    units_count?: number
    description?: string
}

const router = useRouter()

const saving = ref(false)
const formRef = ref<any>(null)

const form = reactive<Partial<Fleet>>({
    code: '',
    name: '',
    administrator_id: 1,
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    status: 'ACTIVE',
    units_count: 0,
    description: '',
})

const statusItems = [
    { title: 'ACTIVO', value: 'ACTIVE' },
    { title: 'INACTIVO', value: 'INACTIVE' },
]

/** Validaciones simples */
const rules = {
    required: (v: any) => (!!v || v === 0) || 'Requerido',
    min: (len: number) => (v: string) => (!v || v.length >= len) || `Mínimo ${len} caracteres`,
    minValue: (n: number) => (v: number) => (v === undefined || v === null || v >= n) || `Mínimo ${n}`,
    email: (v: string) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Correo inválido',
    phone: (v: string) => (!v || /^\+\d{6,15}$/.test(v)) || 'Teléfono E.164 inválido',
}

/** Normalizador E.164 básico */
function normalizePhone(v?: string) {
    if (!v) return ''
    let s = String(v).replace(/[\s()-]/g, '')
    if (s && s[0] !== '+') s = '+' + s
    if (s.length > 16) s = s.slice(0, 16)
    return s
}

/** Guardar */
async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (!valid) return

    try {
        saving.value = true
        if (form.contact_phone) form.contact_phone = normalizePhone(form.contact_phone)

        // TODO: Reemplaza por tu API/Store real:
        // const created = await api.fleets.create({ ...form })
        const created = await mockCreateFleet({ ...form })

        snackbar.success.msg = 'Flotilla creada correctamente.'
        snackbar.success.open = true

        // Ir al detalle de la nueva flotilla
        router.push({ name: 'fleets-view', params: { id: created.id } })
    } catch (e: any) {
        snackbar.error.msg = e?.message ?? 'No se pudo crear la flotilla.'
        snackbar.error.open = true
    } finally {
        saving.value = false
    }
}

function goBack() {
    if (window.history.length > 1) router.back()
    else router.push({ name: 'fleets-list' })
}

/** Snackbars */
const snackbar = reactive({
    success: { open: false, msg: '' },
    error: { open: false, msg: '' },
})

/** ------- DEMO: mock de creación; reemplaza por tu API real ------- */
async function mockCreateFleet(payload: Partial<Fleet>): Promise<Fleet> {
    await new Promise(r => setTimeout(r, 500))
    // Simula un ID autoincremental
    const newId = Math.floor(Math.random() * 9000) + 1000
    return {
        id: newId,
        code: payload.code || `FLT-${String(newId).padStart(4, '0')}`,
        name: payload.name || 'Sin nombre',
        administrator_id: payload.administrator_id ?? 1,
        contact_name: payload.contact_name || '',
        contact_phone: payload.contact_phone || '',
        contact_email: payload.contact_email || '',
        status: (payload.status as any) ?? 'ACTIVE',
        units_count: payload.units_count ?? 0,
        description: payload.description || '',
    }
}
</script>

<style scoped>
/* Opcional: estilos mínimos */
</style>
