import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { AdminOrderService } from '../../features/admin/services/admin-order.service';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
    private readonly phone = '+917593016782';

    constructor(private orderSvc: AdminOrderService) {}

    createBuyLink(product: Product): string {
        const msg = `Hi! I need help with this coupon from Coupon Villa:\n\n` +
            `*Brand:* ` + product.brand + `\n` +
            `*Deal:* ` + product.name + `\n` +
            `*Coupon Code:* ` + product.code + `\n` +
            `*Discount:* ` + product.discount + `% OFF\n\n` +
            `Please assist me in using this coupon.`;
        return `https://wa.me/` + this.phone + `?text=` + encodeURIComponent(msg);
    }

    openWhatsapp(product: Product): void {
        this.orderSvc.logWhatsappOrder(product.id, product.name, product.price);
        window.open(this.createBuyLink(product), '_blank', 'noopener,noreferrer');
    }
}
