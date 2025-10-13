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
                    <v-col cols="6" class="m-3">
                        <span class="font-weight-black">
                            {{ title }}
                        </span>
                    </v-col>
                    <v-col cols="4" class="d-flex align-items-center">
                        <v-text-field  
                            placeholder="Buscador" 
                            variant="outlined"
                            autocomplete="off"
                            @update:model-value="setSearch" 
                        />
                    </v-col>
                </v-row>
                <v-divider></v-divider>
            </template>

            <v-data-table-server 
                :height="620"
                fixed-header
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

                <template #item.status="{ item }">
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
                </template>
        
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
import { computed, ref, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { debounce } from 'lodash-es'

const props = defineProps({
    url: String,
    urlDelete: { type: String, default: '' },
    title: String,
    headers: { type: Array, default: () => [] },
    toAdd: { type: String, default: '' },
    toView: { type: String, default: '' },
    toEdit: { type: String, default: '' }
})

const store = useStore()

const loading = ref(true)
const dialog = ref({
    open: false,
    message: '',
    item: null
})

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