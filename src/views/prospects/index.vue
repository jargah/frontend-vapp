<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <h1 class="text-h5 mb-0">Prospectos</h1>
        </div>

        <v-card rounded="xl" elevation="8">
            <!-- <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-3">
                <div class="text-subtitle-1">Listado</div>
                <v-text-field 
                    v-model="search" 
                    density="comfortable" 
                    variant="outlined" 
                    placeholder="Buscar…"
                    prepend-inner-icon="mdi-magnify" clearable hide-details style="min-width:260px"
                    @change="filtered"
                    />
            </v-card-title> -->

            <v-data-table 
                :headers="headers" 
                :items="prospectData?.list ?? []" 
                :items-per-page="itemsPerPage" 
                :page="page"
                @update:page="page = $event" 
                @update:items-per-page="itemsPerPage = $event"
                :items-per-page-options="[5, 10, 20, 50]" 
                item-key="id" 
                hover class="text-body-2"
            >
                <template #item.status="{ item }">
                    <v-chip 
                        size="small" 
                        :color="item.status === 'ACTIVE' ? 'success' : 'warning'">
                        {{ item.status }}
                    </v-chip>
                </template>
                <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>

                <template #item.actions="{ item }">
                    <div class="d-flex ga-1">
                        <v-btn :to="{ name: 'prospects-view', params: { id: item.id } }" icon="mdi-eye-outline"
                            variant="text" />
                        <!-- <v-btn :to="{ name: 'prospects-edit', params: { id: item.id } }" icon="mdi-pencil-outline"
                            variant="text" />
                        <v-btn icon="mdi-trash-can-outline" variant="text" color="error" @click="openDelete(item)" /> -->
                    </div>
                </template>

                <template #no-data>
                    <v-sheet class="pa-8 text-center w-100">
                        <v-icon size="36" class="mb-2">mdi-database-off</v-icon>
                        <div class="text-body-1">Sin registros</div>
                    </v-sheet>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="deleteDialog" max-width="420">
            <v-card rounded="xl">
                <v-card-item>
                    <div class="d-flex align-center ga-3">
                        <v-avatar color="error" size="44"><v-icon size="28">mdi-alert-outline</v-icon></v-avatar>
                        <div>
                            <div class="text-h6">Confirmar eliminación</div>
                            <div class="text-medium-emphasis">Esta acción no se puede deshacer.</div>
                        </div>
                    </div>
                </v-card-item>
                <v-divider />
                <v-card-text>¿Eliminar operador <strong>#{{ pendingItem?.id }}</strong> (<em>{{ pendingItem?.name
                        }}</em>)?</v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="error" @click="confirmDelete" prepend-icon="mdi-trash-can-outline">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.open" :timeout="2500" color="success">{{ snackbar.msg }}</v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'


const store = useStore()

import { OperatorsService, type Operator } from '@/services/operators.service'

const datatable = ref({
    datatable: true,
    page: 1,
    rows: 10,
    search: '',
    order_by: 'id',
    order_asc: true
})

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'first_name' },
    { title: 'Apellido Paterno', key: 'last_name' },
    { title: 'Apellido Materno', key: 'second_surname' },
    { title: 'Correo', key: 'email' },
    { title: 'Teléfono', key: 'phone', width: 150 },
    { title: 'Status', key: 'status', width: 120 },
    { title: 'Creación', key: 'creation', width: 180 },
    { title: 'Acciones', key: 'actions', width: 140, align: 'end' },
]

const items = ref<Operator[]>([])
const search = ref('')
const page = ref(1)
const itemsPerPage = ref(10)


const listProspects = async () => {
    console.log(store)
    await store.dispatch(
        'prospects/list',
        datatable.value
    )
}

const prospectData = computed(() => store.getters['prospects/table'])

onMounted(async () => { 
    //items.value = await OperatorsService.list() 
    await listProspects()
})

const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return items.value
    return items.value.filter(i =>
        [i.id, i.name, i.email, i.phone, i.status, formatDate(i.created_at)]
            .join(' ').toLowerCase().includes(q)
    )
})

function formatDate(iso: string) {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d)
}

/* Eliminar */
const deleteDialog = ref(false)
const pendingItem = ref<Operator | null>(null)
function openDelete(item: Operator) { pendingItem.value = item; deleteDialog.value = true }
function closeDelete() { deleteDialog.value = false; pendingItem.value = null }
async function confirmDelete() {
    if (!pendingItem.value) return
    await OperatorsService.remove(pendingItem.value.id)
    items.value = await OperatorsService.list()
    closeDelete()
    snackbar.value = { open: true, msg: 'Operador eliminado.' }
}

/* Snackbar */
const snackbar = ref({ open: false, msg: '' })
</script>
