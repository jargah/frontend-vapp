<!-- src/views/configs/edit.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Editar Configuración #{{ id }}</h1>
            </div>
            <v-btn color="secondary" variant="tonal" prepend-icon="mdi-eye-outline"
                :to="{ name: 'settings-view', params: { id } }">Ver</v-btn>
        </div>

        <v-card rounded="xl" elevation="8">
            <template v-if="loading">
                <v-skeleton-loader type="article, list-item-two-line" class="pa-6" />
            </template>
            <template v-else-if="error">
                <v-alert type="error" variant="tonal" class="ma-6">{{ error }}</v-alert>
            </template>
            <template v-else>
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
                            <v-col cols="12" md="6">
                                <v-text-field :model-value="formatDate(createdAt)" label="Creación" variant="outlined"
                                    readonly />
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

        <v-snackbar v-model="snackbar.success.open" color="success" :timeout="2500">
            {{ snackbar.success.msg }}
        </v-snackbar>
        <v-snackbar v-model="snackbar.error.open" color="error" :timeout="3500">
            {{ snackbar.error.msg }}
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ConfigsService, type ConfigItem } from '@/services/configs.service'

const route = useRoute()
const router = useRouter()

const id = ref<number>(Number(route.params.id))
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formRef = ref<any>(null)
const createdAt = ref<string>('')

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

onMounted(load)

async function load() {
    try {
        loading.value = true
        error.value = null
        const data = await ConfigsService.getById(id.value)
        if (!data) { error.value = 'No encontrado.'; return }
        form.name = data.name
        form.value = data.value
        form.status = data.status
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
        await ConfigsService.update(id.value, { ...form })
        snackbar.success.msg = 'Cambios guardados.'
        snackbar.success.open = true
        router.push({ name: 'settings-view', params: { id: id.value } })
    } catch (e: any) {
        snackbar.error.msg = e?.message ?? 'No se pudo guardar.'
        snackbar.error.open = true
    } finally {
        saving.value = false
    }
}

function formatDate(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    }).format(d)
}

function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'settings-list' })
}

const snackbar = reactive({
    success: { open: false, msg: '' },
    error: { open: false, msg: '' },
})
</script>
