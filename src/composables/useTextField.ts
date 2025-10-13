import * as yup from 'yup'

type NumSchema = yup.NumberSchema<number | undefined, yup.AnyObject, number>

const DECIMAL_REGEX = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/

function normalizeNumberInput(originalValue: unknown): number | undefined {
    if (typeof originalValue === 'string') {
        const s = originalValue.trim().replace(',', '.')
        if (s === '') return undefined
        const n = Number(s)
        return Number.isNaN(n) ? undefined : n
    }
    return originalValue as number | undefined
}

export function useTextField() {
    const numRequired = (min = 0, message = 'Valor Requerido'): NumSchema =>
        yup
            .number()
            .test(
                'numeric-format',
                'Solo números; si usas decimales, usa un solo punto',
                function () {
                    const ov = (this as any).originalValue as unknown
                    if (typeof ov !== 'string') return true 
                    const s = ov.trim().replace(',', '.')
                    if (s === '') return true
                    return DECIMAL_REGEX.test(s)
                }
            )
            .transform((val, original) => normalizeNumberInput(original))
            .typeError('Debe ser un número válido')
            .min(min, 'Debe de tener algún valor')
            .required(message)

    return { 
        numRequired, 
        normalizeNumberInput 
    }
}
