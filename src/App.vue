<template>
    <v-app>
        <component :is="layout">
            <router-view />
        </component>
        <DialogHost />
        <Alert />
    </v-app>
</template>

<script setup lang="ts">

import DialogHost from "@/components/Dialog.vue"
import Alert from "@/components/Alert.vue"


import { computed } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const layout = computed(() => route.meta.layout)


</script>
