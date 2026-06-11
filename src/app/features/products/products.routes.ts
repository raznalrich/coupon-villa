import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list')
        .then(m => m.ProductList)
  },
  {
    path: 'customize',
    loadComponent: () =>
      import('./pages/neon-cutomizer/neon-cutomizer')
        .then(m => m.NeonCutomizer)
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./pages/product-details/product-details')
        .then(m => m.ProductDetails)
  }
];  