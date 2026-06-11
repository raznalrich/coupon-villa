import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../services/admin-product.service';
import { Product } from '../../../../core/models/product.model';

type Mode = 'list' | 'add' | 'edit';

const blankProduct = (): Product => ({
  id: '',
  slug: '',
  name: '',
  shortDescription: '',
  description: '',
  price: 0,
  currency: 'INR',
  images: [''],
  brand: '',
  brandColor: '#e84350',
  category: '',
  badge: '',
  discount: 0,
  code: '',
  minOrder: 0,
  expiryDate: '',
  isActive: true,
});

@Component({
  selector: 'app-admin-products',
  imports: [FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss'
})
export class AdminProducts {
  mode = signal<Mode>('list');
  form = signal<Product>(blankProduct());
  search = signal('');
  isSaving = signal(false);
  imageUploading = signal(false);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    return this.productSvc.products().filter((p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q)
    );
  });

  constructor(public productSvc: AdminProductService) {}

  openAdd() {
    this.form.set(blankProduct());
    this.mode.set('add');
  }

  openEdit(p: Product) {
    this.form.set({
      ...blankProduct(),
      ...p,
      images: p.images?.length ? [...p.images] : ['']
    });
    this.mode.set('edit');
  }

  cancel() {
    this.mode.set('list');
  }

  slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async save() {
    const f = { ...this.form() };

    if (!f.name.trim() || !f.brand?.trim() || !f.category.trim()) return;
    if (!f.discount || f.discount <= 0) return;
    if (!f.code?.trim()) return;

    this.isSaving.set(true);

    try {
      f.slug = this.slugify(f.name);

      if (!f.images?.length || !f.images[0]) {
        f.images = [''];
      }

      if (this.mode() === 'add') {
        f.id = '';
        await this.productSvc.addProduct(f);
      } else {
        await this.productSvc.updateProduct(f);
      }

      this.mode.set('list');
    } catch (e) {
      alert('Save failed: ' + (e as Error).message);
    } finally {
      this.isSaving.set(false);
    }
  }

  async delete(id: string) {
    if (confirm('Delete this coupon?')) {
      await this.productSvc.deleteProduct(id);
    }
  }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.imageUploading.set(true);

    const url = await this.productSvc.uploadImage(file);

    if (url) {
      this.form.update(f => ({ ...f, images: [url] }));
    } else {
      alert('Image upload failed. Check the browser console (F12) for the exact Supabase error.');
    }

    this.imageUploading.set(false);
  }
}