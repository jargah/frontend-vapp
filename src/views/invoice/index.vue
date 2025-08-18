<template>
    <v-card>
        <v-card-title>Facturacion</v-card-title>
        <v-card-text>Preferencias y configuración.</v-card-text>
    </v-card>

    <v-card>
        <Datatable 
            :items="rows"
            title="Facturacion"
            @add="onAdd"
            @view="onView"
            @edit="onEdit"
            @delete="onAskDelete"
            @deleted="onDeleteConfirmed"
        />
    </v-card>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import type { Row } from '@/types/datatable'
import Datatable from '@/components/Datatable.vue';

const rows = ref<Row[]>([
  { id: 1, name: 'Ana Gómez',  email: 'ana@ejemplo.com',  role: 'Admin',  status: true,  createdAt: '2025-08-01', notes: 'Acceso total.' },
  { id: 2, name: 'Luis Pérez', email: 'luis@ejemplo.com', role: 'Editor', status: false, createdAt: '2025-07-21', notes: 'Pendiente activación.' },
  { id: 3, name: 'Sara Díaz',  email: 'sara@ejemplo.com', role: 'Viewer', status: true,  createdAt: '2025-07-10' },
])

function onAdd() { /* abrir modal de creación */ }
function onView(item: Row) { /* abrir modal de vista */ }
function onEdit(item: Row) { /* abrir modal de edición */ }
function onAskDelete(item: Row) { /* opcional: confirmar en el padre */ }
function onDeleteConfirmed(id: number) {
  rows.value = rows.value.filter(r => r.id !== id)
}

</script>