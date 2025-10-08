<template>
    <Icon :icon="icon" :width="width" />
</template>

<script setup lang="ts">

import { Icon } from "@iconify/vue"

defineProps({
    icon: { type: String, required: true },
    width: { type: Number, default: 30 },
})

</script>