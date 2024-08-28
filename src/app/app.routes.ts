import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CartComponent } from './cart/cart.component';
import { canLeaveCheckoutPage, CheckoutComponent } from './checkout/checkout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/auth.guard';
import { WishlistComponent } from './wishlist/wishlist.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], canDeactivate: [canLeaveCheckoutPage] },
    { path: 'auth', component: AuthComponent},
    { path: 'wishlist', component: WishlistComponent },
    { path: '**', component: NotFoundComponent }
];
