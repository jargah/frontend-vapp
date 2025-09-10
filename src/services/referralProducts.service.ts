// src/services/referralProducts.service.ts
export type ReferralProduct = {
    id: number
    name: string
    description: string
    points_value: number
    created_at: string
}
const STORAGE_KEY = 'demo_referral_products_v1'

function seed(): ReferralProduct[] {
    const now = Date.now(), days = (n: number) => new Date(now - n * 86400000).toISOString()
    const base: ReferralProduct[] = [
        { id: 1, name: 'Tarjeta Regalo $200', description: 'Gift card de $200 MXN', points_value: 2000, created_at: days(2) },
        { id: 2, name: 'Playera Oficial', description: 'Merch oficial', points_value: 800, created_at: days(5) },
        { id: 3, name: 'Válvula Premium', description: 'Refacción premium', points_value: 1200, created_at: days(8) },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
    return base
}
function load(): ReferralProduct[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    try { return JSON.parse(raw) as ReferralProduct[] } catch { return seed() }
}
function save(items: ReferralProduct[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }

export const ReferralProductsService = {
    async list() { return load().sort((a, b) => a.id - b.id) },
    async upsert(payload: Partial<ReferralProduct> & { name: string }) {
        const items = load()
        if (payload.id) {
            const i = items.findIndex(x => x.id === payload.id)
            if (i > -1) items[i] = { ...items[i], ...payload } as ReferralProduct
        } else {
            const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
            items.push({ id: nextId, description: '', points_value: 0, created_at: new Date().toISOString(), ...payload } as ReferralProduct)
        }
        save(items); return items
    },
}
