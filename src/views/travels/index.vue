<template>
    <v-container fluid class="py-6">
        <DatatableIterator 
            title="Viajes Realizados"
            url="administrator/service-travel/list"
            :headers="headers"
            to-view="travels-view"         
            :order-desc="true"   
        />
    </v-container>
</template>

<script setup lang="ts">

import DatatableIterator from '@/components/DatatableIterator.vue'


const headers = [
    { title: 'Servicio No. ', key: 'id', position: 'header' },
    { title: 'Origen', key: 'origin', position: 'title' },
    { title: 'Destino', key: 'destination', position: 'title' },
    { title: 'Distancia', key: 'distance', position: 'body', type: 'distance' },
    { title: 'Duración', key: 'time',  position: 'body', type: 'time' },
    { title: 'Costo', key: 'amount', position: 'body', type: 'amount' },
    { title: 'Fecha Inicio', key: 'departure_origin',  },
    { title: 'Fecha Arrivo', key: 'arrival_destination', },
    { title: 'Acciones', key: 'actions', },
]


</script>
