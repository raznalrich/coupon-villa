import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

const AUTH_KEY = 'ayur_admin_auth';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
    isLoggedIn = signal<boolean>(false);

    constructor(private router: Router) {
        this.isLoggedIn.set(sessionStorage.getItem(AUTH_KEY) === 'true');
    }

    login(username: string, password: string): boolean {
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            this.isLoggedIn.set(true);
            return true;
        }
        return false;
    }

    logout(): void {
        sessionStorage.removeItem(AUTH_KEY);
        this.isLoggedIn.set(false);
        this.router.navigate(['/admin/login']);
    }
}
