import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, MatFormFieldModule, ReactiveFormsModule, MatGridListModule, MatInputModule, FlexLayoutModule, MatSelectModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  totalCost?: number = 0;
  subtotal: number = 0;
  deliveryCost: number = 0;
  discount: number = 0;
}
