import { Component, computed } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterLink, RouterLinkActive, NgIf, MatListModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userName = computed(() => this.authService.currentUser?.value?.username);

  constructor(private authService: AuthService) {}

  get isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  onLogout() {
    if (this.isAuthenticated) {
      this.authService.logout();
    }
  }
}
