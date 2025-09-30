export type Row = {
    id: number
    name: string
    email: string
    role: 'Admin' | 'Editor' | 'Viewer' | string
    status: boolean
    createdAt: string
    notes?: string
}


export type DatatableParams = {
    database: boolean
    page: number
    rows: number
    search: string
    order_by: string = 'id'
    order_asc: boolean
}