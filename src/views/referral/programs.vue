<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <h1 class="text-h5 mb-0">Programas de Referidos</h1>
            <div class="d-flex ga-2">
                <v-btn size="small" variant="text" prepend-icon="mdi-refresh" @click="resetDemo">Restaurar demo</v-btn>
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">Volver</v-btn>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <v-card-title class="d-flex align-center justify-space-between">
                Programas
                <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="openDialog()">Nuevo</v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="items" :loading="loading" item-key="id" :items-per-page="5">
                <template #item.percentage="{ item }">{{ item.percentage }}%</template>
                <template #item.actions="{ item }">
                    <v-btn icon="mdi-pencil-outline" variant="text" @click="openDialog(item)" />
                </template>
                <template #no-data>
                    <v-sheet class="pa-6 text-center">
                        <v-icon class="mb-2">mdi-database-off</v-icon>Sin registros
                    </v-sheet>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="520">
            <v-card rounded="xl">
                <v-card-title>{{ editing?.id ? 'Editar' : 'Nuevo' }} programa</v-card-title>
                <v-card-text>
                    <v-text-field v-model="editing.name" label="Nombre (Oro/Plata/Platino)" variant="outlined" />
                    <v-textarea v-model="editing.description" label="Descripción" variant="outlined" auto-grow />
                    <v-text-field v-model.number="editing.percentage" label="Porcentaje" variant="outlined"
                        type="number" min="0" max="100" suffix="%" />
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="save" prepend-icon="mdi-content-save-outline">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.open" :timeout="2400" color="success">{{ snackbar.msg }}</v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ReferralProgramsService, type ReferralProgram } from '@/services/referralPrograms.service'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'name' },
    { title: 'Descripción', key: 'description' },
    { title: 'Porcentaje', key: 'percentage', width: 120 },
    { title: '', key: 'actions', width: 80, align: 'end' },
]

const items = ref<ReferralProgram[]>([])
const loading = ref(false)

onMounted(loadItems)

async function loadItems() {
    loading.value = true
    try {
        items.value = await ReferralProgramsService.list()
        if (!items.value.length) {
            await seedFallback()
            items.value = await ReferralProgramsService.list()
        }
    } finally {
        loading.value = false
    }
}

async function seedFallback() {
    const defaults: Array<Partial<ReferralProgram>> = [
        { name: 'Oro', description: 'Nivel Oro con mayores beneficios.', percentage: 20 },
        { name: 'Plata', description: 'Nivel Plata, beneficios estándar.', percentage: 10 },
        { name: 'Platino', description: 'Nivel Platino, beneficios premium.', percentage: 30 },
    ]
    for (const p of defaults) {
        await ReferralProgramsService.upsert(p as any)
    }
}

async function resetDemo() {
    try {
        localStorage.removeItem('demo_referral_programs_v1')
    } catch { }
    await loadItems()
}

const dialog = ref(false)
const editing = reactive<Partial<ReferralProgram>>({})
function openDialog(item?: ReferralProgram) {
    dialog.value = true
    Object.assign(editing, item ?? { name: '', description: '', percentage: 0, id: undefined })
}
async function save() {
    items.value = await ReferralProgramsService.upsert({ ...editing } as any)
    dialog.value = false
    snackbar.value = { open: true, msg: 'Programa guardado.' }
}

const snackbar = ref({ open: false, msg: '' })
</script>
