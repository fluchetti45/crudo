import { Component, Input, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../app/models/products/product.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  private _router = inject(Router);

  constructor(private sanitizer: DomSanitizer) {}

  onClick() {
    this._router.navigate([`product/${this.product.id}`]);
  }

  getSafeDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.product.description);
  }
}
