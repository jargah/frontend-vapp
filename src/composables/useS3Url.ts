import { ref, onMounted } from 'vue'

type Options = {
    keyOrUrl: string
    presign?: boolean
    asBlob?: boolean
}

export function useS3Url({ keyOrUrl, presign = false, asBlob = false }: Options) {
    const url = ref<string | null>(null)
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    let objectUrl: string | null = null
    const directUrl = ref<string | null>(null)

    async function load() {
        loading.value = true
        error.value = null
        try {
            const isFullUrl = /^https?:\/\//i.test(keyOrUrl)

            let presigned = ''
            if (isFullUrl && !presign) {
                presigned = keyOrUrl
            } else {
                const res = await fetch(`/api/s3/presign?key=${encodeURIComponent(keyOrUrl)}`)
                if (!res.ok) throw new Error(`Presign failed (${res.status})`)
                const j = await res.json()
                presigned = j.url
            }
            directUrl.value = presigned

            if (asBlob) {
                const resp = await fetch(presigned, { method: 'GET' })
                if (!resp.ok) throw new Error(`GET failed (${resp.status})`)
                const blob = await resp.blob()
                objectUrl = URL.createObjectURL(blob)
                url.value = objectUrl
            } else {
                url.value = presigned
            }
        } catch (e: any) {
            error.value = e?.message || 'Error desconocido'
        } finally {
            loading.value = false
        }
    }

    function revoke() {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
            objectUrl = null
        }
    }

    onMounted(load)

    return { url, loading, error, reload: load, revoke, directUrl }
}
