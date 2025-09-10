// src/services/referrals.service.ts
export type RedeemedDetail = {
    id: number
    product_id: number
    product_name: string
    points_spent: number
    created_at: string
}
export type TripDetail = {
    id: number
    passenger_name: string
    trip_title: string             // viaje para el pasajero
    origin: string                 // ORIGEN
    destination: string            // DESTINO
    duration_min: number           // TIEMPO (min)
    km: number                     // KM
    points_generated: number
    created_at: string
}
export type Referral = {
    id: number
    operator_name: string
    email: string
    phone: string                  // E.164
    program_level: 'Oro' | 'Plata' | 'Platino'
    status: 'ACTIVE' | 'INACTIVE'
    created_at: string
    redeemed: RedeemedDetail[]
    trips: TripDetail[]
}

const STORAGE_KEY = 'demo_referrals_v2'

function seed(): Referral[] {
    const now = Date.now(), days = (n: number) => new Date(now - n * 86400000).toISOString()
    const base: Referral[] = [
        {
            id: 1, operator_name: 'José Hernández', email: 'jose.hdz@example.com', phone: '+5213311111111',
            program_level: 'Oro', status: 'ACTIVE', created_at: days(1),
            redeemed: [
                { id: 1, product_id: 1, product_name: 'Tarjeta Regalo $200', points_spent: 2000, created_at: days(1) },
                { id: 2, product_id: 2, product_name: 'Playera Oficial', points_spent: 800, created_at: days(2) },
            ],
            trips: [
                { id: 1, passenger_name: 'Ana López', trip_title: 'Aeropuerto', origin: 'Centro', destination: 'GDL Airport', duration_min: 45, km: 25, points_generated: 120, created_at: days(3) },
                { id: 2, passenger_name: 'Luis Pérez', trip_title: 'Hotel', origin: 'Aeropuerto', destination: 'Hotel Roma', duration_min: 35, km: 18, points_generated: 90, created_at: days(4) },
            ],
        },
        {
            id: 2, operator_name: 'María Torres', email: 'maria.torres@example.com', phone: '+5213322222222',
            program_level: 'Plata', status: 'INACTIVE', created_at: days(5),
            redeemed: [],
            trips: [
                { id: 1, passenger_name: 'Jorge Díaz', trip_title: 'Oficina', origin: 'Casa', destination: 'Oficinas Centro', duration_min: 25, km: 9, points_generated: 45, created_at: days(5) },
            ],
        },
        {
            id: 3, operator_name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', phone: '+5213333333333',
            program_level: 'Platino', status: 'ACTIVE', created_at: days(8),
            redeemed: [{ id: 1, product_id: 3, product_name: 'Válvula Premium', points_spent: 1200, created_at: days(8) }],
            trips: [],
        },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
    return base
}
function load(): Referral[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    try { return JSON.parse(raw) as Referral[] } catch { return seed() }
}
function save(items: Referral[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }

export const ReferralsService = {
    async list() { return load().sort((a, b) => a.id - b.id) },
    async getById(id: number) { return load().find(i => i.id === id) ?? null },
    async create(payload: Omit<Referral, 'id' | 'created_at'>): Promise<Referral> {
        const items = load()
        const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
        const created: Referral = { id: nextId, created_at: new Date().toISOString(), ...payload }
        items.push(created); save(items); return created
    },
    async update(id: number, payload: Partial<Omit<Referral, 'id' | 'created_at'>>) {
        const items = load(); const idx = items.findIndex(i => i.id === id)
        if (idx === -1) throw new Error('No encontrado')
        items[idx] = { ...items[idx], ...payload } as Referral
        save(items); return items[idx]
    },
    async remove(id: number) { save(load().filter(i => i.id !== id)) },
}
