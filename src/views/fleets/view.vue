<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle Prospecto #{{ view?.prospect?.id_prospecto }}</h1>
            </div>
            <v-btn color="primary" prepend-icon="mdi-pencil-outline"
                :to="{ name: 'prospects-edit', params: { id } }">Editar</v-btn>
        </div>

        <v-card rounded="xl" elevation="8">
            <template v-if="loading">
                <v-skeleton-loader class="pa-6" type="article, list-item-two-line" />
            </template>
            <template v-else-if="error">
                <v-alert type="error" variant="tonal" class="ma-6">{{ error }}</v-alert>
            </template>
            <template v-else-if="!view">
                <v-sheet class="pa-10 text-center">
                    <v-icon size="48" class="mb-2">mdi-file-search-outline</v-icon>
                    <div class="text-h6">No se encontró el operador.</div>
                </v-sheet>
            </template>
            <template v-else>
                <v-card-item>
                    <div class="d-flex align-center ga-4">
                        <v-avatar color="primary" size="56"><v-icon size="32">mdi-account-hard-hat</v-icon></v-avatar>
                        <div>
                            <div class="text-h6">{{ view?.prospect?.nombre }} {{ view?.prospect?.apellido_paterno }} {{
                                view?.prospect?.apellido_materno }}</div>
                            <div class="text-medium-emphasis">ID: {{ view?.prospect?.id_prospecto }}</div>
                        </div>
                    </div>
                </v-card-item>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">
                                    Contacto
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Correo:
                                    </span>
                                    <strong>
                                        {{ view?.prospect?.email }}
                                    </strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Teléfono:
                                    </span>
                                    <strong>
                                        {{ view?.prospect?.telefono }}
                                    </strong>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Status:
                                    </span>
                                    <v-chip size="small"
                                        :color="view?.prospect?.estatus === 'aprobado' ? 'success' : 'warning'">
                                        {{ view?.prospect?.estatus }}
                                    </v-chip>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Conductor:
                                    </span>
                                    <v-chip size="small" :color="view?.prospect?.conductor ? 'success' : 'warning'">
                                        {{ view?.prospect?.conductor ? 'Si' : 'No' }}
                                    </v-chip>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Flotilla:
                                    </span>
                                    <v-chip size="small" :color="view?.prospect?.flotilla ? 'success' : 'warning'">
                                        {{ view?.prospect?.flotilla ? 'Si' : 'No' }}
                                    </v-chip>
                                </div>
                                <div class="d-flex justify-space-between m-1">
                                    <span class="text-medium-emphasis">
                                        Creación:
                                    </span>
                                    <strong>
                                        {{ formatDate(view?.prospect?.creacion) }}
                                    </strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <v-col cols="12" md="6" v-if="Object.keys(view?.documents).length > 0">
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Datos Fiscales</div>
                                <div class="d-flex justify-space-between"><span
                                        class="text-medium-emphasis">RFC:</span><strong>{{ view?.documents.rfc
                                        }}</strong>
                                </div>
                                <div class="d-flex justify-space-between">
                                    <span class="text-medium-emphasis">
                                        Régimen:</span>
                                    <strong>
                                        {{ view?.documents.regimen }}
                                    </strong>
                                </div>
                            </v-sheet>
                        </v-col>

                        <v-col cols="12" md="6" v-else>
                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">
                                    Sin Datos Fiscales
                                </div>
                            </v-sheet>
                        </v-col>

                        <v-col cols="12" md="12" v-if="Object.keys(view?.documents).length > 0">

                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">Visor Documentos</div>

                                <div class="d-flex justify-space-between">

                                    <v-row>
                                        <template v-for="(key, index) in view?.documents">
                                            <v-col cols="12" md="3" v-if="key != null">
                                                <div class="text-body-1 text-center m-1" v-capital.word>
                                                    {{ index.toString().split('_').join(' ') }}
                                                </div>
                                                <div class="text-center m-1">


                                                    <v-btn size="large" :href="key" target="_blank" rel="noopener">
                                                        <template v-slot:default>
                                                            <Icon icon="mdi:file-document" :width="35"
                                                                style="cursor: pointer;" />
                                                        </template>

                                                    </v-btn>
                                                </div>
                                            </v-col>
                                        </template>

                                    </v-row>
                                </div>

                            </v-sheet>
                        </v-col>
                        <v-col cols="12" md="12" v-else="view?.documents">

                            <v-sheet class="pa-4 rounded-lg border">
                                <div class="text-overline mb-2">No se han cargado documentos</div>
                            </v-sheet>
                        </v-col>

                        <template v-for="(key, index) in view?.vehicles" :key="index">
                            <v-col cols="12">
                                <v-sheet class="pa-4 rounded-lg border">
                                    <div class="text-overline mb-2">Vehículo asignado: #{{ index + 1 }}</div>
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <strong>Modelo:</strong> {{ key.model }}
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <strong>Placas:</strong> {{ key.placa }}
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <strong>Año:</strong> {{ key.anio }}
                                        </v-col>
                                    </v-row>
                                </v-sheet>
                            </v-col>
                        </template>
                    </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                    <!-- <v-btn 
                        color="primary" 
                        :to="{ name: 'prospects-edit', params: { id } }"
                        prepend-icon="mdi-pencil-outline"
                    >
                            Editar
                    </v-btn> -->
                </v-card-actions>
            </template>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'

import { store } from '@/store'

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(() => {
    id.value = Number(route.params.id)
    load()
})

watch(() => route.params.id, () => {
    id.value = Number(route.params.id);
})

const view = computed(() => store.getters['prospects/prospect'])

async function load() {

    await store.dispatch('prospects/view', id.value)
    loading.value = false
}
function formatDate(iso: string) {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
}
function goBack() {
    if (history.length > 1) router.back()
    else router.push({ name: 'prospects-list' })
}
</script>

<style scoped>
.border {
    border: 1px solid rgba(0, 0, 0, .08);
}
</style>
