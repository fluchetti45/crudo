import { Component, Input, inject, OnInit } from '@angular/core';
import { CustomerReview } from '../../app/models/reviews/customerReview.interface';
import { NgFor, NgIf, DatePipe, NgClass } from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reviews',
  imports: [NgFor, NgIf, DatePipe, NgClass],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent implements OnInit {
  @Input() reviews!: CustomerReview[];
  private _reviewService = inject(ReviewService);
  private _router = inject(Router);

  ngOnInit(): void {
    console.log(this.reviews);
  }

  editReview(reviewId: number) {
    console.log(reviewId);
    this._router.navigate(['/profile/edit-review', reviewId]);
  }

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
