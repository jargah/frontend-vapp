<template>
    <v-dialog v-model="alert.open" width="auto">
        <v-card max-width="400">

            <template v-slot:prepend>
                <template v-if="alert.type == 'success'">
                    <Icon icon="mdi:sucess-outline" class="alert--success" />
                </template>
                <template v-else-if="alert.type == 'warning'">
                    <Icon icon="mdi:warning-octagon-outline" class="alert--warning" />
                </template>
                <template v-else-if="alert.type == 'info'">
                    <Icon icon="mdi:warning-box-outline" class="alert--info" />
                </template>
                <template v-else-if="alert.type == 'error'">
                    <Icon icon="mdi:error-outline" class="alert--error text-center" />
                </template>
            </template>

            <template v-slot:title>
                <div class="text-h6 text-center">{{ alert.title }}</div>
            </template>

            <template v-slot:text>
                <div class="text-body-1">{{ alert.message }}</div>
            </template>
            
            <template v-slot:actions>
                <v-btn 
                    class="d-block mx-auto" 
                    text="Cerrar" 
                    variant="outlined"
                    @click.prevent="close">
                </v-btn>
            </template>

        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'

const store = useStore()

console.log(store)

const alert = computed(() => store.getters['alert'])

const close = () => store.commit('SET_CLOSE_ALERT')

</script>

<style scoped></style>