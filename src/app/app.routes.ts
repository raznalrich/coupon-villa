import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home').then(m => m.Home)
    },
    {
        path: 'products',
        loadChildren: () =>
            import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES)
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    }
];
