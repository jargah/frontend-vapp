<template>
    <v-container fluid class="py-6">
        <Datatable 
            title="Lista de Tipos de motor"
            url="administrator/type-motor/list"
            :headers="headers"
            to-view="type-motor-view"
            to-add="type-motor-add"
            to-edit="type-motor-edit"
            
        />
    </v-container>
</template>

<script setup lang="ts">

import Datatable from '@/components/Datatable.vue'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'name' },
    { title: 'Acciones', key: 'actions', },
]

</script>
