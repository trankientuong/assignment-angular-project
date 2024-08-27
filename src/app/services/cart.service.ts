import { Injectable, OnDestroy } from '@angular/core';
import { ProductCart } from './product.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartService implements OnDestroy {
    private readonly storageKey = 'cartsItems';
    private productsInCartSubject = new BehaviorSubject<ProductCart[]>([]);
    productsInCart$ = this.productsInCartSubject.asObservable(); 
    private userName? = '';
    private authSubscription: Subscription;

    constructor(private authService: AuthService) {
        this.authSubscription = this.authService.currentUser$.subscribe((user) => {
            console.log('Auth state changed:', user);
            this.userName = user?.username ?? 'guest';
            this.loadCartForCurrentUser();
        });
    }

    addCart(productCart: ProductCart): void {
        productCart.userName = this.userName;
        console.log('Adding cart:', productCart);

        // Update the cart for the current user
        const existingProductIndex = this.productsInCartSubject.value.findIndex(
            (p) => p.id === productCart.id
        );

        if (existingProductIndex === -1) {
            const updatedCart = [...this.productsInCartSubject.value, productCart];
            this.productsInCartSubject.next(updatedCart);
        } else {
            const updatedCart = this.productsInCartSubject.value.map((p, index) =>
                index === existingProductIndex
                    ? { ...p, quantity: p.quantity + productCart.quantity }
                    : p
            );
            this.productsInCartSubject.next(updatedCart);
        }

        console.log('Updated cart:', this.productsInCartSubject.value);

        // Save the updated cart to localStorage
        this.updateCartFromLocalStorage();
    }

    updateCart(productCart: ProductCart) {
        const updatedCart = this.productsInCartSubject.value.map((p) =>
            p.id === productCart.id
                ? { ...p, quantity: productCart.quantity }
                : p
        );
    
        this.productsInCartSubject.next(updatedCart);

        this.updateCartFromLocalStorage();
    }

    removeCart(productId: number) {
        const updatedCart = this.productsInCartSubject.value.filter(
            (p) => p.id !== productId
        );

        this.productsInCartSubject.next(updatedCart);

        this.updateCartFromLocalStorage();
    }

    private getCartFromLocalStorage(): ProductCart[] {
        const storedCart = localStorage.getItem(this.storageKey);
        return storedCart ? JSON.parse(storedCart) : [];
    }

    private updateCartFromLocalStorage() {
        // Load all carts from localStorage
        let storedCart = this.getCartFromLocalStorage();

        // Save the updated cart to localStorage
        storedCart = storedCart.filter((c) => c.userName !== this.userName);
        storedCart.push(...this.productsInCartSubject.value);

        this.saveCartToLocalStorage(storedCart);
    }

    private saveCartToLocalStorage(carts: ProductCart[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(carts));
    }

    private loadCartForCurrentUser(): void {
        const storedCart = this.getCartFromLocalStorage();   
        let userCart = storedCart.filter((c) => c.userName === this.userName);        
        if (this.userName !== 'guest') {
            const guestCart = storedCart.filter((c) => c.userName === 'guest');
            if (guestCart.length > 0) {
                const updateGuestCartUserName = guestCart.map((p) => {
                    return { ...p, userName: this.userName }
                })
                userCart = this.mergeCartGuestAndUser(updateGuestCartUserName, userCart);
            }
        }  
        this.productsInCartSubject.next(userCart);
        console.log('Cart loaded:', userCart);
    }

    private mergeCartGuestAndUser(guestCart: ProductCart[], userCart: ProductCart[]): ProductCart[] {
        // Add existing product from guest cart to user cart
        userCart.forEach(userProduct => {
            const indexExistingProductInUserCart = guestCart.findIndex(guestProduct => guestProduct.id === userProduct.id)
            if (indexExistingProductInUserCart !== -1) {
                userProduct.quantity += guestCart[indexExistingProductInUserCart].quantity;
                guestCart.splice(indexExistingProductInUserCart, 1);
            }
        })

        // Add new product from guest cart to user cart
        userCart = [...userCart, ...guestCart];
        // Filter cart 
        const storedCart = this.getCartFromLocalStorage().filter(c => c.userName !== 'guest' && c.userName !== this.userName);
        storedCart.push(...userCart);
        // Save to localStorage
        this.saveCartToLocalStorage(storedCart);
        return userCart;
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}
