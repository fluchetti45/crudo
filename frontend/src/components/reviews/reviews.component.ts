import { Component, Input } from '@angular/core';
import { CustomerReview } from '../../app/models/reviews/customerReview.interface';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-reviews',
  imports: [NgFor, NgIf],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent {
  @Input() reviews!: CustomerReview[];
}
