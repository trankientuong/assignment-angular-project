import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductCardComponent } from "../product-card/product-card.component";
import { Product, ProductCart } from '../services/product.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatGridListModule,
    ProductCardComponent,
    NgFor
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  constructor(private productService: ProductService, private cartService: CartService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (resData) => this.products = resData
    })
  }

  handleAddToCart(productCart: ProductCart) {
    this.cartService.addCart(productCart);

    this.dialog.open(DialogComponent, {
      data: { message: `${productCart.name} has been added to your cart.` }
    });
  }
}
