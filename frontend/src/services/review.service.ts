import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { ProductForReview } from '../app/models/products/product.interface';
import { CustomerReview } from '../app/models/reviews/customerReview.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private _http = inject(HttpClient);
  private _url = environment.apiURL + 'customerReview';

  constructor() {}

  getCountPendingReviews(): Observable<number> {
    return this._http.get<number>(`${this._url}/pending-count`);
  }

  getProductsPendingReview(): Observable<ProductForReview[]> {
    return this._http.get<ProductForReview[]>(`${this._url}/pending-products`);
  }

  getReviews(): Observable<CustomerReview[]> {
    return this._http.get<CustomerReview[]>(`${this._url}/reviews`);
  }
}
