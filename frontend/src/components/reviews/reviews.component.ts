import { Component, Input, inject } from '@angular/core';
import { CustomerReview } from '../../app/models/reviews/customerReview.interface';
import { NgFor, NgIf, DatePipe, NgClass } from '@angular/common';
import { ReviewService } from '../../services/review.service';
@Component({
  selector: 'app-reviews',
  imports: [NgFor, NgIf, DatePipe, NgClass],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent {
  @Input() reviews!: CustomerReview[];
  private _reviewService = inject(ReviewService);

  getRatingText(rating: number): string {
    return rating === 1
      ? 'Muy mala'
      : rating === 2
      ? 'Mala'
      : rating === 3
      ? 'Buena'
      : rating === 4
      ? 'Muy buena'
      : 'Excelente';
  }

  deleteReview(reviewId: number) {
    this._reviewService.deleteReview(reviewId).subscribe(() => {
      this.reviews = this.reviews.filter((review) => review.id !== reviewId);
    });
  }
}
