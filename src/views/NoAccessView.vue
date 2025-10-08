<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-card class="pa-6 text-center" max-width="500">
            <v-icon size="64" color="red">mdi-lock-alert</v-icon>
            <h2 class="mt-4">Acceso denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
            <v-btn color="primary" class="mt-4" @click="$router.push('/')">
                Volver al inicio
            </v-btn>
        </v-card>
    </v-container>
</template>

<script setup>
</script>
