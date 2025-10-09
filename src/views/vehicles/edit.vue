<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Editar Vehículo</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <Form @submit="onSubmit">
                <v-card-text>
                    <v-row dense>
                        <!-- name -->
                        <v-col cols="12" md="6">
                            <v-text-field 
                                v-model="name" 
                                label="Nombre" 
                                variant="outlined" 
                                autocomplete="off"
                                :error="!!errors.name" :error-messages="errors.name ? [errors.name] : []" />
                        </v-col>

                        <!-- branch -->
                        <v-col cols="12" md="6">
                            <v-text-field 
                                v-model="branch" 
                                label="Marca" 
                                variant="outlined" 
                                autocomplete="off"
                                :error="!!errors.branch" :error-messages="errors.branch ? [errors.branch] : []" />
                        </v-col>

                        <!-- model -->
                        <v-col cols="12" md="6">
                            <v-text-field 
                                v-model="model" 
                                label="Modelo" 
                                variant="outlined" 
                                autocomplete="off"
                                :error="!!errors.model" :error-messages="errors.model ? [errors.model] : []" />
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
import { reactive, ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Form, useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// Router / Store
const route = useRoute()
const router = useRouter()
const store = useStore()
const saving = ref(false)

// id desde la ruta
const id = ref<number>(Number(route.params.id))

// Validación: los tres campos son obligatorios (trim + min 1)
const schema = yup.object({
    name: yup.string().trim().min(1, 'Requerido').required('Requerido'),
    branch: yup.string().trim().min(1, 'Requerido').required('Requerido'),
    model: yup.string().trim().min(1, 'Requerido').required('Requerido'),
})

// useForm
const { handleSubmit, errors, setValues } = useForm({
    validationSchema: schema,
    initialValues: {
        name: '',
        branch: '',
        model: '',
    },
})

const { value: name } = useField<string>('name')
const { value: branch } = useField<string>('branch')
const { value: model } = useField<string>('model')

const view = computed(() => store.getters['vehicles/view'])

async function load() {
    if (!Number.isNaN(id.value)) {
        await store.dispatch('vehicles/view', id.value)
    }
}

watch(
    view,
    (val: any) => {
        if (!val) return
        setValues({
            name: (val.name ?? '').toString(),
            branch: (val.branch ?? '').toString(),
            model: (val.model ?? '').toString(),
        })
    },
    { immediate: true }
)

// Submit (update)
const onSubmit = handleSubmit(
    async (values) => {
        try {
            saving.value = true
            const result = await store.dispatch('vehicles/edit', { id: id.value, body: values })

            if (!result) {
                snackbar.error.msg = 'No se pudo actualizar.'
                snackbar.error.open = true
                return
            }

            snackbar.success.msg = 'Actualizado correctamente.'
            snackbar.success.open = true

            // Redirección opcional
            router.push({ name: 'vehicles-view', params: { id: id.value } })
        } catch (e: any) {
            snackbar.error.msg = e?.message ?? 'No se pudo actualizar.'
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

watch(
    () => route.params.id,
    () => {
        id.value = Number(route.params.id)
        load()
    }
)

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'vehicles-list' })
}

onMounted(() => {
    id.value = Number(route.params.id)
    load()
})
</script>
