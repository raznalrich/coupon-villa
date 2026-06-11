import { Injectable, signal, inject } from '@angular/core';
import { Order, OrderItem } from '../../../core/models/order.model';
import { SupabaseService } from '../../../core/services/supabase.service';

interface DbOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  status: string;
  source: string;
  notes: string | null;
  created_at: string;
}

function toOrder(row: DbOrder): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    items: row.items || [],
    total: row.total,
    status: row.status as Order['status'],
    source: row.source as Order['source'],
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private supabase = inject(SupabaseService);

  private _orders = signal<Order[]>([]);
  readonly isLoading = signal(false);
  readonly orders = this._orders.asReadonly();

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    const { data, error } = await this.supabase.client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      this._orders.set((data as DbOrder[]).map(toOrder));
    }
    this.isLoading.set(false);
  }

  async addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const { data, error } = await this.supabase.client
      .from('orders')
      .insert({
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_address: order.customerAddress,
        items: order.items,
        total: order.total,
        status: order.status,
        source: order.source,
        notes: order.notes || null,
      })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message ?? 'Failed to create order');
    const newOrder = toOrder(data as DbOrder);
    this._orders.update(list => [newOrder, ...list]);
    return newOrder;
  }

  async logWhatsappOrder(productId: string, productName: string, price: number): Promise<void> {
    const item: OrderItem = { productId, productName, price, qty: 1 };
    await this.addOrder({
      customerName: 'WhatsApp Lead',
      customerPhone: '',
      customerAddress: '',
      items: [item],
      total: price,
      status: 'pending',
      source: 'whatsapp',
      notes: '',
    });
  }

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await this.supabase.client
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (!error) {
      this._orders.update(list => list.map(o => o.id === id ? { ...o, status } : o));
    }
  }

  async updateOrder(updated: Order): Promise<void> {
    const { error } = await this.supabase.client
      .from('orders')
      .update({
        customer_name: updated.customerName,
        customer_phone: updated.customerPhone,
        customer_address: updated.customerAddress,
        items: updated.items,
        total: updated.total,
        status: updated.status,
        source: updated.source,
        notes: updated.notes || null,
      })
      .eq('id', updated.id);
    if (!error) {
      this._orders.update(list => list.map(o => o.id === updated.id ? updated : o));
    }
  }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('orders')
      .delete()
      .eq('id', id);
    if (!error) {
      this._orders.update(list => list.filter(o => o.id !== id));
    }
  }
}
