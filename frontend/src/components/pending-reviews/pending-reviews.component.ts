import { Component, inject, OnInit, Input } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ProductForReview } from '../../app/models/products/product.interface';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-pending-reviews',
  imports: [NgFor, DatePipe, NgIf],
  templateUrl: './pending-reviews.component.html',
  styleUrl: './pending-reviews.component.css',
})
export class PendingReviewsComponent {
  private _review = inject(ReviewService);
  @Input() productsPendingReview!: ProductForReview[];
}
