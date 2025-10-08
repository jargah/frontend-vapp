<template>
    <v-container fluid class="py-6">
        <Datatable 
            title="Lista de vehículos"
            url="administrator/vehicles/list"
            :headers="headers"
            to-view="vehicles-view"
            to-add="vehicles-add"
            to-edit="vehicles-edit"
            url-delete="administrator/vehicles/{id}/delete"
            
        />
    </v-container>
</template>

<script setup lang="ts">

import Datatable from '@/components/Datatable.vue'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'name' },
    { title: 'Marca', key: 'branch' },
    { title: 'Modelo', key: 'model' },
    { title: 'Acciones', key: 'actions', },
]

</script>
