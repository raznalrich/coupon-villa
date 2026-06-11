import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
    selector: 'app-admin-login',
    imports: [FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class AdminLogin {
    username = '';
    password = '';
    error = signal('');
    loading = signal(false);

    constructor(private auth: AdminAuthService, private router: Router) {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/admin/dashboard']);
        }
    }

    submit() {
        this.error.set('');
        this.loading.set(true);
        setTimeout(() => {
            const ok = this.auth.login(this.username.trim(), this.password);
            if (ok) {
                this.router.navigate(['/admin/dashboard']);
            } else {
                this.error.set('Invalid username or password.');
            }
            this.loading.set(false);
        }, 400);
    }
}
