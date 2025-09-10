<!-- src/views/fleets/view.vue -->
<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Volver</v-btn>
                <h1 class="text-h5 mb-0">Detalle de Flotilla #{{ id }}</h1>
            </div>
            <div class="d-flex ga-2">
                <v-btn color="primary" prepend-icon="mdi-pencil-outline" :to="{ name: 'fleets-edit', params: { id } }">
                    Editar
                </v-btn>
            </div>
        </div>

        <v-card rounded="xl" elevation="8" class="mt-5">
            <template v-if="loading">
                <v-skeleton-loader type="article, list-item-two-line, list-item-two-line" class="pa-6" />
            </template>

            <template v-else-if="error">
                <v-alert type="error" variant="tonal" class="ma-6">{{ error }}</v-alert>
            </template>

            <template v-else-if="!fleet">
                <v-sheet class="pa-10 text-center">
                    <v-icon size="48" class="mb-2">mdi-file-search-outline</v-icon>
                    <div class="text-h6">No se encontró la flotilla solicitada.</div>
                    <div class="text-medium-emphasis">Verifica el identificador.</div>
                </v-sheet>
            </template>

            <template v-else>
                <v-card-item class="pb-0">
                    <div class="d-flex align-center ga-4">
                        <v-avatar color="primary" size="56">
                            <v-icon size="32">mdi-truck-outline</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-h6">{{ fleet.name }}</div>
                            <div class="text-medium-emphasis">Código: {{ fleet.code }}</div>
                        </div>
                    </div>
                </v-card-item>

                <v-card-text>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <v-sheet class="pa-4 rounded-lg border">
                            <div class="text-overline mb-2">Contacto</div>
                            <div class="d-flex justify-space-between">
                                <span class="text-medium-emphasis">Nombre:</span>
                                <strong>{{ fleet.contact_name || '-' }}</strong>
                            </div>
                            <div class="d-flex justify-space-between">
                                <span class="text-medium-emphasis">Teléfono:</span>
                                <strong>{{ fleet.contact_phone || '-' }}</strong>
                            </div>
                            <div class="d-flex justify-space-between">
                                <span class="text-medium-emphasis">Correo:</span>
                                <strong>{{ fleet.contact_email || '-' }}</strong>
                            </div>
                        </v-sheet>

                        <v-sheet class="pa-4 rounded-lg border mt-3">
                            <div class="text-overline mb-2">Estado</div>
                            <div class="d-flex justify-space-between">
                                <span class="text-medium-emphasis">Estatus:</span>
                                <v-chip :color="fleet.status === 'ACTIVE' ? 'success' : 'warning'" size="small"
                                    class="ms-2">
                                    {{ fleet.status }}
                                </v-chip>
                            </div>
                            <div class="d-flex justify-space-between">
                                <span class="text-medium-emphasis">Unidades:</span>
                                <strong>{{ fleet.units_count ?? 0 }}</strong>
                            </div>
                            <div class="d-flex justify-space-between">
                                <span class="text-medium-emphasis">Administrador:</span>
                                <strong>#{{ fleet.administrator_id }}</strong>
                            </div>
                        </v-sheet>
                    </div>

                    <v-divider class="my-6" />
                    <div>
                        <div class="text-overline mb-2">Descripción</div>
                        <div class="text-body-2">{{ fleet.description || 'Sin descripción.' }}</div>
                    </div>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="goBack">Cerrar</v-btn>
                    <v-btn color="primary" :to="{ name: 'fleets-edit', params: { id } }"
                        prepend-icon="mdi-pencil-outline">
                        Editar
                    </v-btn>
                </v-card-actions>
            </template>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Fleet = {
    id: number | string
    code: string
    name: string
    administrator_id: number
    contact_name?: string
    contact_phone?: string
    contact_email?: string
    status: 'ACTIVE' | 'INACTIVE' | string
    units_count?: number
    description?: string
}

const route = useRoute()
const router = useRouter()

/** Tomamos el id desde la URL (params). */
const id = ref<string | number | undefined>(route.params.id as string | undefined)

const loading = ref(true)
const error = ref<string | null>(null)
const fleet = ref<Fleet | null>(null)

async function fetchFleet(currentId: string | number) {
    try {
        loading.value = true
        error.value = null
        // TODO: Reemplaza por tu llamada real:
        // const data = await api.fleets.getById(currentId)
        const data = await mockFetchFleet(currentId) // demo
        fleet.value = data
    } catch (e: any) {
        error.value = e?.message ?? 'Ocurrió un error al cargar la flotilla.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (!id.value) {
        // Si no hay id en la URL, regresamos al listado
        router.replace({ name: 'fleets-list' })
        return
    }
    fetchFleet(id.value)
})

/** Si cambia el id en la URL (navegación interna), recargamos */
watch(
    () => route.params.id,
    (newVal) => {
        id.value = newVal as string
        if (id.value) fetchFleet(id.value)
    }
)

function goBack() {
    if (window.history.length > 1) router.back()
    else router.push({ name: 'fleets-list' })
}

/** ------- DEMO: elimina este mock y usa tu API real ------- */
async function mockFetchFleet(currentId: string | number): Promise<Fleet | null> {
    await new Promise(r => setTimeout(r, 400))
    if (!currentId) return null
    return {
        id: currentId,
        code: `FLT-${String(currentId).toString().padStart(4, '0')}`,
        name: `Flotilla Demo ${currentId}`,
        administrator_id: 1,
        contact_name: 'Test Flotilla 1',
        contact_phone: '+52 33 2223 8886',
        contact_email: 'test.flotilla@test.com',
        status: 'ACTIVE',
        units_count: 12,
        description: 'Ejemplo de flotilla para vista de detalle.',
    }
}
</script>

<style scoped>
.border {
    border: 1px solid rgba(0, 0, 0, .08);
}
</style>
