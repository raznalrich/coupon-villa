import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { WhatsappService } from '../../../../core/services/whatsapp.service';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit, OnDestroy {
 ngAfterViewInit(): void {
    this.loadAdCash();
  }

  product = signal<Product | null>(null);
  notFound = signal(false);
  isLoading = signal(true);

  showCodeModal = signal(false);
  codeUnlocked = signal(false);
  countdown = signal(5);
  copied = signal(false);

  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private autoUnlockTimer: ReturnType<typeof setTimeout> | null = null;
    private adLoaded = false;

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

  openCodeModal() {
    if (this.codeUnlocked()) return;

    this.showCodeModal.set(true);
    this.countdown.set(5);

    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.autoUnlockTimer) clearTimeout(this.autoUnlockTimer);

    this.countdownTimer = setInterval(() => {
      const value = this.countdown();
      if (value > 0) {
        this.countdown.set(value - 1);
      }
    }, 1000);

    this.autoUnlockTimer = setTimeout(() => {
      this.unlockCode();
    }, 5000);
  }

    loadAdCash() {
    if (this.adLoaded) return;

    const win = window as any;

    if (win.aclib && typeof win.aclib.runInterstitial === 'function') {
      win.aclib.runInterstitial({
        zoneId: '11526178'
      });
      this.adLoaded = true;
      return;
    }

    if ((window as any).aclib) {
      (window as any).aclib.runInterstitial({
        zoneId: '11526178'
      });
      this.adLoaded = true;
    }
  }

  unlockCode() {
    this.codeUnlocked.set(true);
    this.showCodeModal.set(false);

    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    if (this.autoUnlockTimer) {
      clearTimeout(this.autoUnlockTimer);
      this.autoUnlockTimer = null;
    }
  }

  closeModalIfAllowed() {
    if (this.countdown() > 0) return;
    this.showCodeModal.set(false);
  }

  copyCode() {
    const code = this.product()?.code;
    if (!code || !navigator?.clipboard) return;

    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  buyNow() {
    if (this.product()) this.whatsappService.openWhatsapp(this.product()!);
  }

  ngOnDestroy() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.autoUnlockTimer) clearTimeout(this.autoUnlockTimer);
  }
}