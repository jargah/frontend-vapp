<template>
    <v-container fluid class="py-6">
        <Datatable 
            title="Lista de Pasajeros"
            url="administrator/passengers/list"
            :headers="headers"
            to-view="passengers-view"
            
        />
    </v-container>
</template>

<script setup lang="ts">

import Datatable from '@/components/Datatable.vue'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'fullname' },
    { title: 'Teléfono', key: 'phone' },
    { title: 'Correo', key: 'email' },
    { title: 'Genero', key: 'gender', },
    { title: 'Estatus', key: 'active', },
    { title: 'Acciones', key: 'actions', },
]

</script>
