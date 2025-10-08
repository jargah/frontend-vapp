<template>
    <v-container fluid class="py-6">
        <Datatable 
            title="Lista de Operadores"
            url="administrator/operators/list"
            :headers="headers"
            to-view="operators-view"            
        />
    </v-container>
</template>

<script setup lang="ts">

import Datatable from '@/components/Datatable.vue'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Operador', key: 'fullname' },
    { title: 'Teléfono', key: 'phone' },
    { title: 'email', key: 'email', },
    { title: 'Viajes', key: 'travels', },
    { title: 'Acciones', key: 'actions', },
]

</script>
