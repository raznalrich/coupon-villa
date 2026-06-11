import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  isCopied = false;

  copyCode(): void {
    if (navigator?.clipboard && this.product.code) {
      navigator.clipboard.writeText(this.product.code).then(() => {
        this.isCopied = true;
        setTimeout(() => { this.isCopied = false; }, 2000);
      });
    }
  }
}
