import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, CurrencyPipe, FormsModule, CommonModule],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.css'
})
export class ProductsTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['remove', 'image', 'name', 'price', 'quantity', 'total'];
  @Input() dataSource = new MatTableDataSource<any>();
  @Input() actionButtonTemplate!: TemplateRef<any>;
  @Input() quantityInputTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
