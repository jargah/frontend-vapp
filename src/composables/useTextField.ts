

import * as yup from 'yup'

type StrSchema = yup.StringSchema<string | undefined, yup.AnyObject, string>
type NumSchema = yup.NumberSchema<number | undefined, yup.AnyObject, number>
type IntSchema = yup.NumberSchema<number | undefined, yup.AnyObject, number>
type BoolSchema = yup.BooleanSchema<boolean | undefined, yup.AnyObject, boolean>
type DateSchema = yup.DateSchema<Date | undefined, yup.AnyObject, Date>

const DECIMAL_REGEX = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/
const INTEGER_REGEX = /^[+-]?\d+$/
const CURRENCY_REGEX = /^[+-]?\d+(?:\.\d{1,2})?$/
const PERCENT_REGEX = /^(?:\d+(?:\.\d+)?|\.\d+)$/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const PHONE_GENERIC_REGEX = /^\+?[0-9][0-9\s\-().]{6,20}$/

function normalizeTrimString(v: unknown): string | undefined {
    if (typeof v === 'string') {
        const s = v.trim()
        return s === '' ? undefined : s
    }
    return v as string | undefined
}

function normalizeNumberInput(originalValue: unknown): number | undefined {
    if (typeof originalValue === 'string') {
        const s = originalValue.trim().replace(',', '.')
        if (s === '') return undefined
        const n = Number(s)
        return Number.isNaN(n) ? undefined : n
    }
    return originalValue as number | undefined
}

function normalizeIntegerInput(originalValue: unknown): number | undefined {
    if (typeof originalValue === 'string') {
        const s = originalValue.trim()
        if (s === '') return undefined
        if (!INTEGER_REGEX.test(s)) return undefined
        const n = Number(s)
        return Number.isNaN(n) ? undefined : n
    }
    if (typeof originalValue === 'number') {
        return Number.isInteger(originalValue) ? originalValue : undefined
    }
    return undefined
}

function normalizeBooleanInput(originalValue: unknown): boolean | undefined {
    if (typeof originalValue === 'boolean') return originalValue
    if (typeof originalValue === 'string') {
        const s = originalValue.trim().toLowerCase()
        if (s === '') return undefined
        if (['true', '1', 'sí', 'si', 'y', 'yes'].includes(s)) return true
        if (['false', '0', 'no', 'n'].includes(s)) return false
    }
    if (typeof originalValue === 'number') {
        if (originalValue === 1) return true
        if (originalValue === 0) return false
    }
    return undefined
}

function parseDateFlexible(originalValue: unknown): Date | undefined {
    if (originalValue instanceof Date && !isNaN(originalValue.getTime())) return originalValue
    if (typeof originalValue === 'number') {
        const d = new Date(originalValue)
        return isNaN(d.getTime()) ? undefined : d
    }
    if (typeof originalValue === 'string') {
        const s = originalValue.trim()
        if (s === '') return undefined
        const dm = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s)
        if (dm) {
            const [, dd, mm, yyyy] = dm
            const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
            return isNaN(d.getTime()) ? undefined : d
        }
        const d = new Date(s)
        return isNaN(d.getTime()) ? undefined : d
    }
    return undefined
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

    const numOptional = (min?: number, max?: number): NumSchema => {
        let schema = yup
            .number()
            .transform((_, original) => normalizeNumberInput(original))
            .typeError('Debe ser un número válido')

        if (typeof min === 'number') schema = schema.min(min, `Debe ser ≥ ${min}`)
        if (typeof max === 'number') schema = schema.max(max, `Debe ser ≤ ${max}`)

        return schema.notRequired()
    }

    const intRequired = (min = 0, message = 'Valor Requerido'): IntSchema =>
        yup
            .number()
            .test('integer-format', 'Debe ser un entero', function () {
                const ov = (this as any).originalValue as unknown
                if (ov === undefined || ov === null) return true
                if (typeof ov === 'number') return Number.isInteger(ov)
                if (typeof ov === 'string') {
                    const s = ov.trim()
                    if (s === '') return true
                    return INTEGER_REGEX.test(s)
                }
                return false
            })
            .transform((val, original) => normalizeIntegerInput(original))
            .typeError('Debe ser un entero válido')
            .min(min, `Debe ser ≥ ${min}`)
            .required(message)

    const intOptional = (min?: number, max?: number): IntSchema => {
        let schema = yup
            .number()
            .transform((_, original) => normalizeIntegerInput(original))
            .typeError('Debe ser un entero válido')
            .integer()

        if (typeof min === 'number') schema = schema.min(min, `Debe ser ≥ ${min}`)
        if (typeof max === 'number') schema = schema.max(max, `Debe ser ≤ ${max}`)

        return schema.notRequired()
    }

    const currencyRequired = (min = 0, message = 'Valor Requerido'): NumSchema =>
        yup
            .number()
            .test('currency-format', 'Formato moneda inválido (máx. 2 decimales)', function () {
                const ov = (this as any).originalValue as unknown
                if (typeof ov !== 'string') return true
                const s = ov.trim().replace(',', '.')
                if (s === '') return true
                return CURRENCY_REGEX.test(s)
            })
            .transform((val, original) => normalizeNumberInput(original))
            .typeError('Debe ser un número válido')
            .min(min, `Debe ser ≥ ${min}`)
            .required(message)

    const percentRequired = (message = 'Valor Requerido'): NumSchema =>
        yup
            .number()
            .test('percent-format', 'Porcentaje inválido', function () {
                const ov = (this as any).originalValue as unknown
                if (typeof ov !== 'string') return true
                const s = ov.trim().replace(',', '.')
                if (s === '') return true
                return PERCENT_REGEX.test(s)
            })
            .transform((val, original) => normalizeNumberInput(original))
            .typeError('Debe ser un número válido')
            .min(0, 'Debe ser ≥ 0')
            .max(100, 'Debe ser ≤ 100')
            .required(message)

    const fractionRequired = (message = 'Valor Requerido'): NumSchema =>
        yup
            .number()
            .test('fraction-format', 'Fracción inválida', function () {
                const ov = (this as any).originalValue as unknown
                if (typeof ov !== 'string') return true
                const s = ov.trim().replace(',', '.')
                if (s === '') return true
                return DECIMAL_REGEX.test(s)
            })
            .transform((val, original) => normalizeNumberInput(original))
            .typeError('Debe ser un número válido')
            .min(0, 'Debe ser ≥ 0')
            .max(1, 'Debe ser ≤ 1')
            .required(message)

    const strRequired = (
        min = 1,
        max?: number,
        message = 'Valor Requerido'
    ): StrSchema => {
        let s = yup
            .string()
            .transform((v) => normalizeTrimString(v))
            .typeError('Debe ser un texto')
            .min(min, `Debe tener al menos ${min} carácter(es)`)
            .required(message)
        if (typeof max === 'number') s = s.max(max, `Debe tener como máximo ${max} carácter(es)`)
        return s
    }

    const emailRequired = (message = 'Correo requerido'): StrSchema =>
        yup
            .string()
            .transform((v) => normalizeTrimString(v))
            .email('Correo inválido')
            .required(message)

    const urlRequired = (message = 'URL requerida'): StrSchema =>
        yup
            .string()
            .transform((v) => normalizeTrimString(v))
            .url('URL inválida')
            .required(message)

    const uuidRequired = (message = 'UUID requerido'): StrSchema =>
        yup
            .string()
            .transform((v) => normalizeTrimString(v))
            .matches(UUID_REGEX, 'UUID inválido')
            .required(message)

    const phoneRequired = (message = 'Teléfono requerido'): StrSchema =>
        yup
            .string()
            .transform((v) => normalizeTrimString(v))
            .matches(PHONE_GENERIC_REGEX, 'Teléfono inválido')
            .required(message)

    const boolRequired = (message = 'Valor requerido'): BoolSchema =>
        yup
            .boolean()
            .transform((val, original) => normalizeBooleanInput(original))
            .typeError('Debe ser verdadero o falso')
            .required(message)

    const dateRequired = (message = 'Fecha requerida'): DateSchema =>
        yup
            .date()
            .transform((val, original) => parseDateFlexible(original))
            .typeError('Fecha inválida')
            .required(message)

    const arrayRequired = <T = unknown>(min = 1, message = 'Lista requerida') =>
        yup
            .array<yup.Schema<T>>()
            .min(min, `Debe contener al menos ${min} elemento(s)`)
            .required(message)

    const arrayOf = <T = unknown>(schema: yup.Schema<T>, min?: number, max?: number) => {
        let a = yup.array().of(schema)
        if (typeof min === 'number') a = a.min(min, `Debe contener al menos ${min} elemento(s)`)
        if (typeof max === 'number') a = a.max(max, `Debe contener como máximo ${max} elemento(s)`)
        return a
    }

    const objectRequired = <T extends yup.ObjectShape>(shape: T, message = 'Objeto requerido') =>
        yup.object().shape(shape).required(message)

    return {
        numRequired,
        numOptional,
        intRequired,
        intOptional,
        currencyRequired,
        percentRequired,
        fractionRequired,
        strRequired,
        emailRequired,
        urlRequired,
        uuidRequired,
        phoneRequired,
        boolRequired,
        dateRequired,
        arrayRequired,
        arrayOf,
        objectRequired,
        normalizeNumberInput,
        normalizeIntegerInput,
        normalizeBooleanInput,
        parseDateFlexible,
    }
}
