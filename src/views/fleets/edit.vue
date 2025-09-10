<!-- src/views/fleets/edit.vue -->
<template>
    <v-container fluid class="py-6">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Editar Flotilla #{{ id }}</h1>
            </div>

            <div class="d-flex ga-2">
                <v-btn color="secondary" variant="tonal" prepend-icon="mdi-eye-outline"
                    :to="{ name: 'fleets-view', params: { id } }">
                    Ver
                </v-btn>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <!-- Loading -->
            <template v-if="loading">
                <v-skeleton-loader type="article, list-item-two-line, list-item-two-line" class="pa-6" />
            </template>

            <!-- Error -->
            <template v-else-if="error">
                <v-alert type="error" variant="tonal" class="ma-6">
                    {{ error }}
                </v-alert>
            </template>

            <!-- Form -->
            <template v-else>
                <v-form ref="formRef" @submit.prevent="onSubmit">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.name" label="Nombre de la flotilla" variant="outlined"
                                    :rules="[rules.required, rules.min(3)]" autocomplete="off" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="form.code" label="Código" variant="outlined"
                                    :rules="[rules.required]" autocomplete="off" />
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
                                <v-text-field v-model="form.contact_name" label="Nombre de contacto"
                                    variant="outlined" />
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
                            Guardar cambios
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </template>
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
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

const route = useRoute()
const router = useRouter()

const id = ref<string | number | undefined>(route.params.id as string | undefined)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
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

/** Normalizador E.164 básico (agrega + si falta, quita separadores) */
function normalizePhone(v?: string) {
    if (!v) return ''
    let s = String(v).replace(/[\s()-]/g, '')
    if (s && s[0] !== '+') s = '+' + s
    // recorta a 16 (1 + 15 dígitos)
    if (s.length > 16) s = s.slice(0, 16)
    return s
}

onMounted(async () => {
    if (!id.value) {
        router.replace({ name: 'fleets-list' })
        return
    }
    await loadData(id.value)
})

watch(
    () => route.params.id,
    async (newVal) => {
        id.value = newVal as string
        if (id.value) await loadData(id.value)
    }
)

/** Carga por ID */
async function loadData(currentId: string | number) {
    try {
        loading.value = true
        error.value = null
        // TODO: Reemplaza por tu API/Store real:
        // const data = await api.fleets.getById(currentId)
        const data = await mockFetchFleet(currentId)
        if (!data) {
            error.value = 'No se encontró la flotilla.'
            return
        }
        // Setear formulario
        form.code = data.code
        form.name = data.name
        form.administrator_id = data.administrator_id
        form.contact_name = data.contact_name ?? ''
        form.contact_phone = data.contact_phone ?? ''
        form.contact_email = data.contact_email ?? ''
        form.status = (data.status as any) ?? 'ACTIVE'
        form.units_count = data.units_count ?? 0
        form.description = data.description ?? ''
    } catch (e: any) {
        error.value = e?.message ?? 'Ocurrió un error al cargar.'
    } finally {
        loading.value = false
    }
}

/** Guardar cambios */
async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (!valid) return

    try {
        saving.value = true
        // Limpieza/normalización antes de enviar
        if (form.contact_phone) form.contact_phone = normalizePhone(form.contact_phone)

        // TODO: reemplaza por tu API real:
        // await api.fleets.update(id.value!, { ...form })
        await mockUpdateFleet(id.value!, { ...form })

        snackbar.success.msg = 'Cambios guardados correctamente.'
        snackbar.success.open = true

        // Redirigir a la vista de detalle
        router.push({ name: 'fleets-view', params: { id: id.value } })
    } catch (e: any) {
        snackbar.error.msg = e?.message ?? 'No se pudo guardar.'
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

/** ------- DEMO: mocks; reemplaza por API real ------- */
async function mockFetchFleet(currentId: string | number): Promise<Fleet | null> {
    await new Promise(r => setTimeout(r, 400))
    if (!currentId) return null
    return {
        id: currentId,
        code: `FLT-${String(currentId).toString().padStart(4, '0')}`,
        name: `Flotilla Demo ${currentId}`,
        administrator_id: 1,
        contact_name: 'Contacto Demo',
        contact_phone: '+5213322238886',
        contact_email: 'demo@test.com',
        status: 'ACTIVE',
        units_count: 12,
        description: 'Descripción demo para edición.',
    }
}

async function mockUpdateFleet(currentId: string | number, payload: Partial<Fleet>) {
    await new Promise(r => setTimeout(r, 500))
    // Aquí podrías simular errores lanzando una excepción
    // throw new Error('Error de red')
    return { id: currentId, ...payload }
}
</script>

<style scoped>
/* Opcional: delineado suave */
</style>
