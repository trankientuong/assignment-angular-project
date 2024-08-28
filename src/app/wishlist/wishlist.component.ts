import { CommonModule, CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { WishlistItem } from '../services/product.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CartService } from '../services/cart.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductsTableComponent } from "../shared/products-table/products-table.component";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, FormsModule, CurrencyPipe, MatIconModule, MatPaginatorModule, MatInputModule, CommonModule, MatButtonModule, ProductsTableComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  displayedColumns: string[] = ['remove', 'image', 'name', 'price', 'quantity', 'total'];
  dataSource = new MatTableDataSource<WishlistItem>();

  private destroyRef = inject(DestroyRef);

  constructor(private cartService: CartService) {}

  ngOnInit() {
    const cartSubscription = this.cartService.wishlist$.subscribe((products) => {
      this.dataSource.data = products;
      this.destroyRef.onDestroy(() => {
        cartSubscription.unsubscribe();
      });
    })
  }

  moveToCart(productId: number) {
    this.cartService.moveToCart(productId);
  }
}
