<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Agregar Tipo Taxi</h1>
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Form, useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const store = useStore()
const saving = ref(false)

// Validación mínima para { name: string }
// - requerido
// - sin espacios a los lados
// - colapsa espacios internos
// - longitud sugerida 2..120
const schema = yup.object({
    name: yup
        .string()
        .transform((v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : v))
        .min(2, 'Mínimo 2 caracteres')
        .max(120, 'Máximo 120 caracteres')
        .required('Requerido'),
})

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        name: '',
    },
})

const { value: name } = useField<string>('name')

const onSubmit = handleSubmit(
    async (values) => {
        try {
            saving.value = true

            // values === { name: '...' }
            // Ajusta el action/ruta según tu módulo Vuex y tus rutas reales:
            const result = await store.dispatch('typeTaxi/create', values)

            if (!result) {
                snackbar.error.msg = 'No se pudo crear.'
                snackbar.error.open = true
                return
            }

            // Intenta detectar id devuelto (id o id_config)
            const newId = result?.id ?? result?.id_config
            if (newId) {
                router.push({ name: 'type-taxi-view', params: { id: newId } })
            } else {
                snackbar.success.msg = 'Creado correctamente.'
                snackbar.success.open = true
                // fallback a listado si no hay id
                router.push({ name: 'type-taxi-list' })
            }
        } catch (e: any) {
            snackbar.error.msg = e?.message ?? 'No se pudo crear.'
            snackbar.error.open = true
        } finally {
            saving.value = false
        }
    },
    () => { }
)

const snackbar = reactive({
    success: { open: false, msg: '' },
    error: { open: false, msg: '' },
})

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'type-taxi-list' })
}
</script>
