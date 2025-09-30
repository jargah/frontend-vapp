// src/directives/capital.ts
import type { Directive, DirectiveBinding } from 'vue'

type CapitalMode = 'upper' | 'word' | 'first' | 'sentence'

function detectMode(binding: DirectiveBinding<CapitalMode | undefined>): CapitalMode {
    if (binding.value) return binding.value
    const m = binding.modifiers
    if (m.upper) return 'upper'
    if (m.word) return 'word'
    if (m.first) return 'first'
    if (m.sentence) return 'sentence'
    return 'upper' // default
}

const rxLetter = /\p{L}/u

function transformValue(value: string, mode: CapitalMode): string {
    switch (mode) {
        case 'upper':
            return value.toUpperCase()
        case 'first':
            return value.replace(/^\s*(\p{L})/u, (m) => m.toUpperCase())
        case 'word':
            // Capitaliza la primera letra después de separadores comunes (incluye unicode NBSP)
            return value.replace(
                /(^|[\s\u00A0"“”'‘’([{\-]+)(\p{L})/gu,
                (_, p1: string, p2: string) => p1 + p2.toUpperCase()
            )
        case 'sentence':
            // Después de . ! ? + espacios
            return value.replace(
                /(^|[.!?]\s+)(\p{L})/gu,
                (_, p1: string, p2: string) => p1 + p2.toUpperCase()
            )
    }
}

function isInputLike(el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
}

function read(el: HTMLElement): string {
    if (isInputLike(el)) return el.value ?? ''
    if (el.isContentEditable) return el.textContent ?? ''
    return ''
}

function write(el: HTMLElement, next: string) {
    if (isInputLike(el)) {
        const input = el
        const start = input.selectionStart ?? next.length
        const end = input.selectionEnd ?? next.length
        const prev = input.value
        if (prev === next) return
        input.value = next
        // Notificar a v-model
        input.dispatchEvent(new Event('input', { bubbles: true }))
        // Mantener caret (la longitud no cambia con estas transformaciones)
        if (document.activeElement === input) {
            input.setSelectionRange(start, end)
        }
    } else if (el.isContentEditable) {
        if (el.textContent === next) return
        el.textContent = next
        // Opcional: podrías emitir un CustomEvent si lo necesitas
    }
}

type CapitalEl = HTMLElement & {
    __capitalHandlers__?: {
        onInput: (e: Event) => void
        onBlur: (e: Event) => void
        onCompStart: () => void
        onCompEnd: () => void
    }
    __capitalComposing__?: boolean
}

export const vCapital: Directive<CapitalEl, CapitalMode | undefined> = {
    mounted(el, binding) {
        const mode = detectMode(binding)
        const stateEl = el as CapitalEl
        stateEl.__capitalComposing__ = false

        const apply = () => {
            if (stateEl.__capitalComposing__) return
            const curr = read(stateEl)
            const next = transformValue(curr, mode)
            if (curr !== next) write(stateEl, next)
        }

        const onInput = () => apply()
        const onBlur = () => apply()
        const onCompStart = () => { stateEl.__capitalComposing__ = true }
        const onCompEnd = () => { stateEl.__capitalComposing__ = false; apply() }

        stateEl.addEventListener('input', onInput)
        stateEl.addEventListener('blur', onBlur)
        stateEl.addEventListener('compositionstart', onCompStart)
        stateEl.addEventListener('compositionend', onCompEnd)

        stateEl.__capitalHandlers__ = { onInput, onBlur, onCompStart, onCompEnd }

        // Primer formateo inicial
        apply()
    },
    updated(el, binding) {
        // Si cambió el modo en tiempo de ejecución
        if (binding.oldValue !== binding.value) {
            const mode = detectMode(binding)
            const curr = read(el)
            const next = transformValue(curr, mode)
            if (curr !== next) write(el, next)
        }
    },
    beforeUnmount(el) {
        const stateEl = el as CapitalEl
        const h = stateEl.__capitalHandlers__
        if (h) {
            stateEl.removeEventListener('input', h.onInput)
            stateEl.removeEventListener('blur', h.onBlur)
            stateEl.removeEventListener('compositionstart', h.onCompStart)
            stateEl.removeEventListener('compositionend', h.onCompEnd)
            delete stateEl.__capitalHandlers__
        }
        delete stateEl.__capitalComposing__
    }
}
