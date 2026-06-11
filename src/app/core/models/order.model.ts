export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type OrderSource = 'whatsapp' | 'manual';

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    qty: number;
}

export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    source: OrderSource;
    notes?: string;
    createdAt: string; // ISO string
}
