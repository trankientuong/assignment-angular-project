import { Injectable, OnDestroy } from '@angular/core';
import { ProductCart } from './product.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartService implements OnDestroy {
    private readonly storageKey = 'cartsItems';
    productsInCart: ProductCart[] = [];
    private userName? = '';
    private authSubscription: Subscription;

    constructor(private authService: AuthService) {
        this.authSubscription = this.authService.currentUser.subscribe((user) => {
            console.log('Auth state changed:', user);
            this.userName = user?.username ?? 'guest';
            this.loadCartForCurrentUser();
        });
    }

    addCart(productCart: ProductCart): void {
        productCart.userName = this.userName;
        console.log('Adding to cart:', productCart);

        // Load all carts from localStorage
        let storedCart = this.getCartFromLocalStorage();

        // Update the cart for the current user
        const existingProductIndex = this.productsInCart.findIndex(
            (p) => p.id === productCart.id
        );

        if (existingProductIndex === -1) {
            this.productsInCart = [...this.productsInCart, productCart];
        } else {
            this.productsInCart[existingProductIndex].quantity += productCart.quantity;
        }

        console.log('Updated cart:', this.productsInCart);

        storedCart = storedCart.filter((c) => c.userName !== this.userName);

        storedCart.push(...this.productsInCart);

        this.saveCartToLocalStorage(storedCart);
    }

    private getCartFromLocalStorage(): ProductCart[] {
        const storedCart = localStorage.getItem(this.storageKey);
        return storedCart ? JSON.parse(storedCart) : [];
    }

    private saveCartToLocalStorage(carts: ProductCart[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(carts));
    }

    private loadCartForCurrentUser(): void {
        const currentUserName = this.userName;
        console.log('Loading cart for:', currentUserName);

        const storedCart = localStorage.getItem(this.storageKey);
        if (storedCart) {
            const productsInCart: ProductCart[] = JSON.parse(storedCart);
            this.productsInCart = productsInCart.filter(
                (c) => c.userName === currentUserName
            );
            console.log('Cart loaded:', this.productsInCart);
        } else {
            this.productsInCart = [];
            console.log('No cart found, starting with an empty cart.');
        }
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}
