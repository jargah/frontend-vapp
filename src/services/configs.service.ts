// src/services/configs.service.ts
export type ConfigItem = {
    id: number
    name: string       // Nombre
    value: string      // Valor
    status: 'ACTIVE' | 'INACTIVE' // Status
    created_at: string // Creación ISO
}

const STORAGE_KEY = 'demo_configs_module_v1'

function seed(): ConfigItem[] {
    const now = Date.now()
    const days = (n: number) => new Date(now - n * 86400000).toISOString()
    const base: ConfigItem[] = [
        { id: 1, name: 'SITE_TITLE', value: 'Mi ERP', status: 'ACTIVE', created_at: days(1) },
        { id: 2, name: 'MAX_LOGIN_ATTEMPTS', value: '5', status: 'ACTIVE', created_at: days(3) },
        { id: 3, name: 'MAINTENANCE_MODE', value: 'false', status: 'INACTIVE', created_at: days(5) },
        { id: 4, name: 'DEFAULT_LANGUAGE', value: 'es-MX', status: 'ACTIVE', created_at: days(8) },
        { id: 5, name: 'CURRENCY', value: 'MXN', status: 'ACTIVE', created_at: days(10) },
        { id: 6, name: 'SMTP_HOST', value: 'smtp.demo.com', status: 'ACTIVE', created_at: days(12) },
        { id: 7, name: 'SMTP_PORT', value: '587', status: 'ACTIVE', created_at: days(12) },
        { id: 8, name: 'SMTP_SECURE', value: 'true', status: 'ACTIVE', created_at: days(12) },
        { id: 9, name: 'SUPPORT_EMAIL', value: 'soporte@demo.com', status: 'ACTIVE', created_at: days(15) },
        { id: 10, name: 'THEME', value: 'light', status: 'ACTIVE', created_at: days(18) },
        { id: 11, name: 'FEATURE_X', value: 'enabled', status: 'INACTIVE', created_at: days(20) },
        { id: 12, name: 'API_RATE_LIMIT', value: '1000/min', status: 'ACTIVE', created_at: days(21) },
        { id: 13, name: 'LOG_LEVEL', value: 'info', status: 'ACTIVE', created_at: days(23) },
        { id: 14, name: 'SESSION_TTL', value: '3600', status: 'ACTIVE', created_at: days(25) },
        { id: 15, name: 'ALLOW_REGISTRATION', value: 'false', status: 'INACTIVE', created_at: days(28) },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
    return base
}

function load(): ConfigItem[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    try { return JSON.parse(raw) as ConfigItem[] } catch { return seed() }
}
function save(items: ConfigItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const ConfigsService = {
    async list(): Promise<ConfigItem[]> {
        return load().sort((a, b) => a.id - b.id)
    },
    async getById(id: number): Promise<ConfigItem | null> {
        const items = load()
        return items.find(i => i.id === id) ?? null
    },
    async create(payload: Omit<ConfigItem, 'id' | 'created_at'>): Promise<ConfigItem> {
        const items = load()
        const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
        const created: ConfigItem = { id: nextId, created_at: new Date().toISOString(), ...payload }
        items.push(created)
        save(items)
        return created
    },
    async update(id: number, payload: Partial<Omit<ConfigItem, 'id' | 'created_at'>>): Promise<ConfigItem> {
        const items = load()
        const idx = items.findIndex(i => i.id === id)
        if (idx === -1) throw new Error('No encontrado')
        items[idx] = { ...items[idx], ...payload }
        save(items)
        return items[idx]
    },
    async remove(id: number): Promise<void> {
        const items = load().filter(i => i.id !== id)
        save(items)
    },
}
