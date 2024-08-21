import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';
import { ProductCart } from '../services/product.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterLink, RouterLinkActive, CommonModule, MatListModule, AsyncPipe, CurrencyPipe, FlexLayoutModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  productsInCart: ProductCart[] = [];
  totalProductsInCart: number = 0;
  private destroyRef = inject(DestroyRef);
  // userName = computed(() => this.authService.currentUser.value.userName);
  totalCost?: number;

  constructor(public authService: AuthService,private cartService: CartService) {}

  get isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    const cartSubscription = this.cartService.productsInCart$.subscribe((products) => {
      this.productsInCart = products;
      this.totalProductsInCart = products.length;
      this.totalCost = this.productsInCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    this.destroyRef.onDestroy(() => {
      cartSubscription.unsubscribe();
    });
  }

  onLogout() {
    if (this.isAuthenticated) {
      this.authService.logout();
    }
  }
}
