// src/services/passengers.service.ts
export type TaxData = {
    rfc: string
    business_name: string        // Razón social
    regime: string               // Régimen fiscal
    zip: string                  // CP
}

export type Passenger = {
    id: number
    name: string                 // Nombre
    email: string                // Correo
    phone: string                // Teléfono (E.164)
    trips_count: number          // Viajes realizados
    status: 'ACTIVE' | 'INACTIVE'
    created_at: string           // ISO
    tax: TaxData
}

const STORAGE_KEY = 'demo_passengers_module_v1'

function seed(): Passenger[] {
    const now = Date.now()
    const days = (n: number) => new Date(now - n * 86400000).toISOString()
    const base: Passenger[] = [
        {
            id: 1, name: 'Ana López', email: 'ana.lopez@example.com', phone: '+521331112223',
            trips_count: 21, status: 'ACTIVE', created_at: days(1),
            tax: { rfc: 'LOAA900101ABC', business_name: 'Ana López Servicios', regime: 'RÉGIMEN GENERAL', zip: '44100' },
        },
        {
            id: 2, name: 'Luis Pérez', email: 'luis.perez@example.com', phone: '+5213312345678',
            trips_count: 5, status: 'INACTIVE', created_at: days(3),
            tax: { rfc: 'PELU9203051H0', business_name: 'Comercial Pérez SA de CV', regime: 'RÉGIMEN GENERAL', zip: '06100' },
        },
        {
            id: 3, name: 'María García', email: 'maria.garcia@example.com', phone: '+5215522233344',
            trips_count: 48, status: 'ACTIVE', created_at: days(4),
            tax: { rfc: 'GAMM8507159K3', business_name: 'Consultoría García', regime: 'ASALARIADOS', zip: '03100' },
        },
        {
            id: 4, name: 'Jorge Ramírez', email: 'jorge.ramirez@example.com', phone: '+5215588877766',
            trips_count: 12, status: 'ACTIVE', created_at: days(6),
            tax: { rfc: 'RAJX8801018L2', business_name: 'Tecnologías JR', regime: 'RIF', zip: '20000' },
        },
        {
            id: 5, name: 'Lucía Fernández', email: 'lucia.fernandez@example.com', phone: '+5215599990000',
            trips_count: 2, status: 'INACTIVE', created_at: days(10),
            tax: { rfc: 'FELU9409127Z1', business_name: 'Diseño LF', regime: 'RÉGIMEN GENERAL', zip: '64000' },
        },
        {
            id: 6, name: 'Carlos Díaz', email: 'carlos.diaz@example.com', phone: '+5213333334444',
            trips_count: 31, status: 'ACTIVE', created_at: days(12),
            tax: { rfc: 'DICA8102045Q0', business_name: 'Transportes CD', regime: 'RIF', zip: '83200' },
        },
        {
            id: 7, name: 'Sofía Martínez', email: 'sofia.mtz@example.com', phone: '+5213310102020',
            trips_count: 7, status: 'ACTIVE', created_at: days(14),
            tax: { rfc: 'MASO950501A12', business_name: 'Sofía Martínez', regime: 'ASALARIADOS', zip: '76000' },
        },
        {
            id: 8, name: 'Pedro Torres', email: 'pedro.torres@example.com', phone: '+5215535353535',
            trips_count: 0, status: 'INACTIVE', created_at: days(18),
            tax: { rfc: 'TOPE9009109X9', business_name: 'Servicios Torres', regime: 'RÉGIMEN GENERAL', zip: '97100' },
        },
        {
            id: 9, name: 'Elena Rojas', email: 'elena.rojas@example.com', phone: '+5215555551212',
            trips_count: 16, status: 'ACTIVE', created_at: days(21),
            tax: { rfc: 'ROEL9303030Y8', business_name: 'Rojas y Asociados', regime: 'RÉGIMEN GENERAL', zip: '44190' },
        },
        {
            id: 10, name: 'Miguel Ángel', email: 'miguel.angel@example.com', phone: '+5214444444444',
            trips_count: 3, status: 'ACTIVE', created_at: days(25),
            tax: { rfc: 'AEMI901201AA1', business_name: 'MA Soluciones', regime: 'RIF', zip: '29000' },
        },
        {
            id: 11, name: 'Paula Núñez', email: 'paula.nunez@example.com', phone: '+5215550001111',
            trips_count: 64, status: 'ACTIVE', created_at: days(27),
            tax: { rfc: 'NUPA8809091P4', business_name: 'Núñez Consultores', regime: 'RÉGIMEN GENERAL', zip: '83000' },
        },
        {
            id: 12, name: 'Ricardo Soto', email: 'ricardo.soto@example.com', phone: '+5215570707070',
            trips_count: 9, status: 'INACTIVE', created_at: days(30),
            tax: { rfc: 'SORI8601017V2', business_name: 'RS Marketing', regime: 'ASALARIADOS', zip: '97302' },
        },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
    return base
}

function load(): Passenger[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    try { return JSON.parse(raw) as Passenger[] } catch { return seed() }
}
function save(items: Passenger[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const PassengersService = {
    async list(): Promise<Passenger[]> {
        return load().sort((a, b) => a.id - b.id)
    },
    async getById(id: number): Promise<Passenger | null> {
        return load().find(i => i.id === id) ?? null
    },
    async create(payload: Omit<Passenger, 'id' | 'created_at'>): Promise<Passenger> {
        const items = load()
        const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
        const created: Passenger = { id: nextId, created_at: new Date().toISOString(), ...payload }
        items.push(created); save(items)
        return created
    },
    async update(id: number, payload: Partial<Omit<Passenger, 'id' | 'created_at'>>): Promise<Passenger> {
        const items = load()
        const idx = items.findIndex(i => i.id === id)
        if (idx === -1) throw new Error('No encontrado')
        items[idx] = { ...items[idx], ...payload }
        save(items)
        return items[idx]
    },
    async remove(id: number): Promise<void> {
        save(load().filter(i => i.id !== id))
    },
}
