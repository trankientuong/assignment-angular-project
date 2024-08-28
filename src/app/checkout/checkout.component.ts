import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CartTotalsComponent } from "../shared/cart-totals/cart-totals.component";
import { CartService } from '../services/cart.service';
import { AuthService } from '../auth/auth.service';
import { CanDeactivateFn } from '@angular/router';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, MatFormFieldModule, ReactiveFormsModule, MatGridListModule, MatInputModule, FlexLayoutModule, MatSelectModule, MatIconModule, MatButtonModule, MatCheckboxModule, CartTotalsComponent, FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    address: new FormGroup({
      country: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required])
    }),
    agree: new FormControl(false),
  });

  totalCost?: number = 0;
  subtotal: number = 0;
  deliveryCost: number = 0;
  discount: number = 0;

  couponCode: string = 'SD5253';
  submitted: boolean = false;
  isEmptyCart: boolean = false;

  private destroyRef = inject(DestroyRef);

  constructor(private cartService: CartService, private authService: AuthService) { }

  get address(): FormGroup {
    return this.checkoutForm.get('address') as FormGroup;
  }

  ngOnInit(): void {
    const cartSubscription = this.cartService.productsInCart$.subscribe((products) => {
      this.isEmptyCart = products.length === 0 ? true : false;
      this.subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
      this.totalCost = this.subtotal + this.deliveryCost - this.discount;
    });

    const userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user && user.email) {
        this.checkoutForm.controls.emailAddress.setValue(user.email);
      }
    });

    const countrySubscription = this.checkoutForm.controls.address.controls.country.valueChanges.subscribe(value => {
      this.estimateShipping(value!);
    });

    this.destroyRef.onDestroy(() => {
      cartSubscription.unsubscribe();
      userSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  }

  applyCoupon() {
    if (this.couponCode === 'SD5253') {
      this.discount = 10;
    } else {
      this.discount = 0;
      alert('Invalid Coupon Code');
    }
    this.totalCost = this.subtotal + this.deliveryCost - this.discount;
  }

  estimateShipping(country: string) {
    if (country === 'vn') {
      this.deliveryCost = 5;
    } else {
      this.deliveryCost = 10;
    }
    this.totalCost = this.subtotal + this.deliveryCost - this.discount;
  }

  submitOrder() {
    if (this.checkoutForm.valid) {
      if (this.checkoutForm.controls.agree.value === false) {
        alert('You must agree before submitting.');
        return;
      }
      this.submitted = true;
      alert('Order placed successfully!');
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}

export const canLeaveCheckoutPage: CanDeactivateFn<CheckoutComponent> = (component) => {
  if (component.submitted) {
    return true;
  }
  if (component.checkoutForm.dirty || component.checkoutForm.touched) {
    return window.confirm('Do you really want to leave? You will lose the entered data.')
  }
  return true;
}
