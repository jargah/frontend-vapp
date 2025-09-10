<template>
    <v-card>
        <v-card-title>Flottilas</v-card-title>
        <v-card-text>Preferencias y configuración.</v-card-text>
    </v-card>

    <v-card>
        <DataTableCrud :items="rows" viewRouteName="fleets-view" editRouteName="fleets-edit" :headers="headers"
            :previewFieldsMap="{ 'Nombre': 'name', 'Correo': 'email', 'Estado': 'status' }" :defaultItemsPerPage="10"
            :itemsPerPageOptions="[5, 10, 20, 50]" @delete="onDelete">
            <template #toolbar>
                <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'fleets-add' }">
                    Agregar
                </v-btn>
            </template>
        </DataTableCrud>
    </v-card>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import DataTableCrud from '@/views/fleets/shared/Datatable.vue'

const headers = [
    { title: 'ID', key: 'id', width: 90 },
    { title: 'Nombre', key: 'name_contact' },
    { title: 'Correo', key: 'email' },
    { title: 'Teléfono', key: 'phone' },
    { title: 'Creacion', key: 'creation', width: 140 },
]

const rows = ref([
    { id: 1, name_contact: 'Jaime Rico', email: 'test.flotilla@gmail.com', phone: '+5213322238886', creation: '2025-08-17 16:57:55' },
])

function onDelete(item: any) {
    rows.value = rows.value.filter(r => r.id !== item.id)
}
</script>