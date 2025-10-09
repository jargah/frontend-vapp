<template>

    <v-container fluid class="py-6">


        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <div class="d-flex align-center ga-3">
                <h1 class="text-h5 mb-0">Comisiones</h1>
            </div>
        </div>

        <template v-if="!commission">
            <v-card rounded="xl" elevation="8">
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </v-card>
            
        </template>

        <template v-else>
            <v-card rounded="xl" elevation="8">
                <Form @submit="onSubmit">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" md="6">

                                <v-text-field v-model="pctje_comision_operador" label="Nombre" variant="outlined"
                                    autocomplete="off" :error="!!errors.pctje_comision_operador"
                                    :error-messages="errors.pctje_comision_operador ? [errors.pctje_comision_operador] : []" />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                        
                        <v-btn color="primary" :loading="saving" :disabled="saving" type="submit"
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

import { onMounted, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { Form, useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const saving = ref(false)

const schema = yup.object({
    pctje_comision_operador: yup.number().min(0, 'Debe de tener algún valor').required('Valor requerido')
})

const { handleSubmit, errors, setValues } = useForm({
    validationSchema: schema,
    initialValues: {
        pctje_comision_operador: ''
    },
})

const { value: pctje_comision_operador } = useField<string>('pctje_comision_operador')

const store = useStore()

const commission = computed(() => store.getters['commissions/commissions'])

watch(
    commission,
    (val: any) => {
        if(!val) return

        let values = {}
        for(const key of val) {

            if(key.id == 42) {
                values["pctje_comision_operador"] = key.value
            }
        }

        setValues(values)
    },
    {
        immediate: true
    }
)

const loadData = async () => {
    await store.dispatch('commissions/commissions')
}


const onSubmit = handleSubmit(
    async (values) => {
        try {

            saving.value = true

            alert('saved')

        } 
        catch (e: any) {
            saving.value = false
        } 
        finally {
            saving.value = false
        }
    },
    () => { }
)

onMounted(() => loadData())

</script>