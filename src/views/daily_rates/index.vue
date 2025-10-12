<template>

    <v-container fluid class="py-6">


        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <h1 class="text-h5 mb-0">Tarifas Diarias</h1>
            </div>
        </div>

        <template v-if="!rates">
            <v-card rounded="xl" elevation="8">
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </v-card>
            
        </template>

        <template v-else>
            <v-card rounded="xl" elevation="8">
                <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ isSubmitting, values }">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" md="6" v-for="(key, index) of rates" :key="index" >
                            
                                <TextField 
                                    :label="key.label"
                                    :name="key.name"
                                    :model="key.value"
                                    :type="key.name.includes('inicio') || key.name.includes('fin') ? 'time' : 'text'"
                                />

                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                        
                        <v-btn 
                            color="primary" 
                            :loading="isSubmitting" 
                            :disabled="isSubmitting" 
                            type="submit"
                            variant="outlined"
                            prepend-icon="mdi-content-save-outline">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </Form>
            </v-card>
        </template>
    </v-container>
</template>

<script setup lang="ts">

import TextField from '@/components/form/textField.vue'

import { onMounted, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { Form, useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useTextField } from '@/composables/useTextField'



const { numRequired } = useTextField()

const saving = ref(false)

const hoursRequired = (message = 'La hora es obligatoria') => yup.string()
    .required(message)
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)')

const schema = yup.object({
    pctj_tarifa_nocturna: numRequired(0),
    inicio_tarifa_nocturna: hoursRequired('La hora de inicio es obligatoria'),       
    fin_tarifa_nocturna: hoursRequired('La hora de fin es obligatoria'),
    pctj_tarifa_matutina_1: numRequired(0),
    inicio_tarifa_matutina_1: hoursRequired('La hora de inicio es obligatoria'),
    fin_tarifa_matutina_1: hoursRequired('La hora de fin es obligatoria'),
    pctj_tarifa_matutina_2: numRequired(0),
    inicio_tarifa_matutina_2: hoursRequired('La hora de inicio es obligatoria'),
    fin_tarifa_matutina_2: hoursRequired('La hora de fin es obligatoria'),
    pctj_tarifa_tarde_1: numRequired(0),
    inicio_tarifa_tarde_1: hoursRequired('La hora de inicio es obligatoria'),
    fin_tarifa_tarde_1: hoursRequired('La hora de fin es obligatoria'),
    pctj_tarifa_tarde_2: numRequired(0),
    inicio_tarifa_tarde_2: hoursRequired('La hora de inicio es obligatoria'),
    fin_tarifa_tarde_2: hoursRequired('La hora de fin es obligatoria')
})


const store = useStore()

const rates = computed(() => store.getters['dailyRates/rates'])


const loadData = async () => {
    await store.dispatch('dailyRates/list')
}


const onSubmit = async (values) => {
    try {

        const payload = []

        for(const key in values) {
            const id = rates.value.find(item => item.name === key)?.id
            
            payload.push({
                id,
                value: values[key]
            })
        }

        await store.dispatch('dailyRates/edit', { fields: payload })

    } 
    catch (e: any) {
        saving.value = false
    } 
    finally {
        saving.value = false
    }
}

onMounted(() => loadData())

</script>