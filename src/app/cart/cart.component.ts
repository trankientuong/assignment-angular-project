import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductCart } from '../services/product.model';
import { CartService } from '../services/cart.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatButtonModule, FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, CommonModule, FlexLayoutModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['remove', 'image', 'name', 'price', 'quantity', 'total'];
  dataSource = new MatTableDataSource<ProductCart>();
  totalProductsInCart: number = 0;
  couponCode: string = 'SD5253';
  country: string = 'Viet Nam';
  state: string = 'Ho Chi Minh';
  postalCode: string = '70000';
  totalCost?: number = 0;
  subtotal: number = 0;
  deliveryCost: number = 0;
  discount: number = 0;

  private destroyRef = inject(DestroyRef);

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    const cartSubscription = this.cartService.productsInCart$.subscribe((products) => {
      this.dataSource.data = products;
      this.totalProductsInCart = products.length;
      this.subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
      this.totalCost = this.subtotal + this.deliveryCost - this.discount;
    });

    this.destroyRef.onDestroy(() => {
      cartSubscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  validateAndUpdateQuantity(product: ProductCart): void {
    if (product.quantity < 1) {
      product.quantity = 1;
    } else if (product.quantity > 100) {
      product.quantity = 100;
    }
    // Update product quantity in cart
    this.cartService.updateCart(product);
  }

  removeFromCart(productId: number) {
    const isRemove = confirm('Do you really want to remove this product from the cart?');
    if (isRemove) {
      this.cartService.removeCart(productId);
    }
  }

  applyCoupon() {
    if (this.couponCode === 'SD5253') {
      this.discount = 10;
    } else {
      this.discount = 0;
      alert('Invalid Coupon Code');
    }
  }

  estimateShipping() {
    if (this.country === 'Viet Nam'.trim()) {
      this.deliveryCost = 5;
    } else {
      this.deliveryCost = 10;
    }

    this.totalCost = this.subtotal + this.deliveryCost - this.discount;
  }

  calculateTotals() {
    this.applyCoupon();
    this.estimateShipping();
    this.totalCost = this.subtotal + this.deliveryCost - this.discount;
  }

  proceedToCheckout() {
    this.calculateTotals();

    const message = `You are about to proceed to the checkout. 
      \nSubtotal: ${this.subtotal}$ 
      \nDelivery: ${this.deliveryCost}$ 
      \nDiscount: ${this.discount}$ 
      \n--------------------------------
      \n**Total Cost: ${this.totalCost}$**
      \n\nDo you want to continue with the checkout process?`;

    const isProceed = confirm(message);
    if (isProceed) {
      this.router.navigate(['/checkout']);
    }
  }
}
