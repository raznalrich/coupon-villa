import { Injectable, signal, inject } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { SupabaseService } from '../../../core/services/supabase.service';

interface DbProduct {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  code: string | null;
  brand: string | null;
  brand_color: string | null;
  expiry_date: string | null;
  min_order: number | null;
  currency: string;
  images: string[];
  category: string;
  badge: string | null;
  is_active: boolean;
}

function toProduct(row: DbProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    discount: row.discount ?? undefined,
    code: row.code ?? undefined,
    brand: row.brand ?? undefined,
    brandColor: row.brand_color ?? undefined,
    expiryDate: row.expiry_date ?? undefined,
    minOrder: row.min_order ?? undefined,
    currency: (row.currency as 'INR') || 'INR',
    images: row.images || [],
    category: row.category,
    badge: row.badge ?? undefined,
    isActive: row.is_active,
  };
}

function toRow(p: Product): Omit<DbProduct, 'id'> {
  return {
    slug: p.slug,
    name: p.name,
    short_description: p.shortDescription,
    description: p.description,
    price: p.price,
    original_price: p.originalPrice ?? null,
    discount: p.discount ?? null,
    code: p.code || null,
    brand: p.brand || null,
    brand_color: p.brandColor || null,
    expiry_date: p.expiryDate || null,
    min_order: p.minOrder ?? null,
    currency: p.currency,
    images: p.images,
    category: p.category,
    badge: p.badge || null,
    is_active: p.isActive,
  };
}

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private supabase = inject(SupabaseService);

  private _products = signal<Product[]>([]);
  private _categories = signal<string[]>([]);
  readonly isLoading = signal(false);
  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();

  constructor() {
    this.load();
    this.loadCategories();
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    const { data, error } = await this.supabase.client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      const list = (data as DbProduct[]).map(toProduct);
      this._products.set(list);
      this._refreshCategories();
    }
    this.isLoading.set(false);
  }

  async addProduct(product: Product): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('products')
      .insert(toRow(product))
      .select()
      .single();
    if (!error && data) {
      this._products.update(list => [toProduct(data as DbProduct), ...list]);
      this._refreshCategories();
    } else if (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(updated: Product): Promise<void> {
    const { error } = await this.supabase.client
      .from('products')
      .update(toRow(updated))
      .eq('id', updated.id);
    if (!error) {
      this._products.update(list => list.map(p => p.id === updated.id ? updated : p));
      this._refreshCategories();
    } else {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('products')
      .delete()
      .eq('id', id);
    if (!error) {
      this._products.update(list => list.filter(p => p.id !== id));
      this._refreshCategories();
    } else {
      throw new Error(error.message);
    }
  }

  async uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await this.supabase.client.storage
      .from('product-images')
      .upload(path, file, { upsert: false });
    if (error) {
      console.error('Storage upload error:', error.message);
      return null;
    }
    const { data } = this.supabase.client.storage
      .from('product-images')
      .getPublicUrl(path);
    return data.publicUrl;
  }

  private _refreshCategories() {
    const cats = [...new Set(this._products().map(p => p.category))].filter(Boolean);
    // Merge DB categories with any that exist in products
    const merged = [...new Set([...this._categories(), ...cats])].filter(Boolean).sort();
    this._categories.set(merged);
  }

  async loadCategories(): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .select('name')
      .order('name');
    if (!error && data) {
      this._categories.set(data.map((r: { name: string }) => r.name));
    }
  }

  async addCategory(name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed || this._categories().includes(trimmed)) return;
    const { error } = await this.supabase.client
      .from('categories')
      .insert({ name: trimmed });
    if (!error) {
      this._categories.update(c => [...c, trimmed].sort());
    } else {
      throw new Error(error.message);
    }
  }

  async deleteCategory(name: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('categories')
      .delete()
      .eq('name', name);
    if (!error) {
      this._categories.update(c => c.filter(x => x !== name));
    } else {
      throw new Error(error.message);
    }
  }

  async renameCategory(oldName: string, newName: string): Promise<void> {
    const trimmed = newName.trim();
    if (!trimmed) return;
    // Rename in categories table
    const { error: catError } = await this.supabase.client
      .from('categories')
      .update({ name: trimmed })
      .eq('name', oldName);
    // Also update all products using this category
    const { error: prodError } = await this.supabase.client
      .from('products')
      .update({ category: trimmed })
      .eq('category', oldName);
    if (!catError && !prodError) {
      this._products.update(list =>
        list.map(p => p.category === oldName ? { ...p, category: trimmed } : p)
      );
      this._categories.update(c => c.map(x => x === oldName ? trimmed : x));
    } else {
      throw new Error((catError ?? prodError)!.message);
    }
  }
}