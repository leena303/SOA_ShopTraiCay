import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-product-item',
  imports: [CommonModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  @Input() product!: Product;

  constructor(private router: Router) {}

  goToDetail(id: number) {
    this.router.navigate(['/product', id]);
  }
}