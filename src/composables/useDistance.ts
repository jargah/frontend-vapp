// /src/composables/useDistance.ts
export type DistanceUnit = 'm' | 'km' | 'mi'

export interface DistanceFormatOptions {
    /** Unidad de entrada: 'm' (por defecto), 'km' o 'mi' */
    unit?: DistanceUnit
    /** Locale para formato: 'es-MX', 'en-US', etc. Si no se envía, usa el del navegador */
    locale?: string
    /** Decimales cuando se muestra en km/mi */
    decimals?: number
    /** Quita ceros finales (e.g., 2.50 -> 2.5) */
    trimTrailingZeros?: boolean
    /** Si true, usa notación compacta (2.3k km). Útil para números muy grandes */
    compact?: boolean
    /** Fuerza salida en esta unidad (si no se indica, decide automáticamente m vs km/mi) */
    forceUnit?: DistanceUnit
    /** Umbral para pasar de m a km (por defecto 1000 m) */
    mToKmThreshold?: number
    /** Sufijo de unidad (si quieres ocultarlo, ponlo en '' y agrega manualmente fuera) */
    withSuffix?: boolean
}

function roundTo(value: number, decimals = 2) {
    const p = 10 ** decimals
    return Math.round(value * p) / p
}

function trimZeros(n: string) {
    // "12.3400" -> "12.34", "10.00" -> "10"
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

    /** Devuelve { value, unit } normalizados según reglas (m vs km/mi) */
    function normalize(value: number, fromUnit: DistanceUnit = unit) {
        const meters = toMeters(value, fromUnit)

        if (forceUnit === 'm') return { value: meters, unit: 'm' as DistanceUnit }
        if (forceUnit === 'km') return { value: meters / 1000, unit: 'km' as DistanceUnit }
        if (forceUnit === 'mi') return { value: toMi(meters, 'm'), unit: 'mi' as DistanceUnit }

        // Automático: m si < threshold; si no, km (o mi si defaults.unit era mi)
        if (meters < mToKmThreshold) return { value: meters, unit: 'm' as DistanceUnit }

        // Si el usuario trabaja en mi, respeta eso para la salida automática
        if (unit === 'mi') {
            return { value: toMi(meters, 'm'), unit: 'mi' as DistanceUnit }
        }

        // Por defecto, km
        return { value: meters / 1000, unit: 'km' as DistanceUnit }
    }

    /** Formatea según opciones y devuelve string final (e.g., "2.5 km") */
    function format(value?: number | null, fromUnit?: DistanceUnit) {
        if (value == null || isNaN(+value)) return ''

        const norm = normalize(+value, fromUnit || unit)

        // metros se muestran sin decimales ni compact por defecto
        if (norm.unit === 'm') {
            const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(norm.value)
            return withSuffix ? `${n} m` : n
        }

        // km / mi con decimales
        const rounded = roundTo(norm.value, decimals)
        let str = numberFmt(rounded, locale, decimals, compact)
        if (trimTrailingZeros && !compact) str = trimZeros(str)
        return withSuffix ? `${str} ${norm.unit}` : str
    }

    return {
        // Conversión "numérica" utilitaria
        toKm, toMi, toMeters,
        // Normalización para decidir m vs km/mi
        normalize,
        // Formato final para UI
        format,
    }
}
