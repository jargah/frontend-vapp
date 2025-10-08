// directiva: permite letras, números y espacios
export default {
    mounted(el, binding) {
        const regex = /^[a-zA-Z0-9 ]*$/   // letras, números, espacio
        const max = binding.value?.max ?? null

        function sanitize(value) {
            let clean = (value || '').replace(/[^a-zA-Z0-9 ]/g, '')
            if (max) clean = clean.slice(0, max)
            return clean
        }

        function onInput(e) {
            const clean = sanitize(e.target.value)
            if (e.target.value !== clean) {
                e.target.value = clean
                e.target.dispatchEvent(new Event('input'))
            }
        }

        el.addEventListener('input', onInput)
        el.addEventListener('paste', (e) => {
            e.preventDefault()
            const text = (e.clipboardData || window.clipboardData).getData('text')
            const clean = sanitize(text)
            document.execCommand('insertText', false, clean)
        })
    },
}
