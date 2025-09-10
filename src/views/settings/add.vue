<!-- src/views/configs/add.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Agregar Configuración</h1>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <v-form ref="formRef" @submit.prevent="onSubmit">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name" label="Nombre" variant="outlined"
                                :rules="[rules.required, rules.min(2)]" autocomplete="off" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.value" label="Valor" variant="outlined"
                                :rules="[rules.required]" autocomplete="off" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select v-model="form.status" label="Status" variant="outlined" :items="statusItems"
                                :rules="[rules.required]" />
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
import { ConfigsService } from '@/services/configs.service'

const router = useRouter()
const formRef = ref<any>(null)
const saving = ref(false)

const form = reactive({
    name: '',
    value: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
})

const statusItems = [
    { title: 'ACTIVO', value: 'ACTIVE' },
    { title: 'INACTIVO', value: 'INACTIVE' },
]

const rules = {
    required: (v: any) => (!!v || v === 0) || 'Requerido',
    min: (n: number) => (v: string) => (!v || v.length >= n) || `Mínimo ${n} caracteres`,
}

const snackbar = reactive({
    success: { open: false, msg: '' },
    error: { open: false, msg: '' },
})

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (!valid) return
    try {
        saving.value = true
        const created = await ConfigsService.create({ ...form })
        snackbar.success.msg = 'Configuración creada.'
        snackbar.success.open = true
        router.push({ name: 'settings-view', params: { id: created.id } })
    } catch (e: any) {
        snackbar.error.msg = e?.message ?? 'No se pudo crear.'
        snackbar.error.open = true
    } finally {
        saving.value = false
    }
}

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'settings-list' })
}
</script>
