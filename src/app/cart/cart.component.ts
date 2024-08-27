import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductCart } from '../services/product.model';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { CartTotalsComponent } from "../shared/cart-totals/cart-totals.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatButtonModule, FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, CommonModule, FlexLayoutModule, CurrencyPipe, CartTotalsComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['remove', 'image', 'name', 'price', 'quantity', 'total'];
  dataSource = new MatTableDataSource<ProductCart>();
  totalCost?: number = 0;
  subtotal: number = 0;
  deliveryCost: number = 0;
  discount: number = 0;

  private destroyRef = inject(DestroyRef);

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    const cartSubscription = this.cartService.productsInCart$.subscribe((products) => {
      this.dataSource.data = products;
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

  proceedToCheckout() {
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
