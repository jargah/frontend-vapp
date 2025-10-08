export type DurationFormat = 'hh:mm' | 'hm'

export function useDuration(format: DurationFormat = 'hh:mm') {
    function formatMinutes(mins?: number | null) {
        if (mins == null || isNaN(+mins)) return ''
        const neg = +mins < 0
        let v = Math.abs(+mins)
        const h = Math.floor(v / 60)
        const m = v % 60
        const out = format === 'hh:mm'
            ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            : `${h}h ${m}m`
        return neg ? `-${out}` : out
    }
    return { formatMinutes }
}
