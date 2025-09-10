<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <h1 class="text-h5 mb-0">Productos (canje por puntos)</h1>
            <div class="d-flex ga-2">
                <v-btn size="small" variant="text" prepend-icon="mdi-refresh" @click="resetDemo">Restaurar demo</v-btn>
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">Volver</v-btn>
            </div>
        </div>

        <v-card rounded="xl" elevation="8">
            <v-card-title class="d-flex align-center justify-space-between">
                Productos
                <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="openDialog()">Nuevo</v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="items" :loading="loading" item-key="id" :items-per-page="5">
                <template #item.points_value="{ item }">{{ item.points_value.toLocaleString() }}</template>
                <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
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

        <v-dialog v-model="dialog" max-width="560">
            <v-card rounded="xl">
                <v-card-title>{{ editing?.id ? 'Editar' : 'Nuevo' }} producto</v-card-title>
                <v-card-text>
                    <v-text-field v-model="editing.name" label="Nombre" variant="outlined" />
                    <v-textarea v-model="editing.description" label="Descripción" variant="outlined" auto-grow />
                    <v-text-field v-model.number="editing.points_value" label="Valor en puntos" variant="outlined"
                        type="number" min="0" />
                    <v-text-field v-model="editing.created_at" label="Creación" variant="outlined"
                        type="datetime-local" />
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
import { ReferralProductsService, type ReferralProduct } from '@/services/referralProducts.service'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'name' },
    { title: 'Descripción', key: 'description' },
    { title: 'Valor en puntos', key: 'points_value', width: 150 },
    { title: 'Creación', key: 'created_at', width: 180 },
    { title: '', key: 'actions', width: 80, align: 'end' },
]

const items = ref<ReferralProduct[]>([])
const loading = ref(false)

onMounted(loadItems)

async function loadItems() {
    loading.value = true
    try {
        items.value = await ReferralProductsService.list()
        if (!items.value.length) {
            await seedFallback()
            items.value = await ReferralProductsService.list()
        }
    } finally {
        loading.value = false
    }
}

async function seedFallback() {
    const nowISO = () => new Date().toISOString()
    const defaults: Array<Partial<ReferralProduct>> = [
        { name: 'Tarjeta Regalo $200', description: 'Gift card de $200 MXN', points_value: 2000, created_at: nowISO() },
        { name: 'Playera Oficial', description: 'Merch oficial', points_value: 800, created_at: nowISO() },
        { name: 'Válvula Premium', description: 'Refacción premium', points_value: 1200, created_at: nowISO() },
    ]
    for (const p of defaults) {
        await ReferralProductsService.upsert(p as any)
    }
}

async function resetDemo() {
    try {
        localStorage.removeItem('demo_referral_products_v1')
    } catch { }
    await loadItems()
}

const dialog = ref(false)
const editing = reactive<Partial<ReferralProduct>>({})
function openDialog(item?: ReferralProduct) {
    dialog.value = true
    Object.assign(editing, item ?? { name: '', description: '', points_value: 0, created_at: new Date().toISOString().slice(0, 16), id: undefined })
}
async function save() {
    items.value = await ReferralProductsService.upsert({ ...editing } as any)
    dialog.value = false
    snackbar.value = { open: true, msg: 'Producto guardado.' }
}
function formatDate(iso: string) { const d = new Date(iso); return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d) }

const snackbar = ref({ open: false, msg: '' })
</script>
