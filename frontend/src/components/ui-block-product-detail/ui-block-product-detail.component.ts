import { Component, inject, OnInit } from '@angular/core';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { Observable } from 'rxjs';
import {
  selectLoading,
  selectProductDetail,
  selectError,
} from '../../app/state/selectors/products.selectors';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { getProduct } from '../../app/state/actions/products.actions';
import { ErrorComponent } from '../error/error.component';
import { ProductReviewSummary } from '../../app/models/reviews/productReview.interface';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ProductDetail } from '../../app/models/products/productDetail.interface';
import { ReviewService } from '../../services/review.service';
@Component({
  selector: 'app-ui-block-product-detail',
  imports: [
    ProductDetailComponent,
    AsyncPipe,
    NgIf,
    ErrorComponent,
    NgFor,
    ProductReviewComponent,
  ],
  templateUrl: './ui-block-product-detail.component.html',
  styleUrl: './ui-block-product-detail.component.css',
})
export class UiBlockProductDetailComponent implements OnInit {
  product$: Observable<ProductDetail | null> = new Observable();
  loading$: Observable<boolean> = new Observable();
  error$: Observable<string | null> = new Observable();
  reviews: ProductReviewSummary | null = null;
  private _route = inject(ActivatedRoute);
  private _reviews = inject(ReviewService);
  constructor(private _store: Store<AppState>) {
    this.product$ = this._store.select(selectProductDetail);
    this.loading$ = this._store.select(selectLoading);
    this.error$ = this._store.select(selectError);
  }
  ngOnInit(): void {
    const productId = this._route.snapshot.paramMap.get('id');
    if (productId) {
      this._store.dispatch(getProduct({ productId }));
      this._reviews.getProductReviews(productId).subscribe((reviews) => {
        this.reviews = reviews;
        console.log(this.reviews);
      });
    }
  }
}
