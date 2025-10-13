<template>
    <v-container fluid class="py-6">
        
        <Datatable 
            title="Lista de prospectos"
            url="administrator/prospects/list"
            :headers="headers"
            to-view="prospects-view"
            url-delete="administrator/prospects/{id}/delete"
        />
    </v-container>
</template>

<script setup lang="ts">
import Datatable from '@/components/Datatable.vue'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'first_name' },
    { title: 'Apellido Paterno', key: 'last_name' },
    { title: 'Apellido Materno', key: 'second_surname' },
    { title: 'Correo', key: 'email' },
    { title: 'Teléfono', key: 'phone', width: 150 },
    { title: 'Status', key: 'status', width: 120 },
    { title: 'Creación', key: 'creation', width: 180 },
    { title: 'Acciones', key: 'actions', width: 140, align: 'end' },
]

</script>
