import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { ProductForReview } from '../app/models/products/product.interface';
import { CustomerReview } from '../app/models/reviews/customerReview.interface';
import { GenerateReview } from '../app/models/reviews/generateReview.interface';
import { ProductReviewSummary } from '../app/models/reviews/productReview.interface';
import { UpdateReview } from '../app/models/reviews/updateReview.interface';

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

  getCountDoneReviews(): Observable<number> {
    return this._http.get<number>(`${this._url}/done-count`);
  }

  getProductsPendingReview(): Observable<ProductForReview[]> {
    return this._http.get<ProductForReview[]>(`${this._url}/pending-products`);
  }

  getReviews(): Observable<CustomerReview[]> {
    return this._http.get<CustomerReview[]>(`${this._url}/reviews`);
  }

  getReviewsByUser(): Observable<CustomerReview[]> {
    return this._http.get<CustomerReview[]>(`${this._url}/user`);
  }

  createReview(review: GenerateReview): Observable<CustomerReview> {
    return this._http.post<CustomerReview>(`${this._url}`, review);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${reviewId}`);
  }

  getProductReviews(productId: string): Observable<ProductReviewSummary> {
    return this._http.get<ProductReviewSummary>(
      `${this._url}/product/${productId}`
    );
  }

  getReviewById(reviewId: string): Observable<CustomerReview> {
    return this._http.get<CustomerReview>(`${this._url}/${reviewId}`);
  }

  updateReview(review: UpdateReview): Observable<CustomerReview> {
    return this._http.put<CustomerReview>(`${this._url}/${review.id}`, review);
  }
}
