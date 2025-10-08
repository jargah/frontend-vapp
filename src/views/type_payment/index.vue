<template>
    <v-container fluid class="py-6">
        <Datatable 
            title="Lista de Tipos de pago"
            url="administrator/type-payment/list"
            :headers="headers"
            to-view="type-payment-view"
            to-add="type-payment-add"
            to-edit="type-payment-edit"
            
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
