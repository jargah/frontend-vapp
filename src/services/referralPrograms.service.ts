// src/services/referralPrograms.service.ts
export type ReferralProgram = {
    id: number
    name: 'Oro' | 'Plata' | 'Platino' | string
    description: string
    percentage: number // %
}
const STORAGE_KEY = 'demo_referral_programs_v1'

function seed(): ReferralProgram[] {
    const base: ReferralProgram[] = [
        { id: 1, name: 'Oro', description: 'Nivel Oro con mayores beneficios.', percentage: 20 },
        { id: 2, name: 'Plata', description: 'Nivel Plata, beneficios estándar.', percentage: 10 },
        { id: 3, name: 'Platino', description: 'Nivel Platino, beneficios premium.', percentage: 30 },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
    return base
}
function load(): ReferralProgram[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    try { return JSON.parse(raw) as ReferralProgram[] } catch { return seed() }
}
function save(items: ReferralProgram[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }

export const ReferralProgramsService = {
    async list() { return load().sort((a, b) => a.id - b.id) },
    async upsert(payload: Partial<ReferralProgram> & { name: string }) {
        const items = load()
        if (payload.id) {
            const i = items.findIndex(x => x.id === payload.id)
            if (i > -1) items[i] = { ...items[i], ...payload } as ReferralProgram
        } else {
            const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
            items.push({ id: nextId, description: '', percentage: 0, ...payload } as ReferralProgram)
        }
        save(items); return items
    },
}
