<template>
    <v-container fluid class="py-6">
        <Datatable 
            title="Lista de Tipos de taxi"
            url="administrator/type-taxi/list"
            :headers="headers"
            to-view="type-taxi-view"
            to-add="type-taxi-add"
            to-edit="type-taxi-edit"
            
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
