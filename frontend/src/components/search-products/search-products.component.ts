import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../../app/models/products/product.interface';
import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgFor,
    AsyncPipe,
    CurrencyPipe,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css',
})
export class SearchProductsComponent implements OnInit {
  searchTerm = '';
  searchResults$!: Observable<Product[]>;
  newSearchTerm = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this._route.queryParams.subscribe((params) => {
      this.searchTerm = params['q'];
      this.searchResults$ = this._productService.getFilteredProducts(
        this.searchTerm
      );
    });
  }

  onSearch() {
    this._router.navigate(['/products'], {
      queryParams: { q: this.newSearchTerm },
    });
  }

  getPreviewDescription(description: string): string {
    // Primero convertimos el HTML a texto plano
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    // Luego tomamos los primeros 100 caracteres
    return textContent.slice(0, 100) + '...';
  }
}
