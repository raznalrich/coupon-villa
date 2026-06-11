import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout';
import { authGuard } from './guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.AdminLogin)
    },
    {
        path: '',
        component: AdminLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.AdminDashboard)
            },
            {
                path: 'products',
                loadComponent: () => import('./pages/products/admin-products').then(m => m.AdminProducts)
            },
            {
                path: 'orders',
                loadComponent: () => import('./pages/orders/admin-orders').then(m => m.AdminOrders)
            },
            {
                path: 'categories',
                loadComponent: () => import('./pages/categories/admin-categories').then(m => m.AdminCategories)
            }
        ]
    }
];
