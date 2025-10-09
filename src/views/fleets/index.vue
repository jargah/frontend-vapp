<template>
    <v-container fluid class="py-6">

         <v-text-field label="Subtotal" v-model="subtotal"></v-text-field>

        <v-text-field label="iva" v-model="iva"></v-text-field>
        
        <p style="color: white;">
            {{ subtotal }} - {{ iva }} - {{ total }}
        </p>
        
        <v-btn @click.prevent="dialogAlert">
            Button
        </v-btn>

        <div class="text-center pa-4">
            <v-btn @click="openDialog">
            Open Dialog
        </v-btn>

        <v-dialog
            v-model="dialog"
            width="auto"
            >
            <v-card
                max-width="400"
                prepend-icon="mdi-update"
                text="Your application will relaunch automatically after the update is complete."
                title="Update in progress"
            >
                <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Ok"
                    @click="closeDialog"
                ></v-btn>
                </template>
            </v-card>
            </v-dialog>
        </div>

        <v-row>
            <v-col v-for="(key, index) of array" :key="index">
                <p style="color: white">
                    {{ key }}
                </p>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-for="(key, index) of test" :key="index">
                <p style="color: white">
                    {{ key.value }}
                </p>
            </v-col>
        </v-row>

        <Datatable 
            title="Lista de Flotillas"
            url="administrator/prospects/list"
            :headers="headers"
            to-view="prospects-view"
        />

       

    </v-container>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

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

const subtotal = ref(0)
const iva = ref(0)


const dialog = computed(() => store.getters['fleets/dialog'])

const openDialog = () => {
    store.commit('fleets/SET_DIALOG', true)
}

const closeDialog = () => {
    store.commit('fleets/SET_DIALOG', false)
}

const total = computed(() => Number(subtotal.value) + Number(iva.value))


const dialogAlert = () => {
    alert(total.value)
}

const array = ref([1,2,3,4,5,6])

const test = ref([{value: 1}, {value: 2}, {value: 3}, {value: 4}])

</script>
