import { Component, inject, Input } from '@angular/core';
import { ProductForReview } from '../../app/models/products/product.interface';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pending-reviews',
  imports: [NgFor, DatePipe],
  templateUrl: './pending-reviews.component.html',
  styleUrl: './pending-reviews.component.css',
})
export class PendingReviewsComponent {
  private _router = inject(Router);
  @Input() productsPendingReview!: ProductForReview[];

  generateReview(productId: number) {
    this._router.navigate(['/profile/pending-review', productId]);
  }
}
