export const vOnlyNumber = {
    mounted(el: HTMLElement, binding: any) {
        const input = findInput(el)
        if (!input) return

        enforceTextInput(input)

        const getOpts = () => ({
            max: toNumber(binding?.value?.max),
            decimalsMax: toNumber(binding?.value?.decimalsMax),
        })

        const setValue = (v: string) => {
            if (input.value === v) return
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
            setter?.call(input, v)
            input.dispatchEvent(new Event('input', { bubbles: true }))
        }

        const sanitize = (raw: string): string => {
            const { max, decimalsMax } = getOpts()
            let s = String(raw ?? '')

            s = s.replace(/,/g, '.').replace(/[^\d.]/g, '')

            const i = s.indexOf('.')
            if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, '')

            if (s.startsWith('.')) s = '0' + s

            if (Number.isFinite(decimalsMax) && decimalsMax! >= 0) {
                const [intPart, decPart = ''] = s.split('.')
                if (s.includes('.')) {
                    const dec = decPart.slice(0, decimalsMax!)
                    s = `${intPart}.${dec}`
                }
            }

            if (Number.isFinite(max) && max! > 0) s = s.slice(0, max!)

            return s
        }

        const allowCtrlNav = (e: KeyboardEvent) => {
            const ctrl = e.ctrlKey || e.metaKey
            const nav = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            if (nav.includes(e.key)) return true
            if (ctrl && ['a', 'c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase())) return true
            return false
        }

        const insertText = (txt: string) => {
            const start = input.selectionStart ?? input.value.length
            const end = input.selectionEnd ?? input.value.length
            input.setRangeText(txt, start, end, 'end')
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if ((e as any).isComposing) return
            if (allowCtrlNav(e)) return

            const key = e.key

            if (/^\d$/.test(key)) return

            if (key === '.' || key === ',' || key === 'Decimal' || key === 'Separator') {
                const val = input.value
                const hasDot = val.includes('.')
                const s = input.selectionStart ?? 0
                const epos = input.selectionEnd ?? 0
                const selected = val.slice(s, epos)
                const selectionRemovesDot = selected.includes('.')

                if (hasDot && !selectionRemovesDot) {
                    e.preventDefault()
                    return
                }

                if (key === ',') {
                    e.preventDefault()
                    insertText('.')
                    setValue(sanitize(input.value))
                    return
                }

                return
            }

            // Todo lo demás, bloquear
            e.preventDefault()
        }

        const onBeforeInput = (e: InputEvent) => {
            if ((e as any).isComposing) return
            const data = (e as any).data as string | null
            if (!data) return
            if (/^\d$/.test(data)) return
            if (data === '.' || data === ',') return
            e.preventDefault()
        }

        const onInput = () => setValue(sanitize(input.value))

        const onPaste = (e: ClipboardEvent) => {
            e.preventDefault()
            const text = (e.clipboardData && e.clipboardData.getData('text')) || ''
            setValue(sanitize(text))
        }

        const { max } = getOpts()
        if (max) input.setAttribute('maxlength', String(max))

        input.addEventListener('keydown', onKeyDown)
        input.addEventListener('beforeinput', onBeforeInput)
        input.addEventListener('input', onInput)
        input.addEventListener('paste', onPaste)

            ; (el as any).__onlyNumberCleanup__ = () => {
                input.removeEventListener('keydown', onKeyDown)
                input.removeEventListener('beforeinput', onBeforeInput)
                input.removeEventListener('input', onInput)
                input.removeEventListener('paste', onPaste)
            }
    },

    updated(el: HTMLElement, binding: any) {
        const input = findInput(el)
        if (!input) return
        enforceTextInput(input)
        const max = toNumber(binding?.value?.max)
        if (max) input.setAttribute('maxlength', String(max))
    },

    unmounted(el: HTMLElement) {
        if ((el as any).__onlyNumberCleanup__) (el as any).__onlyNumberCleanup__()
    },
}

function findInput(root: HTMLElement): HTMLInputElement | null {
    if ((root as any).tagName === 'INPUT') return root as unknown as HTMLInputElement
    return root.querySelector('input')
}

function enforceTextInput(input: HTMLInputElement) {
    input.setAttribute('type', 'text')
    input.setAttribute('inputmode', 'decimal')
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('autocapitalize', 'off')
    input.setAttribute('spellcheck', 'false')
}

function toNumber(v: any): number | undefined {
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
}
