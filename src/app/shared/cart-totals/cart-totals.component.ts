import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cart-totals',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart-totals.component.html',
  styleUrl: './cart-totals.component.css'
})
export class CartTotalsComponent {
  @Input() subtotal: number = 0;
  @Input() deliveryCost: number = 0;
  @Input() discount: number = 0;
  @Input() totalCost?: number = 0;
}
