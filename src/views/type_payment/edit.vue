<!-- src/views/typePayment/add.vue (edición de Configuración con { name }) -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Editar Tipo Pago</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <Form @submit="onSubmit">
                <v-card-text>
                    <v-row dense>
                        <!-- name -->
                        <v-col cols="12" md="6">
                            <v-text-field v-model="name" label="Nombre" variant="outlined" autocomplete="off"
                                :error="!!errors.name" :error-messages="errors.name ? [errors.name] : []"
                                hint="Ej.: Bateria" persistent-hint />
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
            </Form>
        </v-card>

        <v-snackbar v-model="snackbar.success.open" color="success" :timeout="2500">
            {{ snackbar.success.msg }}
        </v-snackbar>
        <v-snackbar v-model="snackbar.error.open" color="error" :timeout="3500">
            {{ snackbar.error.msg }}
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Form, useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const store = useStore()
const saving = ref(false)

// id desde la ruta
const id = ref<number>(Number(route.params.id))

// Validación mínima para { name: string }
const schema = yup.object({
    name: yup
        .string()
        .transform(v => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : v))
        .min(2, 'Mínimo 2 caracteres')
        .max(120, 'Máximo 120 caracteres')
        .required('Requerido'),
})

const { handleSubmit, errors, setValues } = useForm({
    validationSchema: schema,
    initialValues: {
        name: '',
    },
})

const { value: name } = useField<string>('name')

// Getter de la vista de la configuración actual (ajusta al getter real si difiere)
const view = computed(() => store.getters['typePayment/view'])

// Cargar la config si hay id
async function load() {
    if (!Number.isNaN(id.value)) {
        await store.dispatch('typePayment/view', id.value)
    }
}

// Poblar el formulario cuando llegue la vista
watch(
    view,
    (val: any) => {
        if (!val) return
        setValues({
            name: (val.name ?? '').toString(),
        })
    },
    { immediate: true }
)

// Submit (editar)
const onSubmit = handleSubmit(
    async (values) => {
        try {
            saving.value = true

            // values === { name: '...' }
            const result = await store.dispatch('typePayment/edit', { id: id.value, body: values })

            if (!result) {
                snackbar.error.msg = 'No se pudo guardar.'
                snackbar.error.open = true
                return
            }

            const newId = result?.id ?? result?.id_config ?? id.value
            snackbar.success.msg = 'Guardado correctamente.'
            snackbar.success.open = true
            router.push({ name: 'type-payment-view', params: { id: newId } })
        } catch (e: any) {
            snackbar.error.msg = e?.message ?? 'No se pudo guardar.'
            snackbar.error.open = true
        } finally {
            saving.value = false
        }
    },
    () => { }
)

// Snackbars
const snackbar = reactive({
    success: { open: false, msg: '' },
    error: { open: false, msg: '' },
})

// Reaccionar a cambios de ruta (si navegas entre ids)
watch(
    () => route.params.id,
    () => {
        id.value = Number(route.params.id)
        load()
    }
)

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'type-payment-list' })
}

onMounted(() => {
    id.value = Number(route.params.id)
    load()
})
</script>
