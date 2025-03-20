import { Component, Input } from '@angular/core';
import { ProductReview } from '../../app/models/reviews/productReview.interface';
import { DatePipe, NgClass, NgFor } from '@angular/common';
@Component({
  selector: 'app-product-review',
  imports: [DatePipe, NgFor, NgClass],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css',
})
export class ProductReviewComponent {
  @Input() review!: ProductReview;

  getRatingText(rating: number): string {
    return rating === 1
      ? 'Muy mala'
      : rating === 2
      ? 'Mala'
      : rating === 3
      ? 'Regular'
      : rating === 4
      ? 'Buena'
      : 'Muy buena';
  }
}
