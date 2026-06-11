import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { WhatsappService } from '../../../../core/services/whatsapp.service';
@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  product = signal<Product | null>(null);
  notFound = signal(false);
  isLoading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private whatsappService: WhatsappService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.productService.getBySlugAsync(slug).then(found => {
      if (found) this.product.set(found);
      else this.notFound.set(true);
      this.isLoading.set(false);
    });
  }

  buyNow() {
    if (this.product()) this.whatsappService.openWhatsapp(this.product()!);
  }
}
