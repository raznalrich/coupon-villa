import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { AdminProductService } from '../../services/admin-product.service';
import { AdminOrderService } from '../../services/admin-order.service';

@Component({
    selector: 'app-admin-dashboard',
    imports: [RouterLink, SlicePipe],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class AdminDashboard {
    constructor(
        public productSvc: AdminProductService,
        public orderSvc: AdminOrderService
    ) {}

    totalProducts  = computed(() => this.productSvc.products().length);
    activeProducts = computed(() => this.productSvc.products().filter(p => p.isActive).length);
    totalOrders    = computed(() => this.orderSvc.orders().length);
    pendingOrders  = computed(() => this.orderSvc.orders().filter(o => o.status === 'pending').length);
    waOrders       = computed(() => this.orderSvc.orders().filter(o => o.source === 'whatsapp').length);
    totalRevenue   = computed(() =>
        this.orderSvc.orders()
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0)
    );

    recentOrders = computed(() => this.orderSvc.orders().slice(0, 5));

    statusColor(status: string) {
        const map: Record<string, string> = {
            pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6',
            delivered: '#10b981', cancelled: '#ef4444'
        };
        return map[status] ?? '#666';
    }
}
