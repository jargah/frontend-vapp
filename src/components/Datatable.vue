<template>
    <v-card>
        <!-- Toolbar con título, buscador y botón Agregar -->
        <v-toolbar flat>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
            <v-text-field v-model="q" :placeholder="searchPlaceholder" clearable density="comfortable" hide-details
                prepend-inner-icon="mdi-magnify" style="max-width: 280px" />
            <v-btn color="primary" class="ms-3" prepend-icon="mdi-plus" @click="$emit('add')">
                Agregar
            </v-btn>
        </v-toolbar>

        <v-divider />

        <!-- DataTable -->
        <v-data-table 
            :loading="loading" 
            :headers="computedHeaders" 
            :items="filteredItems"
            :items-per-page="itemsPerPageLocal" 
            v-model:page="page" 
            v-model:expanded="expandedLocal"
            :item-key="itemKey"
            class="elevation-1">
            <!-- Estado como chip -->
            <template #item.status="{ value }">
                <v-chip :color="value ? 'success' : 'warning'" size="small" variant="tonal">
                    {{ value ? 'Activo' : 'Inactivo' }}
                </v-chip>
            </template>

            <!-- Acciones -->
            <template #item.actions="{ item }">
                <v-btn icon variant="text" @click="onView(item)">
                    <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon variant="text" @click="onEdit(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="error" @click="onDelete(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

            <!-- Fila expandida (detalle) -->
            <!-- <template #expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        <slot name="expanded" :item="item">
                            <v-card variant="tonal" class="ma-2">
                                <v-card-text class="text-body-2">
                                    <div class="d-flex flex-wrap ga-6">
                                        <div><strong>ID:</strong> {{ item.id }}</div>
                                        <div><strong>Email:</strong> {{ item.email }}</div>
                                        <div><strong>Rol:</strong> {{ item.role }}</div>
                                        <div><strong>Creado:</strong> {{ item.createdAt }}</div>
                                        <div class="w-100 mt-2">
                                            <strong>Notas:</strong>
                                            <div>{{ item.notes || '—' }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </slot>
                    </td>
                </tr>
            </template> -->
        </v-data-table>
    </v-card>

    <!-- Diálogo Ver -->
    <v-dialog v-model="viewDialog" max-width="520">
        <v-card>
            <v-card-title class="text-h6">Detalle</v-card-title>
            <v-card-text>
                <slot name="view" :item="selectedItem">
                    <div class="mb-2"><strong>Nombre:</strong> {{ selectedItem?.name }}</div>
                    <div class="mb-2"><strong>Email:</strong> {{ selectedItem?.email }}</div>
                    <div class="mb-2"><strong>Rol:</strong> {{ selectedItem?.role }}</div>
                    <div class="mb-2"><strong>Estado:</strong> {{ selectedItem?.status ? 'Activo' : 'Inactivo' }}</div>
                    <div class="mb-2"><strong>Creado:</strong> {{ selectedItem?.createdAt }}</div>
                    <div class="mb-2"><strong>Notas:</strong> {{ selectedItem?.notes || '—' }}</div>
                </slot>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="viewDialog = false">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Confirmación Eliminar -->
    <v-dialog v-model="confirmDelete" persistent max-width="420">
        <v-card>
            <v-card-title class="text-h6">Eliminar registro</v-card-title>
            <v-card-text>
                ¿Seguro que deseas eliminar <strong>{{ selectedItem?.name }}</strong>?
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="confirmDelete = false">Cancelar</v-btn>
                <v-btn color="error" @click="doDelete">Eliminar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Row } from '@/types/datatable'
import { computed, ref } from 'vue'

type Header = { title: string; key: keyof Row | 'actions'; width?: number; sortable?: boolean }

/** Props */
const props = withDefaults(defineProps<{
    title?: string
    items: Row[]
    loading?: boolean
    headers?: Header[]
    itemKey?: keyof Row | string
    searchPlaceholder?: string
    itemsPerPage?: number
}>(), {
    title: 'Usuarios',
    loading: false,
    itemKey: 'id',
    searchPlaceholder: 'Buscar…',
    itemsPerPage: 5,
})

/** Emits */
const emit = defineEmits<{
    (e: 'add'): void
    (e: 'view', item: Row): void
    (e: 'edit', item: Row): void
    (e: 'delete', item: Row): void
    (e: 'deleted', id: number): void
}>()

/** Encabezados por defecto (si no pasan headers) */
const defaultHeaders: Header[] = [
    { title: 'ID', key: 'id', width: 10 },
    { title: 'Nombre', key: 'name', width: 150 },
    { title: 'Email', key: 'email', width: 150 },
    { title: 'Rol', key: 'role', width: 120 },
    { title: 'Estado', key: 'status', width: 120 },
    { title: 'Acciones', key: 'actions', sortable: false, width: 140 },
]
const computedHeaders = computed(() => props.headers?.length ? props.headers : defaultHeaders)

/** Estado local */
const q = ref('')
const page = ref(1)
const itemsPerPageLocal = ref(props.itemsPerPage)
const expandedLocal = ref<(string | number)[]>([])
const viewDialog = ref(false)
const confirmDelete = ref(false)
const selectedItem = ref<Row | null>(null)

/** Filtro global */
const filteredItems = computed(() => {
    const term = q.value.trim().toLowerCase()
    if (!term) return props.items
    return props.items.filter(r => {
        const haystack = `${r.id} ${r.name} ${r.email} ${r.role} ${r.notes ?? ''} ${r.createdAt}`.toLowerCase()
        return haystack.includes(term)
    })
})

/** Acciones */
function onView(item: Row) {
    selectedItem.value = item
    viewDialog.value = true
    emit('view', item)
}
function onEdit(item: Row) {
    emit('edit', item)
}
function onDelete(item: Row) {
    selectedItem.value = item
    confirmDelete.value = true
    emit('delete', item)
}
function doDelete() {
    if (!selectedItem.value) return
    const id = selectedItem.value.id
    confirmDelete.value = false
    emit('deleted', id)
    selectedItem.value = null
}
</script>
