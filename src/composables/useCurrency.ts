// /src/composables/useCurrency.ts
export interface CurrencyOptions {
    locale?: string
    currency: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    compact?: boolean
    showSymbol?: boolean
    accounting?: boolean
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
    return n.replace(/(\.\d*?[1-9])0+$/u, '$1').replace(/\.0+$/u, '')
}

export function toMinorUnits(value: number | string, fractionDigits = 2): number {
    const num = typeof value === 'string' ? Number(value) : value
    if (!Number.isFinite(num)) return NaN
    const p = 10 ** fractionDigits
    return Math.round(num * p)
}

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

    function formatNumber(
        value?: number | string | null,
        override?: Partial<CurrencyOptions>
    ): string {
        return format(value, { ...(override || {}), showSymbol: false })
    }

    return {
        format,
        formatNumber,
        toMinorUnits,
        fromMinorUnits,
    }
}
