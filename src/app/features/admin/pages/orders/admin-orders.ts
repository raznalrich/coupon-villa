import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe, SlicePipe } from '@angular/common';
import { AdminOrderService } from '../../services/admin-order.service';
import { AdminProductService } from '../../services/admin-product.service';
import { Order, OrderItem, OrderStatus } from '../../../../core/models/order.model';

type Mode = 'list' | 'add' | 'edit';

const blankOrder = (): Omit<Order, 'id' | 'createdAt'> => ({
    customerName: '', customerPhone: '', customerAddress: '',
    items: [], total: 0, status: 'pending', source: 'manual', notes: ''
});

@Component({
    selector: 'app-admin-orders',
    imports: [FormsModule, TitleCasePipe, SlicePipe],
    templateUrl: './admin-orders.html',
    styleUrl: './admin-orders.scss'
})
export class AdminOrders {
    mode = signal<Mode>('list');
    form = signal(blankOrder());
    editingId = signal('');

    filterStatus = signal<string>('all');
    search = signal('');

    statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    // for adding items inside the form
    selectedProductId = signal('');
    selectedQty = signal(1);

    filtered = computed(() => {
        const st = this.filterStatus();
        const q = this.search().toLowerCase();
        return this.orderSvc.orders().filter(o => {
            const matchStatus = st === 'all' || o.status === st;
            const matchQ = !q || o.customerName.toLowerCase().includes(q) ||
                o.id.toLowerCase().includes(q) ||
                o.items.some(i => i.productName.toLowerCase().includes(q));
            return matchStatus && matchQ;
        });
    });

    constructor(
        public orderSvc: AdminOrderService,
        public productSvc: AdminProductService
    ) {}

    openAdd() {
        this.form.set(blankOrder());
        this.editingId.set('');
        this.mode.set('add');
    }

    openEdit(o: Order) {
        const { id, createdAt, ...rest } = o;
        this.form.set({ ...rest, items: o.items.map(i => ({ ...i })) });
        this.editingId.set(id);
        this.mode.set('edit');
    }

    cancel() { this.mode.set('list'); }

    addItem() {
        const pid = this.selectedProductId();
        if (!pid) return;
        const product = this.productSvc.products().find(p => p.id === pid);
        if (!product) return;
        const qty = this.selectedQty();
        const item: OrderItem = {
            productId: product.id, productName: product.name,
            price: product.price, qty
        };
        this.form.update(f => {
            const items = [...f.items, item];
            return { ...f, items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
        });
        this.selectedProductId.set('');
        this.selectedQty.set(1);
    }

    removeItem(idx: number) {
        this.form.update(f => {
            const items = f.items.filter((_, i) => i !== idx);
            return { ...f, items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
        });
    }

    async save() {
        const f = this.form();
        if (!f.customerName.trim()) return;
        if (this.mode() === 'add') {
            await this.orderSvc.addOrder(f);
        } else {
            const existing = this.orderSvc.orders().find(o => o.id === this.editingId());
            await this.orderSvc.updateOrder({ ...f, id: this.editingId(), createdAt: existing?.createdAt ?? '' });
        }
        this.mode.set('list');
    }

    async delete(id: string) {
        if (confirm('Delete this order?')) await this.orderSvc.deleteOrder(id);
    }

    async updateStatus(id: string, status: string) {
        await this.orderSvc.updateStatus(id, status as OrderStatus);
    }

    statusColor(status: string) {
        const map: Record<string, string> = {
            pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6',
            delivered: '#10b981', cancelled: '#ef4444'
        };
        return map[status] ?? '#666';
    }
}
