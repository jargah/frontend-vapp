export type Row = {
    id: number
    name: string
    email: string
    role: 'Admin' | 'Editor' | 'Viewer' | string
    status: boolean
    createdAt: string
    notes?: string
}
