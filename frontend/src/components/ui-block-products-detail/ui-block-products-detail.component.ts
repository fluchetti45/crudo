import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';

import {
  deleteProduct,
  getProduct,
} from '../../app/state/actions/products.actions';
import { Product } from '../../app/models/products/product.interface';
import { ProductService } from '../../services/products.service';

@Component({
  selector: 'app-ui-block-products-detail',
  imports: [RouterLink, NgFor, NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './ui-block-products-detail.component.html',
  styleUrl: './ui-block-products-detail.component.css',
})
export class UiBlockProductsDetailComponent {
  products: Product[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  loading: boolean = true;
  error: string | null = null;
  searchForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private formBuilder: FormBuilder,
    private _products: ProductService
  ) {
    this._products.getProductsAdmin(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.products = res.items;
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.pageSize = res.pageSize;
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
  }

  onSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
  }

  previousPage() {}

  nextPage() {}

  viewProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  createProduct(): void {
    this.router.navigate(['create-product']);
  }

  editProduct(event: Event, productId: number): void {
    event.stopPropagation();
    this.store.dispatch(getProduct({ productId: productId.toString() }));
    this.router.navigate(['edit-product', productId]);
  }

  deleteProduct(event: Event, productId: number): void {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.store.dispatch(deleteProduct({ productId: productId }));
    }
  }
}
