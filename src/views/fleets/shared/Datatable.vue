<!-- src/components/DataTableCrud.vue -->
<template>
    <v-card rounded="xl" elevation="8">
        <!-- Toolbar: título, slot extra y buscador -->
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-3">
            <div class="text-h6">Listado</div>
            <div class="d-flex align-center ga-3 ms-auto">
                <slot name="toolbar" />
                <v-text-field v-model="search" density="comfortable" variant="outlined" placeholder="Buscar…"
                    prepend-inner-icon="mdi-magnify" clearable hide-details style="min-width: 260px" />
            </div>
        </v-card-title>

        <v-data-table :headers="internalHeaders" :items="itemsWithKeys" item-key="__rowKey" class="text-body-2" hover
            :search="search" :items-per-page="itemsPerPage" :page="page" @update:page="page = $event"
            @update:items-per-page="itemsPerPage = $event" :items-per-page-options="itemsPerPageOptions">
            <!-- Acciones -->
            <template #item.actions="{ item }">
                <div class="d-flex ga-2">
                    <v-btn 
                        :to="buildRoute(viewRouteName, item)" 
                        icon="mdi-eye-outline" 
                        variant="text"
                        :title="`Ver #${getId(item)}`" 
                    />
                    <v-btn 
                        :to="buildRoute(editRouteName, item)" 
                        icon="mdi-pencil-outline" 
                        variant="text"
                        :title="`Editar #${getId(item)}`" 
                    />
                    
                    <v-btn 
                        icon="mdi-trash-can-outline" 
                        variant="text" 
                        color="error" 
                        :title="`Eliminar #${getId(item)}`"
                        @click="openDelete(item)" 
                    />
                </div>
            </template>

            <!-- Sin datos -->
            <template #no-data>
                <v-sheet class="pa-8 text-center w-100">
                    <v-icon size="36" class="mb-2">mdi-database-off</v-icon>
                    <div class="text-body-1">Sin registros</div>
                </v-sheet>
            </template>
        </v-data-table>
    </v-card>

    <!-- Confirmación eliminar -->
    <v-dialog v-model="deleteDialog" max-width="420" transition="dialog-bottom-transition">
        <v-card rounded="xl">
            <v-card-item>
                <div class="d-flex align-center ga-3">
                    <v-avatar color="error" size="44">
                        <v-icon size="28">mdi-alert-outline</v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-h6">Confirmar eliminación</div>
                        <div class="text-medium-emphasis">Esta acción no se puede deshacer.</div>
                    </div>
                </div>
            </v-card-item>

            <v-divider />

            <v-card-text>
                <div class="text-body-2">
                    ¿Deseas eliminar el registro <strong>#{{ getId(pendingItem) }}</strong>?
                </div>
                <div v-if="pendingItem" class="mt-3 text-medium-emphasis">
                    <div v-for="(v, k) in previewFields" :key="k">
                        <strong>{{ k }}:</strong> {{ String(pendingItem[v] ?? '') }}
                    </div>
                </div>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="error" @click="confirmDelete" prepend-icon="mdi-trash-can-outline">
                    Eliminar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Header = { title: string; key: string; sortable?: boolean; align?: 'start' | 'end' | 'center'; width?: string | number }

const props = defineProps<{
    items: Record<string, any>[]
    headers?: Header[]
    viewRouteName: string
    editRouteName: string
    itemIdKey?: string
    previewFieldsMap?: Record<string, string>
    /** Tamaño de página inicial */
    defaultItemsPerPage?: number
    /** Opciones de tamaño de página */
    itemsPerPageOptions?: number[]
}>()

const emit = defineEmits<{
    (e: 'delete', item: Record<string, any>): void
}>()

/* Buscador */
const search = ref('')

/* Paginación */
const page = ref(1)
const itemsPerPage = ref(props.defaultItemsPerPage ?? 10)
const itemsPerPageOptions = computed(() => props.itemsPerPageOptions ?? [5, 10, 20, 50, 100])

/* ID y headers */
const itemIdKey = computed(() => props.itemIdKey ?? 'id')

const baseHeaders: Header[] = [
    { title: 'ID', key: itemIdKey.value, width: 90 },
    { title: 'Nombre', key: 'name' },
    { title: 'Estado', key: 'status', width: 140 },
]

const internalHeaders = computed<Header[]>(() => [
    ...(props.headers?.length ? props.headers : baseHeaders),
    { title: 'Acciones', key: 'actions', align: 'end', width: 140 },
])

/* Items con clave interna para la tabla */
function getId(item: Record<string, any> | null) { return item ? item[itemIdKey.value] : '' }
const itemsWithKeys = computed(() =>
    props.items?.map((it, idx) => ({ __rowKey: `${getId(it) ?? idx}`, ...it })) ?? []
)

/* Rutas y modal eliminar */
function buildRoute(name: string, item: Record<string, any>) { 
    return { 
        name,
        params: { 
            id: getId(item) 
        } 
    }
}

const deleteDialog = ref(false)
const pendingItem = ref<Record<string, any> | null>(null)
function openDelete(item: Record<string, any>) { pendingItem.value = item; deleteDialog.value = true }
function closeDelete() { deleteDialog.value = false; pendingItem.value = null }
function confirmDelete() { if (pendingItem.value) emit('delete', pendingItem.value); closeDelete() }

/* Campos a previsualizar en el modal */
const previewFields = computed(() => props.previewFieldsMap ?? { 'Nombre': 'name', 'Estado': 'status' })

defineExpose({ itemsWithKeys })
</script>
