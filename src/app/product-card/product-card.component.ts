import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Product, ProductCart } from '../services/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, CurrencyPipe, MatIconModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<ProductCart>();

  quantity: number = 1;

  onAddToCart() {
    this.addToCart.emit({
      id: this.product().id,
      name: this.product().name,
      price: this.product().price,
      image: this.product().image,
      quantity: this.quantity
    });
  }
}
