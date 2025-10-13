<template>
    <v-text-field 
        :label="label" 
        :name="name" 
        v-model="value" 
        :type="type"
        :error-messages="errorMessage ? [errorMessage] : []" 
    />
</template>

<script setup lang="ts">
import { defineProps, toRef, watch } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps<{
    label: string
    name: string
    model?: any
    type?: string
}>()

const name = toRef(props, 'name')
const model = toRef(props, 'model')

const {
    value,
    errorMessage,
    setValue,
} = useField(name, undefined, {
    initialValue: model.value ?? null,
})

watch(model, (nv) => {
    if (nv !== value.value) {
        setValue(nv, false)
    }
}, { immediate: true })
</script>
