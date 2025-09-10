// src/services/operators.service.ts
export type TaxData = {
    rfc: string
    business_name: string        // Razón social
    regime: string               // Régimen fiscal
    zip: string                  // CP
}

export type VehicleData = {
    plates: string               // Placas
    color: string                // Color vehículo
    year: number                 // Año
    mileage: number              // Kilometraje
}

export type Operator = {
    id: number
    name: string                 // Nombre
    email: string                // Correo
    phone: string                // Teléfono (E.164)
    status: 'ACTIVE' | 'INACTIVE'
    created_at: string           // ISO
    tax: TaxData
    vehicle: VehicleData
}

const STORAGE_KEY = 'demo_operators_module_v1'

function seed(): Operator[] {
    const now = Date.now()
    const days = (n: number) => new Date(now - n * 86400000).toISOString()
    const base: Operator[] = [
        {
            id: 1, name: 'José Hernández', email: 'jose.hdz@example.com', phone: '+5213311111111',
            status: 'ACTIVE', created_at: days(2),
            tax: { rfc: 'HEJJ900101AB1', business_name: 'Transportes JH', regime: 'RÉGIMEN GENERAL', zip: '44100' },
            vehicle: { plates: 'JKS-1201', color: 'Blanco', year: 2019, mileage: 84500 },
        },
        {
            id: 2, name: 'María Torres', email: 'maria.torres@example.com', phone: '+5213322222222',
            status: 'INACTIVE', created_at: days(5),
            tax: { rfc: 'TOMA9203051K2', business_name: 'Servicios MT', regime: 'RIF', zip: '06100' },
            vehicle: { plates: 'MTX-9087', color: 'Rojo', year: 2017, mileage: 132000 },
        },
        {
            id: 3, name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', phone: '+5213333333333',
            status: 'ACTIVE', created_at: days(8),
            tax: { rfc: 'RUCA8507158Z9', business_name: 'CR Logística', regime: 'RÉGIMEN GENERAL', zip: '64000' },
            vehicle: { plates: 'CRZ-3344', color: 'Negro', year: 2020, mileage: 56000 },
        },
        {
            id: 4, name: 'Laura Gómez', email: 'laura.gomez@example.com', phone: '+5213344444444',
            status: 'ACTIVE', created_at: days(10),
            tax: { rfc: 'GOLA9009107S2', business_name: 'LG Operaciones', regime: 'ASALARIADOS', zip: '03100' },
            vehicle: { plates: 'LG-2020', color: 'Gris', year: 2021, mileage: 31000 },
        },
        {
            id: 5, name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', phone: '+5213355555555',
            status: 'INACTIVE', created_at: days(14),
            tax: { rfc: 'SAPX8801016L7', business_name: 'PS Servicios', regime: 'RIF', zip: '76000' },
            vehicle: { plates: 'PS-7788', color: 'Azul', year: 2015, mileage: 180500 },
        },
        {
            id: 6, name: 'Diana López', email: 'diana.lopez@example.com', phone: '+5213366666666',
            status: 'ACTIVE', created_at: days(18),
            tax: { rfc: 'LODI9409123W1', business_name: 'DL Transporte', regime: 'RÉGIMEN GENERAL', zip: '20000' },
            vehicle: { plates: 'DL-4512', color: 'Blanco', year: 2018, mileage: 99000 },
        },
        {
            id: 7, name: 'Miguel Ortega', email: 'miguel.ortega@example.com', phone: '+5213377777777',
            status: 'ACTIVE', created_at: days(22),
            tax: { rfc: 'ORMI901201AA1', business_name: 'MO Fletes', regime: 'RIF', zip: '83200' },
            vehicle: { plates: 'MO-6590', color: 'Rojo', year: 2016, mileage: 150300 },
        },
        {
            id: 8, name: 'Elena Ramírez', email: 'elena.ramirez@example.com', phone: '+5213388888888',
            status: 'INACTIVE', created_at: days(26),
            tax: { rfc: 'RAEL9303030Y8', business_name: 'ER Servicios', regime: 'ASALARIADOS', zip: '97302' },
            vehicle: { plates: 'ER-1023', color: 'Negro', year: 2014, mileage: 220000 },
        },
        {
            id: 9, name: 'Sergio Vázquez', email: 'sergio.vazquez@example.com', phone: '+5213399999999',
            status: 'ACTIVE', created_at: days(28),
            tax: { rfc: 'VASE8809091P4', business_name: 'SV Operaciones', regime: 'RÉGIMEN GENERAL', zip: '97100' },
            vehicle: { plates: 'SV-7841', color: 'Gris', year: 2022, mileage: 19000 },
        },
        {
            id: 10, name: 'Paola Núñez', email: 'paola.nunez@example.com', phone: '+5213310101010',
            status: 'ACTIVE', created_at: days(30),
            tax: { rfc: 'NUPA9101017V2', business_name: 'PN Logística', regime: 'RÉGIMEN GENERAL', zip: '44190' },
            vehicle: { plates: 'PN-9001', color: 'Blanco', year: 2023, mileage: 12000 },
        },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
    return base
}

function load(): Operator[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    try { return JSON.parse(raw) as Operator[] } catch { return seed() }
}
function save(items: Operator[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const OperatorsService = {
    async list(): Promise<Operator[]> {
        return load().sort((a, b) => a.id - b.id)
    },
    async getById(id: number): Promise<Operator | null> {
        return load().find(i => i.id === id) ?? null
    },
    async create(payload: Omit<Operator, 'id' | 'created_at'>): Promise<Operator> {
        const items = load()
        const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
        const created: Operator = { id: nextId, created_at: new Date().toISOString(), ...payload }
        items.push(created); save(items)
        return created
    },
    async update(id: number, payload: Partial<Omit<Operator, 'id' | 'created_at'>>): Promise<Operator> {
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
