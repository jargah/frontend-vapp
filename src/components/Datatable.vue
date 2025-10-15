<template>
    <div>
        <div class="d-flex justify-content-end gap-3 m-3">
            <v-btn 
                color="primary" 
                prepend-icon="mdi-plus" 
                :to="{ name: toAdd }" 
                v-if="toAdd !== ''">
                Agregar
            </v-btn>
        </div>

        <v-card rounded="md" elevation="1">


            <template v-slot:title>
                <v-row class="d-flex justify-content-between">
                    <v-col cols="6" class="m-2">
                        <span class="font-weight-black">
                            {{ title }}
                        </span>
                    </v-col>
                    <v-col cols="4" class="d-flex align-items-center">
                        <v-text-field  
                            density="compact"
                            placeholder="Buscador" 
                            variant="outlined"
                            autocomplete="off"
                            @update:model-value="setSearch" 
                        />
                    </v-col>
                </v-row>
                <v-row class="d-flex justify-content-between" v-if="excel">
                    <v-col cols="12" md="7" class="m-2 d-flex justify-content-around">
                       <v-date-input
                            key="from"
                            density="compact"
                            label="Desde"
                            clearable
                            autocorrect="off"
                            hide-details="auto"
                            v-model="date_from"
                            :rules="toRules"
                            :max="date_to"
                        />
                        <div class="m-2" />
                        <v-date-input
                            key="to"
                            density="compact" 
                            label="Hasta"
                            clearable
                            autocorrect="off"
                            hide-details="auto"
                            v-model="date_to"
                            :rules="fromRules"
                            :min="date_from"
                        />
                    </v-col>
                    <v-col cols="12" md="4" class="m-2 text-end">
                        <v-btn
                            v-if="date_from && date_to"
                            class="text-none text-subtitle-1 mr-2"
                            color="#5865f2"
                            size="small"
                            variant="flat"
                            @click="exportExcel"
                        >
                            Exportar Excel
                        </v-btn>
                        
                        <v-btn
                            class="text-none text-subtitle-1 ml-2"
                            color="blue"
                            size="small"
                            variant="flat"
                            @click="relaunch"
                        >
                            Buscar
                        </v-btn>
                    </v-col>
                    
                </v-row>
                <v-divider></v-divider>
            </template>

            <v-data-table-server 
                fixed-header
                fixed-footer
                :headers="headers" 
                :items="datatable.list ?? []" 
                :items-length="total"
                :page="page"
                v-model:items-per-page="rows" 
                item-value="id"
                @update:options="loadData"
                @update:items-per-page="setRows"
                :loading="loading"
            >

                <template
                    v-for="col in headers"
                    :key="col.key"
                    v-slot:[`header.${col.key}`]="{ column, toggleSort, getSortIcon, isSorted }"
                >

                    <div class="flex items-center gap-1 text-center">
                        <span class="text-body-1">
                            {{ column.title }}
                        </span>
                    </div>
                </template>

                <template
                    v-for="col in headers"
                    :key="col.key"
                    v-slot:[`item.${col.key}`]="{ item, value, column }"
                    >
                    <div class="flex items-center gap-1 text-center">   <!-- <- centro horizontal -->
                        <span 
                            v-if="column.key !== 'actions'" 
                            class="inline-block max-w-[220px] truncate" 
                            :title="String(value)"
                        >
                            <template v-if="(col as ExtraHeader)?.dataType == 'docs'">
                                <template v-if="value == 0">
                                    <v-chip color="red">NO</v-chip>
                                </template>
                                <template v-else>
                                    <v-chip color="blue">SÍ</v-chip>
                                </template>
                            </template>
                            <template v-else-if="(col as ExtraHeader)?.dataType == 'assign'">
                                <template v-if="value == 'pendiente'">
                                    <v-chip color="green">{{ value }}</v-chip>
                                </template>
                                
                            </template>
                            <template v-else>
                                {{ value }}
                            </template>
                        </span>

                        <div v-else class="flex justify-center gap-1">
                            <div class="text-center">
                                <v-btn 
                                    v-if="toView !== ''"
                                    :to="{ 
                                        name: toView, 
                                        params: { 
                                            id: (item as any).id 
                                        } 
                                    }" 
                                    icon="mdi-eye-outline"
                                    variant="text" 
                                />
                                <v-btn 
                                    v-if="toEdit !== ''"
                                    :to="{ 
                                        name: toEdit, 
                                        params: { 
                                            id: (item as any).id 
                                        } 
                                    }" 
                                    icon="mdi-pencil-outline" 
                                    variant="text" 
                                />
                                <v-btn 
                                    v-if="urlDelete !== ''"
                                    icon="mdi-trash-can-outline" 
                                    variant="text" 
                                    color="error" 
                                    @click="openDeleted(item)" 
                                />
                                
                            </div>
                        </div>
                    </div>
                </template>

                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10" />
                </template>

                <template v-slot:no-data>
                    <div class="pa-8 text-center">
                        <v-icon size="48" class="mb-3">mdi-database-off</v-icon>
                        <div class="text-h6 mb-1">
                            Sin registros
                        </div>
                        <div class="text-medium-emphasis mb-4">
                            No hay datos para mostrar.
                        </div>
                        <div class="d-flex justify-center ga-3">
                            <v-btn color="primary" @click="reload">
                                Recargar
                            </v-btn>
                            
                        </div>
                    </div>
                </template>

            

                <!-- <template #item.status="{ item }">
                    <v-chip 
                        size="small" 
                        :color="'info'">
                        <b>
                            {{ (item as any).status }}
                        </b>
                    </v-chip>
                </template>

                <template #item.actions="{ item }">
                        <div class="text-center">
                            <v-btn 
                                v-if="toView !== ''"
                                :to="{ 
                                    name: toView, 
                                    params: { 
                                        id: (item as any).id 
                                    } 
                                }" 
                                icon="mdi-eye-outline"
                                variant="text" 
                            />
                            <v-btn 
                                v-if="toEdit !== ''"
                                :to="{ 
                                    name: toEdit, 
                                    params: { 
                                        id: (item as any).id 
                                    } 
                                }" 
                                icon="mdi-pencil-outline" 
                                variant="text" 
                            />
                            <v-btn 
                                v-if="urlDelete !== ''"
                                icon="mdi-trash-can-outline" 
                                variant="text" 
                                color="error" 
                                @click="openDeleted(item)" 
                            />
                            
                        </div>
                    </template>

                <template #item.creation="{ item }">
                    {{ formatDate((item as any).creation) }}
                </template> -->
        
            </v-data-table-server>
        </v-card>

        <v-dialog v-model="dialog.open" max-width="520">
            <v-card rounded="lg" elevation="8">
                <v-card-title class="d-flex align-center ga-3 py-2">
                    <v-icon color="red" size="34">mdi-alert-circle</v-icon>
                    <div class="text-h6 font-weight-bold">
                        Eliminar registro
                    </div>
                </v-card-title>

                <v-divider />

                <v-card-text class="py-5">
                    <div class="text-body-1">
                        ¿Confirmas en eliminar el registro seleccionado?
                    </div>
                </v-card-text>

                <v-divider />

                <v-card-actions class="justify-end ga-2 py-1">
                    <v-btn variant="text" @click="dialog.open = false" prepend-icon="mdi-close-circle-outline">
                        Cancelar
                    </v-btn>
                    <v-btn 
                        color="error" 
                        variant="flat" 
                        @click="deleted" 
                        prepend-icon="mdi-trash-can-outline"
                    >
                            Continuar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'
import { computed, ref, watch, onBeforeMount, shallowRef } from 'vue'

import { useStore } from 'vuex'
import { debounce } from 'lodash-es'

type ExtraHeader = DataTableHeader & {
    dataType?: any
}

const props = withDefaults(defineProps<{
    url: string
    excel?: string | null
    urlDelete?: string
    title?: string
    headers: ExtraHeader[]
    toAdd?: string
    toView?: string
    toEdit?: string
}>(), {
    excel: null,
    urlDelete: null,
    headers: () => [] as ExtraHeader[],
    toAdd: '',
    toView: '',
    toEdit: ''
})
const store = useStore()

const loading = ref(true)
const dialog = ref({
    open: false,
    message: '',
    item: null
})
const date_from = ref<string | null>(null)
const date_to = ref<string | null>(null)
const isValid = ref<boolean>(true)

const fromRules = [
    (v: string | null) => {
        if (!v || !date_to.value) return true
        return v >= date_to.value || 'From debe ser mayor o igual que date_to'
    },
]

const toRules = [
    (v: string | null) => {
        if (!v || !date_from.value) return true
        return v <= date_from.value || 'To no debe ser mayor que From'
    },
]

// watch([date_from, date_to], ([newFrom, newTo]) => {
//     if (newFrom && newTo && newTo > newFrom) {
//         date_to.value = newFrom
//     }
// })

const datatable = computed(() =>
    store.getters['ui/datatable'] ?? { list: [], meta: { total_items: 0, page: 1, rows: 10 } }
)

watch(() => datatable.value.list, (_, __) => {
        setTimeout(() => {
            loading.value = false
        }, 1000);
    },
    { immediate: true } 
)


const total = computed(() => Number(datatable.value?.meta?.total_items ?? 0))

const page = computed({
    get: () => Number(datatable.value?.meta?.page ?? 1),
    set: (val: number) => store.commit('ui/SET_DATATABLE_PAGE', Number(val)),
})

const rows = computed({
    get: () => Number(datatable.value?.meta?.rows ?? 10),
    set: (val: number) => store.commit('ui/SET_DATATABLE_ROWS', Number(val)),
})

async function loadData(opts?: { page?: number; itemsPerPage?: number }) {


    if (opts?.page != null) page.value = opts.page

    if (opts?.itemsPerPage != null) {
        rows.value = opts.itemsPerPage
        if (opts.page == null) page.value = 1 // típico reset
    }

    const params = store.getters['ui/datatableParams']
    await store.dispatch('ui/datatable', { url: props.url, params })
}

async function relaunch(opts?: { page?: number; itemsPerPage?: number }) {

    loading.value = true

    store.commit('ui/SET_DATATABLE_PARAMS_RESET')
    const params = store.getters['ui/datatableParams']

    if(date_from.value && date_to.value) {
        params.date_from = date_from.value
        params.date_to = date_to.value
    }

    await store.dispatch('ui/datatable', { url: props.url, params })
    
    loading.value = false
}


const setRows = async (value: number) => {
    store.commit('ui/SET_DATATABLE_ROWS', value)

    const params = store.getters['ui/datatableParams']
    await store.dispatch('ui/datatable', { url: props.url, params })
}

const setSearch = debounce(async (value: any) => {
    store.commit('ui/SET_DATATABLE_SEARCH', value)

    const params = store.getters['ui/datatableParams']
    await store.dispatch('ui/datatable', { url: props.url, params })
}, 500)

const reload = async () => {
    const params = store.getters['ui/datatableParams']
    
    loading.value = true
    await store.dispatch('ui/datatable', { url: props.url, params })

    loading.value = false
}

const exportExcel = async () => {

    let params = {
        date_from: undefined,
        date_to: undefined
    }
    if(date_from.value && date_to.value) {
        params.date_from = date_from.value
        params.date_to = date_to.value
    }


    await store.dispatch('ui/excel', { url: props.excel, query: params })
}

const openDeleted = (value) => {
    dialog.value.open = true
    dialog.value.item = value
}

const deleted = async () => {

    loading.value = true

    const url = props.urlDelete.replace('{id}', dialog.value.item.id)
    await store.dispatch('ui/datatableDelete', { url: url })

    dialog.value.open = false
    dialog.value.item = null

    const params = store.getters['ui/datatableParams']
    await store.dispatch('ui/datatable', { url: props.url, params })

    
}

const setDates = (event) => {
    console.log(event)
}

const formatDate = (iso: string) => {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d)
}

onBeforeMount(() => {
    store.commit('ui/SET_DATATABLE_PARAMS_RESET')
})

</script>


<style>
.v-card {
    height: calc(100% - 64px);
}
</style>