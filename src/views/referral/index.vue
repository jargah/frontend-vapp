<!-- src/views/referrals/list.vue -->
<template>
    <v-container fluid class="py-6">
        <h1 class="text-h5 mb-4">Referidos</h1>

        <!-- Cards de acceso -->
        <v-row class="mb-4" dense>
            <v-col cols="12" md="6">
                <v-card class="h-100" rounded="xl" elevation="6" @click="$router.push({ name: 'referral-programs' })"
                    role="button">
                    <v-card-item>
                        <div class="d-flex align-center ga-3">
                            <v-avatar color="amber" size="44"><v-icon>mdi-medal</v-icon></v-avatar>
                            <div>
                                <div class="text-subtitle-1">Programas</div>
                                <div class="text-medium-emphasis">Niveles: Oro, Plata, Platino</div>
                            </div>
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="h-100" rounded="xl" elevation="6" @click="$router.push({ name: 'referral-products' })"
                    role="button">
                    <v-card-item>
                        <div class="d-flex align-center ga-3">
                            <v-avatar color="indigo" size="44"><v-icon>mdi-gift</v-icon></v-avatar>
                            <div>
                                <div class="text-subtitle-1">Productos</div>
                                <div class="text-medium-emphasis">Canjeables por puntos</div>
                            </div>
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <v-card rounded="xl" elevation="8">
            <!-- <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-3">
                <div class="text-subtitle-1">Listado</div>
                <div class="d-flex ga-2">
                    <v-text-field v-model="search" density="comfortable" variant="outlined" placeholder="Buscar…"
                        prepend-inner-icon="mdi-magnify" clearable hide-details style="min-width:260px" />
                    <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'referrals-add' }">Agregar</v-btn>
                </div>
            </v-card-title> -->

            <v-data-table :headers="headers" :items="filtered" :items-per-page="itemsPerPage" :page="page"
                @update:page="page = $event" @update:items-per-page="itemsPerPage = $event"
                :items-per-page-options="[5, 10, 20, 50]" item-key="id" hover class="text-body-2">
                <template #item.program_level="{ item }">
                    <v-chip size="small" :color="levelColor(item.program_level)">{{ item.program_level }}</v-chip>
                </template>
                <template #item.status="{ item }">
                    <v-chip size="small" :color="item.status === 'ACTIVE' ? 'success' : 'warning'">{{ item.status
                        }}</v-chip>
                </template>
                <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
                <template #item.actions="{ item }">
                    <div class="d-flex ga-1">
                        <v-btn :to="{ name: 'referrals-view', params: { id: item.id } }" icon="mdi-eye-outline"
                            variant="text" />
                        <v-btn :to="{ name: 'referrals-edit', params: { id: item.id } }" icon="mdi-pencil-outline"
                            variant="text" />
                        <v-btn icon="mdi-trash-can-outline" variant="text" color="error" @click="openDelete(item)" />
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

        <!-- Confirmación -->
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
                <v-card-text>¿Eliminar referido <strong>#{{ pending?.id }}</strong> (<em>{{ pending?.operator_name
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
import { ReferralsService, type Referral } from '@/services/referrals.service'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre operador', key: 'operator_name' },
    { title: 'Correo', key: 'email' },
    { title: 'Teléfono', key: 'phone', width: 150 },
    { title: 'Nivel', key: 'program_level', width: 120 },
    { title: 'Status', key: 'status', width: 120 },
    { title: 'Creación', key: 'created_at', width: 180 },
    { title: 'Acciones', key: 'actions', width: 140, align: 'end' },
]
const items = ref<Referral[]>([])
const search = ref(''); const page = ref(1); const itemsPerPage = ref(10)

onMounted(async () => { items.value = await ReferralsService.list() })

const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return items.value
    const f = (x: any) => String(x ?? '').toLowerCase()
    return items.value.filter(i =>
        [i.id, i.operator_name, i.email, i.phone, i.program_level, i.status, formatDate(i.created_at)]
            .map(f).join(' ').includes(q))
})

function levelColor(lvl: string) { return lvl === 'Oro' ? 'amber' : lvl === 'Plata' ? 'grey' : '' }
function formatDate(iso: string) { const d = new Date(iso); return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d) }

const deleteDialog = ref(false)
const pending = ref<Referral | null>(null)
function openDelete(item: Referral) { pending.value = item; deleteDialog.value = true }
function closeDelete() { deleteDialog.value = false; pending.value = null }
async function confirmDelete() {
    if (!pending.value) return
    await ReferralsService.remove(pending.value.id)
    items.value = await ReferralsService.list()
    snackbar.value = { open: true, msg: 'Referido eliminado.' }
    closeDelete()
}
const snackbar = ref({ open: false, msg: '' })
</script>
