<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <h1 class="text-h5 mb-0">Facturación</h1>
        </div>

        <v-card rounded="xl" elevation="8">
            <v-data-table :headers="headers" :items="prospectData?.list ?? []" :items-per-page="itemsPerPage"
                :page="page" @update:page="page = $event" @update:items-per-page="itemsPerPage = $event"
                :items-per-page-options="[5, 10, 20, 50]" item-key="id" hover class="text-body-2">
                <!-- Usa item.raw.* (Vuetify 3) para acceder a la fila original con tipos -->
                <template #item.status="{ item }">
                    <v-chip size="small" :color="item.status === 'ACTIVE' ? 'success' : 'warning'">
                        {{ item.status }}
                    </v-chip>
                </template>

                <!-- OJO: el header usa key 'creation', no 'created_at' -->
                <template #item.creation="{ item }">
                    {{ formatDate(item.creation) }}
                </template>

                <template #item.actions="{ item }">
                    <div class="d-flex ga-1">
                        <v-btn :to="{ name: 'prospects-view', params: { id: item.id } }" icon="mdi-eye-outline"
                            variant="text" />
                        <!--
            <v-btn :to="{ name: 'prospects-edit', params: { id: item.raw.id } }" icon="mdi-pencil-outline" variant="text" />
            <v-btn icon="mdi-trash-can-outline" variant="text" color="error" @click="openDelete(item.raw)" />
            -->
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
                <v-card-text>
                    ¿Eliminar operador <strong>#{{ pendingItem?.id }}</strong> (<em>{{ pendingItem?.name }}</em>)?
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="error" @click="confirmDelete" prepend-icon="mdi-trash-can-outline">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.open" :timeout="2500" color="success">
            {{ snackbar.msg }}
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { OperatorsService, type Operator } from '@/services/operators.service'

const store = useStore()

type Prospect = {
    id: number | string
    first_name: string
    last_name: string
    second_surname?: string | null
    email: string
    phone?: string | null
    status: 'ACTIVE' | 'INACTIVE' | string
    creation: string // ISO string
}

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
] as const

const datatable = ref({
    datatable: true,
    page: 1,
    rows: 10,
    search: '',
    order_by: 'id',
    order_asc: true,
})

const page = ref(1)
const itemsPerPage = ref(10)

const listProspects = async () => {
    await store.dispatch('prospects/list', datatable.value)
}

const prospectData = computed<{ list: Prospect[] } | null>(() => {
    const res = store.getters['prospects/table']
    return res ? (res as { list: Prospect[] }) : null
})

onMounted(async () => {
    await listProspects()
})

function formatDate(iso: string) {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d)
}

const deleteDialog = ref(false)
const pendingItem = ref<Operator | null>(null)

function closeDelete() {
    deleteDialog.value = false
    pendingItem.value = null
}
async function confirmDelete() {
    if (!pendingItem.value) return
    await OperatorsService.remove(pendingItem.value.id)
    await listProspects()
    closeDelete()
    snackbar.value = { open: true, msg: 'Operador eliminado.' }
}

const snackbar = ref({ open: false, msg: '' })
</script>
