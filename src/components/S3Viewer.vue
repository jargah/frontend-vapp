<template>
    <div class="s3-viewer">
        <!-- Loading -->
        <div v-if="loading" class="s3-viewer__loading">Cargando…</div>

        <!-- Error -->
        <div v-else-if="error" class="s3-viewer__error">
            Error: {{ error }}
            <a v-if="directUrl" :href="directUrl" target="_blank" rel="noopener">Abrir directo</a>
        </div>

        <!-- PDF -->
        <iframe v-else-if="isPdf && url" :src="url" class="s3-viewer__pdf" title="PDF" />

        <!-- Imagen -->
        <img v-else-if="isImage && url" :src="url" alt="S3 Image" class="s3-viewer__img" />

        <!-- Fallback -->
        <a v-else-if="url" :href="url" download :title="filename || 'download'">Descargar</a>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { useS3Url } from '@/composables/useS3Url'

type Props = {
    /** Puedes pasar un key de S3 (ej. 'docs/123/file.pdf') o una URL ya prefirmada */
    keyOrUrl: string
    /** Si pasas un key y necesitas prefirmar, tu backend debe exponer /api/s3/presign?key=... */
    presign?: boolean
    /** Si true, descarga como Blob y usa objectURL (oculta querystring) */
    asBlob?: boolean
    /** Si quieres forzar el tipo (image/pdf) */
    mimeType?: string | null
    /** Nombre sugerido para descarga */
    filename?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    presign: false,
    asBlob: false,
    mimeType: null,
    filename: null
})

const { url, loading, error, revoke, directUrl } = useS3Url({
    keyOrUrl: props.keyOrUrl,
    presign: props.presign,
    asBlob: props.asBlob
})

const ext = computed(() => {
    const u = props.keyOrUrl.toLowerCase()
    const guess = u.split('?')[0].split('#')[0].split('.').pop() || ''
    return guess
})

const isPdf = computed(() => {
    if (props.mimeType) return props.mimeType.includes('pdf')
    return ext.value === 'pdf'
})

const isImage = computed(() => {
    const m = props.mimeType?.toLowerCase() || ''
    if (m.startsWith('image/')) return true
    return ['jpg', 'jpeg', 'png'].includes(ext.value)
})

onBeforeUnmount(revoke)
</script>

<style scoped>
.s3-viewer__pdf {
    width: 100%;
    height: 80vh;
    border: 0;
}

.s3-viewer__img {
    max-width: 100%;
    height: auto;
    display: block;
}

.s3-viewer__loading,
.s3-viewer__error {
    padding: .5rem .75rem;
}
</style>
