export interface PaymentMethod {
    id: string;
    created_at: string;
    name: string;
    type: 'qr' | 'bank_transfer';
    account_name: string;
    account_number: string;
    cci?: string;
    qr_url?: string;
    instructions?: string;
    is_active: boolean;
}
