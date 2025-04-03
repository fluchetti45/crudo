import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../app/models/products/product.interface';
import { environment } from '../environments/environment';
import { ProductDetail } from '../app/models/products/productDetail.interface';
import { PagedResult } from '../app/models/common/paged-result.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _http = inject(HttpClient);
  private url = `${environment.apiURL}products`;

  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(this.url);
  }

  getTopProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.url}/top`);
  }

  getProductsAdmin(
    page: number = 1,
    pageSize: number = 10
  ): Observable<PagedResult<Product>> {
    return this._http.get<PagedResult<Product>>(
      `${this.url}/admin?page=${page}&pageSize=${pageSize}`
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    if (!categoryId) {
      return of([]);
    }
    return this._http.get<Product[]>(`${this.url}?categoryId=${categoryId}`);
  }

  getProductGeneral(productId: string): Observable<Product> {
    return this._http.get<Product>(`${this.url}/basic/${productId}`);
  }

  getProduct(productId: string): Observable<ProductDetail> {
    return this._http.get<ProductDetail>(`${this.url}/${productId}`);
  }

  getRelatedProducts(productId: number): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.url}/recommend/${productId}`);
  }

  getFilteredProducts(q: string): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.url}/search?q=${q}`);
  }

  createProduct(product: FormData): Observable<Product> {
    return this._http.post<Product>(this.url, product);
  }

  deleteProduct(productId: number) {
    return this._http.put(`${this.url}/${productId}/deactivate`, {});
  }

  updateProduct(id: number, product: FormData): Observable<Product> {
    return this._http.put<Product>(`${this.url}/${id}`, product);
  }
}
