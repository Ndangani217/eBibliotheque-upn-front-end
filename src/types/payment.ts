export enum VoucherStatus {
    EN_ATTENTE = 'en_attente',
    PAYE = 'paye',
    EXPIRE = 'expire',
    ANNULE = 'annule',
}

export interface Payment {
    id: string
    referenceCode: string
    subscriberName: string
    category?: string
    amount: string
    status: VoucherStatus
    createdAt: string
    validatedAt?: string
}

export interface PaginationMeta {
    total: number
    per_page: number
    current_page: number
    last_page: number
}

export interface PaymentQueryResult {
    items: Payment[]
    meta: PaginationMeta
}
