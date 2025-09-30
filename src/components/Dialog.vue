<template>
    <v-dialog v-model="dialog.open" width="auto">
        <v-card max-width="400" 
            prepend-icon="mdi-update"
            text="Your application will relaunch automatically after the update is complete."
            title="Update in progress">
            <template v-slot:actions>
                <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from 'vuex'

const store = useStore()


const dialog = computed(() => store.getters['dialog'])

</script>

<style scoped></style>