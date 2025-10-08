// src/directives/onlyDigits.js
export const vOnlyDigits = {
    mounted(el, binding) {
        const input = el.querySelector('input')
        if (!input) return

        const max = binding?.value?.max

        const sanitize = (val) => {
            let v = (val || '').replace(/\D+/g, '')
            if (max) v = v.slice(0, max)
            return v
        }

        const setValue = (v) => {
            if (input.value !== v) {
                input.value = v
                input.dispatchEvent(new Event('input', { bubbles: true }))
            }
        }

        const onBeforeInput = (e) => {
            if (e.data && /\D/.test(e.data)) e.preventDefault()
        }

        const onInput = () => setValue(sanitize(input.value))

        const onPaste = (e) => {
            e.preventDefault()
            const text = (e.clipboardData && e.clipboardData.getData('text')) || ''
            setValue(sanitize(text))
        }

        input.setAttribute('inputmode', 'numeric')
        if (max) input.setAttribute('maxlength', String(max))

        input.addEventListener('beforeinput', onBeforeInput)
        input.addEventListener('input', onInput)
        input.addEventListener('paste', onPaste)

        el.__onlyDigitsCleanup__ = () => {
            input.removeEventListener('beforeinput', onBeforeInput)
            input.removeEventListener('input', onInput)
            input.removeEventListener('paste', onPaste)
        }
    },
    updated(el, binding) {
        const input = el.querySelector('input')
        if (!input) return
        const max = binding?.value?.max
        if (max) input.setAttribute('maxlength', String(max))
    },
    unmounted(el) {
        if (el.__onlyDigitsCleanup__) el.__onlyDigitsCleanup__()
    },
}
