<!-- src/components/DataIteratorCards.vue -->
<template>
    <div class="pa-4">
        <!-- Toolbar -->
        <div class="d-flex justify-end align-center flex-wrap gap-3 mb-3">
            <v-text-field v-model="searchLocal" placeholder="Buscador" variant="outlined" hide-details
                density="comfortable" class="max-w-300" @update:model-value="onSearch" />
            <v-btn v-if="toAdd" color="primary" prepend-icon="mdi-plus" :to="{ name: toAdd }">
                Agregar
            </v-btn>
        </div>

        <v-card rounded="xl" elevation="4">
            <v-card-title class="py-3 px-4 d-flex align-center justify-space-between">
                <span class="font-weight-black">{{ title }}</span>
            </v-card-title>
            <v-divider />

            <v-data-iterator :items="list" :page="page" :items-per-page="rows" :loading="loading">
                <!-- loading -->
                <template v-slot:loader>
                    <div class="pa-6">
                        <v-skeleton-loader type="article@3" />
                    </div>
                </template>

                <!-- no data -->
                <template #no-data>
                    <div class="pa-8 text-center">
                        <v-icon size="48" class="mb-3">mdi-database-off</v-icon>
                        <div class="text-h6 mb-1">Sin registros</div>
                        <div class="text-medium-emphasis mb-4">No hay datos para mostrar.</div>
                        <v-btn color="primary" @click="reload">Recargar</v-btn>
                    </div>
                </template>

                <!-- default render: usa headers para empatar campos -->
                <template #default="{ items }">
                    <v-container fluid class="py-4">
                        <v-row>
                            <template v-for="({ raw }, i) in items" :key="raw[itemKey] ?? i">
                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <slot name="item" :item="raw">
                                        <v-card rounded="lg" class="h-100 d-flex flex-column" variant="tonal">
                                            <v-card-title class="text-title-1">
                                                <v-row justify="space-between">
                                                    <v-col>
                                                        <span v-html="getHeader(raw)" />
                                                    </v-col>
                                                </v-row>

                                                <v-divider></v-divider>
                                            </v-card-title>

                                            <v-card-text class="text-body-2 text-medium-emphasis">
                                                <v-row dense>
                                                    <v-col
                                                        v-for="(head, index) in headers.filter(h => h.position === 'title' && !h.hidden)"
                                                        :key="index" cols="6" sm="6" class="d-flex flex-column">

                                                        <v-chip label class="m-1">
                                                            {{ head.title }}
                                                        </v-chip>
                                                        <span class="text-subtitle-2 m-1">
                                                            {{ raw[head.key] }}
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                                <v-divider></v-divider>
                                                <v-row dense>
                                                    <v-col
                                                        v-for="(head, index) in headers.filter(h => h.position === 'body' && !h.hidden)"
                                                        :key="index" class="d-flex flex-column">

                                                        <v-chip label class="m-1">
                                                            {{ head.title }}
                                                        </v-chip>
                                                        <span class="text-subtitle-2 m-1 text-center">
                                                            <template v-if="head.type == 'distance'">
                                                                {{ formatKm(raw[head.key]) }}
                                                            </template>
                                                            <template v-else-if="head.type == 'time'">
                                                                <div
                                                                    class="d-inline-flex align-center ga-2 text-caption">
                                                                    <v-icon icon="mdi-clock" />
                                                                    <span class="text-truncate">
                                                                        {{ formatMinutes(raw[head.key]) }}
                                                                    </span>
                                                                </div>

                                                            </template>
                                                            <template v-else-if="head.type == 'amount'">
                                                                {{ formatAmount(raw[head.key]) }}
                                                            </template>
                                                            <template v-else>
                                                                {{ raw[head.key] }}
                                                            </template>
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                                <v-divider></v-divider>

                                                <v-list-item
                                                    append-icon="mdi-chevron-right"
                                                    lines="two"
                                                    subtitle="Detalles y Metricas"
                                                    link
                                                    :to="{
                                                        name: toView, params: { id: raw[itemKey] }
                                                    }"
                                                ></v-list-item>
                                            </v-card-text>

                                            <v-spacer />
                                            

                                            <!-- <v-card-actions class="justify-end"> -->
                                                
                                                <!-- <v-btn v-if="toView"
                                                    :to="{ name: toView, params: { id: raw[itemKey] } }" variant="flat"
                                                    color="#0D47A1">
                                                    Ver Detalle
                                                </v-btn>
                                                <v-btn v-if="toEdit"
                                                    :to="{ name: toEdit, params: { id: raw[itemKey] } }"
                                                    icon="mdi-pencil-outline" variant="text" />
                                                <v-btn v-if="urlDelete" icon="mdi-trash-can-outline" variant="text"
                                                    color="error" @click="openDeleted(raw)" /> -->
                                            <!-- </v-card-actions> -->
                                        </v-card>
                                    </slot>
                                </v-col>
                            </template>
                        </v-row>
                    </v-container>
                </template>

                <!-- footer -->
                <template #footer>
                    <div class="px-4 pb-4 d-flex align-center justify-space-between flex-wrap gap-3">
                        <div class="d-flex align-center gap-2">
                            <span class="text-body-2">Filas:</span>
                            <v-select :items="rowsOptions" v-model="rows" density="compact" variant="outlined"
                                style="max-width: 96px" hide-details @update:model-value="setRows" />
                        </div>
                        <v-pagination :model-value="page" :length="pageCount" :total-visible="7"
                            @update:model-value="onPage" />
                    </div>
                </template>
            </v-data-iterator>
        </v-card>

        <!-- Diálogo Eliminar -->
        <v-dialog v-model="dialog.open" max-width="520">
            <v-card rounded="lg" elevation="8">
                <v-card-title class="d-flex align-center ga-3 py-2">
                    <v-icon color="red" size="34">mdi-alert-circle</v-icon>
                    <div class="text-h6 font-weight-bold">Eliminar registro</div>
                </v-card-title>
                <v-divider />
                <v-card-text class="py-5">
                    <div class="text-body-1">¿Confirmas eliminar el registro seleccionado?</div>
                </v-card-text>
                <v-divider />
                <v-card-actions class="justify-end ga-2 py-1">
                    <v-btn variant="text" @click="dialog.open = false" prepend-icon="mdi-close-circle-outline">
                        Cancelar
                    </v-btn>
                    <v-btn color="error" variant="flat" prepend-icon="mdi-trash-can-outline" @click="deleted">
                        Continuar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { debounce } from 'lodash-es'
import { useDuration } from '@/composables/useDuration'
import { useDistance } from '@/composables/useDistance'
import { useCurrency } from '@/composables/useCurrency'

type Primitive = string | number | boolean | null | undefined
type Row = Record<string, any> // permite anidados

type Header = {
    key: string                 // ruta: 'name' | 'user.name' | 'meta.creation'
    position?: string
    type?: string
    title: string               // etiqueta visible
    hidden?: boolean            // para no renderizar en la card
    chip?: boolean              // mostrar como chip
    class?: string              // clases extra en la línea
    formatter?: (val: any, item: Row) => string // función de formateo
}

const props = defineProps<{
    url: string
    urlDelete?: string
    title?: string
    toAdd?: string
    toView?: string
    toEdit?: string
    itemKey?: string
    titleField?: string
    orderDesc?: boolean
    headers?: Header[]          // NUEVO: describe qué campos mostrar
}>()

const {
    urlDelete = '',
    title = 'Listado',
    toAdd = '',
    toView = '',
    toEdit = '',
    itemKey = 'id',
    titleField,
} = props

const store = useStore()
const { formatMinutes } = useDuration('hh:mm')
const { format: formatKm } = useDistance({ forceUnit: 'km', decimals: 2 })
const { format: formatAmount } = useCurrency({
    locale: 'es-MX',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    trimTrailingZeros: false,
})

const loading = ref<boolean>(true)
const dialog = ref<{ open: boolean; item: Row | null }>({ open: false, item: null })
const searchLocal = ref<string>('')

const datatable = computed(() => store.getters['ui/datatable'] ?? { list: [], meta: { total_items: 0, page: 1, rows: 12 } })
const list = computed<Row[]>(() => (datatable.value.list ?? []) as Row[])
const total = computed<number>(() => Number(datatable.value?.meta?.total_items ?? 0))
const page = computed<number>({
    get: () => Number(datatable.value?.meta?.page ?? 1),
    set: (val: number) => store.commit('ui/SET_DATATABLE_PAGE', Number(val)),
})
const rows = computed<number>({
    get: () => Number(datatable.value?.meta?.rows ?? 12),
    set: (val: number) => store.commit('ui/SET_DATATABLE_ROWS', Number(val)),
})
const rowsOptions = [8, 12, 24, 48]

const pageCount = computed<number>(() => {
    const r = rows.value || 1
    return Math.max(1, Math.ceil((total.value || 0) / r))
})

/** --------- Empatar headers -> qué se muestra en la card ---------- */
const normalizedHeaders = computed<Header[]>(() => {
    // Si no pasan headers: sugerimos unos básicos por compatibilidad
    if (!props.headers || props.headers.length === 0) {
        return [
            { key: titleField || 'title', title: 'Título' },
            { key: 'description', title: 'Descripción' },
            { key: 'creation', title: 'Creado', formatter: (v) => formatDate(v) },
            { key: 'status', title: 'Estado', chip: true },
        ]
    }
    return props.headers
})

const statusHeader = computed<Header | null>(() => {
    // busca un header que parezca 'status'
    const h = normalizedHeaders.value.find(h => h.key === 'status' || /status$/i.test(h.key))
    return h ?? null
})

const visibleContentHeaders = computed<Header[]>(() =>
    normalizedHeaders.value.filter(h => !h.hidden && h.key !== (titleField || 'title') && h.key !== 'status')
)

/** Utilidad: leer ruta anidada (e.g. 'user.name') */
function getByPath(obj: any, path: string): any {
    if (!obj || !path) return undefined
    return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

function getDisplayValue(item: Row, h: Header): string {
    // let val = getByPath(item, h.key)
    // if (h.formatter) return h.formatter(val, item)
    // if (val == null) return ''
    // if (val instanceof Date) return formatDate(val)
    // return String(val)


    return ''
}

/** ---------- Datatable params & fetch ---------- */
function getParams() {
    return store.getters['ui/datatableParams']
}

async function fetchData() {
    loading.value = true
    try {

        console.log(props)

        let params = getParams()
        if(props.orderDesc) {
            params.order_asc = false
        }
        
        console.log(params)
        await store.dispatch('ui/datatable', { url: props.url, params })
    } finally {
        loading.value = false
    }
}

async function onPage(val: number) {
    page.value = val
    await fetchData()
}

async function setRows(val: number) {
    rows.value = val
    page.value = 1
    await fetchData()
}

const onSearch = debounce(async (val: string) => {
    store.commit('ui/SET_DATATABLE_SEARCH', val ?? '')
    page.value = 1
    await fetchData()
}, 500)

async function reload() {
    await fetchData()
}

function openDeleted(item: Row) {
    dialog.value.open = true
    dialog.value.item = item
}

async function deleted() {
    if (!urlDelete || !dialog.value.item) {
        dialog.value.open = false
        dialog.value.item = null
        return
    }
    const idVal = dialog.value.item[itemKey] as string | number | undefined
    if (idVal == null) return
    const url = urlDelete.replace('{id}', String(idVal))
    loading.value = true
    try {
        await store.dispatch('ui/datatableDelete', { url })
    } finally {
        dialog.value.open = false
        dialog.value.item = null
        await fetchData()
    }
}

function formatDate(iso: string | number | Date | undefined) {
    if (!iso) return ''
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d)
}

function getHeader(raw: Row) {

    let value = ''

    for (let item of props.headers) {

        if (item?.position === 'header') {
            value += `${item.title} #${raw[item.key]} `
        }
    }

    return value
}

function getTitle(raw: Row) {

    let value = ''

    for (let item of props.headers) {

        if (item?.position === 'title') {
            value += `<p class="font-weight-medium">${item.title}: ${raw[item.key]}</p>`
        }
    }

    return value
}

onBeforeMount(() => {
    store.commit('ui/SET_DATATABLE_PARAMS_RESET')
    fetchData()
})

// Exponer utilidades al padre si las necesitas
defineExpose({ reload, fetchData })
</script>

<style scoped>
.max-w-300 {
    max-width: 300px;
}

.truncate-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.truncate-3-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
