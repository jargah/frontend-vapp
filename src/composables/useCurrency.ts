// /src/composables/useCurrency.ts
export interface CurrencyOptions {
    /** Locale, p. ej. 'es-MX' (si no se envía, usa el del navegador) */
    locale?: string
    /** Código ISO 4217: 'MXN', 'USD', 'EUR', etc. */
    currency: string
    /** Mín/máx decimales (por defecto 2) */
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    /** Usa notación compacta (12K, 1.2M) */
    compact?: boolean
    /** Muestra símbolo de moneda (si false, muestra solo número) */
    showSymbol?: boolean
    /** Si true, negativos como (1,234.00) en vez de -1,234.00 */
    accounting?: boolean
    /** Quitar ceros finales (2.50 -> 2.5) cuando no sea compacto */
    trimTrailingZeros?: boolean
}

function makeFormatter(opts: Required<Omit<CurrencyOptions, 'locale'>> & { locale?: string }) {
    const { locale, currency, minimumFractionDigits, maximumFractionDigits, compact, showSymbol } = opts
    return new Intl.NumberFormat(locale, {
        style: showSymbol ? 'currency' : 'decimal',
        currency: showSymbol ? currency : undefined,
        minimumFractionDigits,
        maximumFractionDigits,
        notation: compact ? 'compact' : 'standard',
        compactDisplay: 'short',
    })
}

function trimZeros(n: string) {
    // "12.3400" -> "12.34", "10.00" -> "10"
    return n.replace(/(\.\d*?[1-9])0+$/u, '$1').replace(/\.0+$/u, '')
}

/** Convierte unidades mayores a menores (p.ej. 12.34 MXN -> 1234 centavos) */
export function toMinorUnits(value: number | string, fractionDigits = 2): number {
    const num = typeof value === 'string' ? Number(value) : value
    if (!Number.isFinite(num)) return NaN
    const p = 10 ** fractionDigits
    return Math.round(num * p)
}

/** Convierte unidades menores a mayores (p.ej. 1234 centavos -> 12.34 MXN) */
export function fromMinorUnits(value: number | string, fractionDigits = 2): number {
    const num = typeof value === 'string' ? Number(value) : value
    if (!Number.isFinite(num)) return NaN
    const p = 10 ** fractionDigits
    return num / p
}

export function useCurrency(defaults: CurrencyOptions) {
    const {
        locale,
        currency,
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
        compact = false,
        showSymbol = true,
        accounting = false,
        trimTrailingZeros = false,
    } = defaults

    const baseOpts = {
        locale,
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
        compact,
        showSymbol,
        accounting,
        trimTrailingZeros,
    }

    function format(
        value?: number | string | null,
        override?: Partial<CurrencyOptions>
    ): string {
        if (value == null || (typeof value === 'string' && value.trim() === '')) return ''
        const num = typeof value === 'string' ? Number(value) : value
        if (!Number.isFinite(num)) return ''

        const opts = { ...baseOpts, ...override }
        const fmt = makeFormatter(opts)

        // accounting: negativos entre paréntesis
        if (opts.accounting && num < 0) {
            const absStr = fmt.format(Math.abs(num))
            const final = opts.trimTrailingZeros && !opts.compact ? trimZeros(absStr) : absStr
            return `(${final.replace('-', '')})`
        }

        let out = fmt.format(num)
        if (opts.trimTrailingZeros && !opts.compact) out = trimZeros(out)
        return out
    }

    /** Formatea SOLO número (sin símbolo), útil para inputs o reportes */
    function formatNumber(
        value?: number | string | null,
        override?: Partial<CurrencyOptions>
    ): string {
        return format(value, { ...(override || {}), showSymbol: false })
    }

    return {
        /** Principal: "$1,234.50" o "1,234.50" según showSymbol */
        format,
        /** Sin símbolo: "1,234.50" */
        formatNumber,
        /** Helpers de unidades */
        toMinorUnits,
        fromMinorUnits,
    }
}
