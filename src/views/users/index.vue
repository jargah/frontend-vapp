<template>
    <v-container fluid class="py-6">
        <Datatable 
            title="Lista de usuarios"
            url="administrator/configuration/users/list"
            :headers="headers"
            to-view="users-view"
            to-add="users-add"
            to-edit="users-edit"
            url-delete="administrator/configuration/users/{id}/delete"
            
        />
    </v-container>
</template>

<script setup lang="ts">

import Datatable from '@/components/Datatable.vue'

const headers = [
    { title: 'ID', key: 'id', width: 70 },
    { title: 'Nombre', key: 'first_name' },
    { title: 'Apellido', key: 'last_name' },
    { title: 'Correo', key: 'email' },
    { title: 'Teléfono', key: 'phone', },
    { title: 'Acciones', key: 'actions', },
]

</script>
