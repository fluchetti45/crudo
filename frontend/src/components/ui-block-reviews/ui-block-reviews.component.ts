import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { CustomerReview } from '../../app/models/reviews/customerReview.interface';
import { PendingReviewsComponent } from '../pending-reviews/pending-reviews.component';
import { NgIf } from '@angular/common';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ProductForReview } from '../../app/models/products/product.interface';
@Component({
  selector: 'app-ui-block-reviews',
  imports: [PendingReviewsComponent, NgIf, ReviewsComponent],
  templateUrl: './ui-block-reviews.component.html',
  styleUrl: './ui-block-reviews.component.css',
})
export class UiBlockReviewsComponent implements OnInit {
  private _reviewService = inject(ReviewService);
  public pendingReviews: boolean = true;

  reviews: CustomerReview[] = [];
  productsPendingReview: ProductForReview[] = [];

  ngOnInit(): void {
    this._reviewService.getProductsPendingReview().subscribe((reviews) => {
      this.productsPendingReview = reviews;
    });
    this._reviewService.getReviewsByUser().subscribe((reviews) => {
      this.reviews = reviews;
      console.log(this.reviews);
    });
  }
}
