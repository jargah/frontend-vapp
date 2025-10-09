// /src/composables/useDistance.ts
export type DistanceUnit = 'm' | 'km' | 'mi'

export interface DistanceFormatOptions {
    unit?: DistanceUnit
    locale?: string
    decimals?: number
    trimTrailingZeros?: boolean
    compact?: boolean
    forceUnit?: DistanceUnit
    mToKmThreshold?: number
    withSuffix?: boolean
}

function roundTo(value: number, decimals = 2) {
    const p = 10 ** decimals
    return Math.round(value * p) / p
}

function trimZeros(n: string) {
    return n.replace(/(\.\d*?[1-9])0+$/u, '$1').replace(/\.0+$/u, '')
}

function numberFmt(value: number, locale?: string, decimals = 2, compact = false) {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        notation: compact ? 'compact' : 'standard',
        compactDisplay: 'short',
    }).format(value)
}

function toKm(value: number, unit: DistanceUnit = 'm') {
    if (unit === 'km') return value
    if (unit === 'mi') return value * 1.609344
    return value / 1000 // 'm'
}

function toMi(value: number, unit: DistanceUnit = 'm') {
    if (unit === 'mi') return value
    if (unit === 'km') return value / 1.609344
    return (value / 1000) / 1.609344 // 'm'
}

function toMeters(value: number, unit: DistanceUnit = 'm') {
    if (unit === 'm') return value
    if (unit === 'km') return value * 1000
    return value * 1609.344 // 'mi'
}

export function useDistance(defaults: DistanceFormatOptions = {}) {
    const {
        unit = 'm',
        locale,
        decimals = 2,
        trimTrailingZeros = true,
        compact = false,
        forceUnit,
        mToKmThreshold = 1000,
        withSuffix = true,
    } = defaults

    function normalize(value: number, fromUnit: DistanceUnit = unit) {
        const meters = toMeters(value, fromUnit)

        if (forceUnit === 'm') return { value: meters, unit: 'm' as DistanceUnit }
        if (forceUnit === 'km') return { value: meters / 1000, unit: 'km' as DistanceUnit }
        if (forceUnit === 'mi') return { value: toMi(meters, 'm'), unit: 'mi' as DistanceUnit }

        if (meters < mToKmThreshold) return { value: meters, unit: 'm' as DistanceUnit }

        if (unit === 'mi') {
            return { value: toMi(meters, 'm'), unit: 'mi' as DistanceUnit }
        }

        return { value: meters / 1000, unit: 'km' as DistanceUnit }
    }

    function format(value?: number | null, fromUnit?: DistanceUnit) {
        if (value == null || isNaN(+value)) return ''

        const norm = normalize(+value, fromUnit || unit)

        if (norm.unit === 'm') {
            const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(norm.value)
            return withSuffix ? `${n} m` : n
        }

        const rounded = roundTo(norm.value, decimals)
        let str = numberFmt(rounded, locale, decimals, compact)
        if (trimTrailingZeros && !compact) str = trimZeros(str)
        return withSuffix ? `${str} ${norm.unit}` : str
    }

    return {
        toKm, toMi, toMeters,
        normalize,
        format,
    }
}
