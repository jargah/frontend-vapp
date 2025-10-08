<template>
    <v-container fluid class="fill-height d-flex align-center justify-center">

        <v-row align="center" justify="center" class="ma-0">

            <v-col cols="12" sm="8" md="4">
                
                <v-card-text class="text-center">
                    <v-img class="mx-auto" :width="300" aspect-ratio="16/9" cover :src="logo" />
                </v-card-text>
                <v-card class="pa-6" elevation="10" rounded="xl">

                    <v-card-title class="text-h6 text-center">Iniciar sesión</v-card-title>
                    <v-card-text>
                        <Form 
                            :validation-schema="schema" 
                            @submit="onSubmit" v-slot="{ meta }"
                        >
                            <Field name="username" 
                                v-slot="{ field, errors }">
                                <v-text-field 
                                    v-bind="field" 
                                    label="Usuario" 
                                    type="username" 
                                    autocomplete="username"
                                    :error="!!errors.length" 
                                    :error-messages="errors"
                                    prepend-inner-icon="mdi-account-outline" 
                                />
                            </Field>

                            <Field name="password" 
                                v-slot="{ field, errors }">
                                <v-text-field 
                                    v-bind="field" 
                                    :type="show ? 'text' : 'password'" 
                                    label="Contraseña"
                                    autocomplete="current-password" 
                                    :error="!!errors.length" 
                                    :error-messages="errors"
                                    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="show = !show"
                                    prepend-inner-icon="mdi-lock-outline" 
                                />
                            </Field>

                            <v-btn 
                                type="submit" 
                                block class="mt-2" 
                                :loading="loading"
                                variant="outlined"
                                :disabled="loading || !meta.valid"
                            >
                                Entrar
                            </v-btn>
                        </Form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import logo from '@/assets/images/logo.png'

const store = useStore()
const router = useRouter()
const show = ref(false)
const loading = ref(false)

const schema = yup.object({
    username: yup.string().required('El usuario es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
})

type LoginValues = { email: string; password: string }

async function onSubmit(values: LoginValues) {
    loading.value = true
    try {
        await store.dispatch('auth/login', values)
        router.push({ name: 'home' })
    } finally {
        loading.value = false
    }
}
</script>
