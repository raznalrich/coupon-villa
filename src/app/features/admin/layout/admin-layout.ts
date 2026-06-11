import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
    selector: 'app-admin-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.scss'
})
export class AdminLayout {
    constructor(public auth: AdminAuthService) {}
}
