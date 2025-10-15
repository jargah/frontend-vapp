<template>
    <v-container fluid class="py-6">

        <Datatable 
            title="Lista de prospectos" 
            url="administrator/prospects/list" 
            :headers="headers"
            to-view="prospects-view" 
            url-delete="administrator/prospects/{id}/delete" 
            excel="administrator/prospects/export"
            />
    </v-container>
</template>


<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'
import Datatable from '@/components/Datatable.vue'

type Row = {
    id: string
    fullname: string
    email: string
    phone: string | number
    docs: number
    assign_status: string
    creation: string
}

// Permite keys de Row y además la columna virtual 'actions'
type HeaderKey = keyof Row | 'actions'

type VHeader<T> = Omit<DataTableHeader<T>, 'key'> & {
    key: HeaderKey
    dataType?: 'text' | 'number' | 'date' | 'status' | 'docs' | 'assign'
}

const headers: VHeader<Row>[] = [
    { title: 'ID', key: 'id', width: 70, align: 'center' },
    { title: 'Nombre', key: 'fullname' },
    { title: 'Correo', key: 'email' },
    { title: 'Teléfono', key: 'phone', width: 150, align: 'center' },
    { title: 'Documentos', key: 'docs', width: 120, align: 'center', dataType: 'docs' },
    { title: 'Asignado', key: 'assign_status', width: 120, align: 'center', dataType: 'assign' },
    { title: 'Creación', key: 'creation', width: 180, align: 'center', dataType: 'date' },
    { title: 'Acciones', key: 'actions', width: 140, align: 'end' }
]
</script>
