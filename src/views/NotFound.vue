<template>
    <v-container class="fill-height">
        <v-row align="center" justify="center" class="text-center">
            <v-col cols="12" md="8" lg="6">
                <div class="mb-6">
                    <v-icon size="128">mdi-emoticon-sad-outline</v-icon>
                </div>
                <h1 class="text-h2 font-weight-black mt-n4">404</h1>
                <p class="text-h6 text-medium-emphasis mb-6">La página que buscas no existe o fue movida.</p>


                <v-text-field v-model="q" variant="outlined" density="comfortable" prepend-inner-icon="mdi-magnify"
                    placeholder="Buscar en el sitio…" class="mx-auto" style="max-width: 520px"
                    @keydown.enter="goSearch" />


                <div class="d-flex flex-wrap ga-3 justify-center mt-2">
                    <RouterLink to="/">
                        <v-btn color="primary" prepend-icon="mdi-home">Ir al inicio</v-btn>
                    </RouterLink>
                    <v-btn variant="outlined" prepend-icon="mdi-history" @click="goBack">Regresar</v-btn>
                    <RouterLink to="/contacto">
                        <v-btn variant="text" prepend-icon="mdi-lifebuoy">Soporte</v-btn>
                    </RouterLink>
                </div>


                <v-divider class="my-8" />


                <div class="d-flex align-center justify-center ga-4 flex-wrap">
                    <RouterLink to="/blog">
                        <v-chip variant="outlined" prepend-icon="mdi-post-outline">Blog</v-chip>
                    </RouterLink>
                    <RouterLink to="/faq">
                        <v-chip variant="outlined" prepend-icon="mdi-frequently-asked-questions">FAQ</v-chip>
                    </RouterLink>
                    <RouterLink to="/mapa-del-sitio">
                        <v-chip variant="outlined" prepend-icon="mdi-sitemap-outline">Mapa del sitio</v-chip>
                    </RouterLink>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const q = ref('')
const router = useRouter()


function goBack() {
    window.history.length > 1 ? router.back() : router.push({ name: 'home' })
}


function goSearch() {
    if (!q.value) return
    // Redirige a una ruta de búsqueda si existe en tu app
    router.push({ path: '/buscar', query: { q: q.value } })
}
</script>


<style scoped>
.fill-height {
    min-height: calc(100vh - 64px);
}
</style>