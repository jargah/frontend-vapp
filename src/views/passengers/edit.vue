<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Editar Usuario</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <Form @submit="onSubmit">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-select v-model="rol_id" label="Roles" variant="outlined" :items="roles"
                                item-title="label" item-value="value" :error="!!errors.rol_id"
                                :error-messages="errors.rol_id ? [errors.rol_id] : []" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="first_name" label="Nombre" variant="outlined" autocomplete="off"
                                :error="!!errors.first_name"
                                :error-messages="errors.first_name ? [errors.first_name] : []" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="last_name" label="Apellido" variant="outlined" autocomplete="off"
                                :error="!!errors.last_name"
                                :error-messages="errors.last_name ? [errors.last_name] : []" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="username" label="Usuario" variant="outlined" autocomplete="off"
                                :error="!!errors.username" :error-messages="errors.username ? [errors.username] : []" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="email" label="Email" variant="outlined" autocomplete="off"
                                :error="!!errors.email" :error-messages="errors.email ? [errors.email] : []" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="phone" label="Teléfono" variant="outlined" autocomplete="off"
                                :error="!!errors.phone" :error-messages="errors.phone ? [errors.phone] : []" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="password" label="Contraseña (opcional)" type="password"
                                variant="outlined" autocomplete="new-password" :error="!!errors.password"
                                :error-messages="errors.password ? [errors.password] : []"
                                hint="Déjala vacía si no quieres cambiarla" persistent-hint />
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

const id = ref<number>(Number(route.params.id))

const schema = yup.object({
    rol_id: yup.number().typeError('Seleccione un rol').required('Requerido'),
    first_name: yup.string().trim().min(2, 'Mínimo 2 caracteres').required('Requerido'),
    last_name: yup.string().trim().min(2, 'Mínimo 2 caracteres').required('Requerido'),
    username: yup.string().trim().min(2, 'Mínimo 2 caracteres').required('Requerido'),
    email: yup.string().trim().email('Email inválido').required('Requerido'),
    phone: yup
        .string()
        .trim()
        .matches(/^[0-9+\-\s()]{7,20}$/, 'Teléfono inválido')
        .required('Requerido'),
    password: yup
        .string()
        .transform(v => (v === '' ? undefined : v))
        .optional()
        .min(8, 'Mínimo 8 caracteres'),
})

// useForm
const { handleSubmit, errors, setValues } = useForm({
    validationSchema: schema,
    initialValues: {
        rol_id: null as unknown as number | null,
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
    },
})

const { value: rol_id } = useField<number | null>('rol_id')
const { value: first_name } = useField<string>('first_name')
const { value: last_name } = useField<string>('last_name')
const { value: username } = useField<string>('username')
const { value: email } = useField<string>('email')
const { value: phone } = useField<string>('phone')
const { value: password } = useField<string | undefined>('password')

const roles = computed(() => {
    const data = store.getters['roles/select']
    return (data ?? []).map((item: any) => ({
        label: item.name,
        value: Number(item.id_role), // ⬅️ asegura tipo numérico
    }))
})

const view = computed(() => store.getters['users/view'])

const selectRoles = async () => {
    await store.dispatch('roles/select')
}

async function load() {
    if (!Number.isNaN(id.value)) {
        await store.dispatch('users/view', id.value)
    }
}

watch(
    view,
    (val: any) => {
        if (!val) return
        setValues({
            rol_id:
                val.rol_id != null
                    ? Number(val.rol_id)
                    : val.role_id != null
                        ? Number(val.role_id)
                        : val.role?.id_role != null
                            ? Number(val.role.id_role)
                            : null,
            first_name: (val.first_name ?? val.name ?? '').toString(),
            last_name: (val.last_name ?? val.surname ?? '').toString(),
            username: (val.username ?? val.user ?? '').toString(),
            email: (val.email ?? '').toString(),
            phone: (val.phone ?? val.telefono ?? '').toString(),
            password: '',
        })
    },
    { immediate: true }
)

const onSubmit = handleSubmit(
    async (values) => {
        try {
            saving.value = true
            const result = await store.dispatch('users/edit', { id: id.value, body: values })
            if (!result) {
                snackbar.error.msg = 'No se pudo crear.'
                snackbar.error.open = true
                return
            }
            router.push({ name: 'users-view', params: { id: result.id } })
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

watch(
    () => route.params.id,
    () => {
        id.value = Number(route.params.id)
        load()
    }
)

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'users-list' })
}

onMounted(() => {
    id.value = Number(route.params.id)
    selectRoles()
    load()
})
</script>
