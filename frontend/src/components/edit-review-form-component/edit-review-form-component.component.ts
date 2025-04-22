import { Component, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { CustomerReview } from '../../app/models/reviews/customerReview.interface';
import { NgClass } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-review-form-component',
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass, RouterLink],
  templateUrl: './edit-review-form-component.component.html',
  styleUrl: './edit-review-form-component.component.css',
})
export class EditReviewFormComponentComponent {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _review = inject(ReviewService);
  public review: CustomerReview | null = null;
  public originalReview: CustomerReview | null = null;
  public isSubmitting = false;
  public loading: boolean;
  public currentRating = 1;
  public hoverRating = 1;
  reviewForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.loading = true;
    this.reviewForm = this._formBuilder.group({
      id: [null, Validators.required],
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [''],
    });
  }

  ngOnInit(): void {
    this._review
      .getReviewById(this._route.snapshot.params['id'])
      .subscribe((review) => {
        this.review = review;
        this.originalReview = { ...review };
        this.currentRating = this.review.rating;
        this.hoverRating = this.review.rating;
        this.reviewForm.get('id')?.setValue(this.review.id);
        this.reviewForm.get('rating')?.setValue(this.review.rating);
        this.reviewForm.get('comment')?.setValue(this.review.comment);
      });

    this.loading = false;
  }

  updateReview() {
    this.isSubmitting = true;
    if (this.review?.id && this.reviewForm.valid) {
      this._review.updateReview(this.reviewForm.value).subscribe((review) => {
        this.review = review;
        this.originalReview = { ...review };
        this.isSubmitting = false;
        this._router.navigate(['/profile/reviews']);
      });
    }
  }

  cancelEdit() {
    if (this.originalReview) {
      this.review = { ...this.originalReview };
      this.currentRating = this.review.rating;
      this.hoverRating = this.review.rating;
      this.reviewForm.get('rating')?.setValue(this.review.rating);
      this.reviewForm.get('comment')?.setValue(this.review.comment);
    }
  }

  getRatingIconClass(rating: number) {
    if (rating <= this.hoverRating) {
      return 'bi bi-star-fill';
    } else if (rating <= this.currentRating) {
      return 'bi bi-star-fill';
    } else {
      return 'bi bi-star';
    }
  }

  getRatingText() {
    return this.reviewForm.get('rating')?.value;
  }

  setRating(rating: number) {
    if (this.currentRating === rating) {
      this.currentRating = 0;
      this.hoverRating = 0;
      this.reviewForm.get('rating')?.setValue(0);
    } else {
      this.currentRating = rating;
      this.hoverRating = rating;
      this.reviewForm.get('rating')?.setValue(rating);
    }
  }

  onStarHover(rating: number) {
    this.hoverRating = rating;
  }

  onStarLeave() {
    this.hoverRating = this.currentRating;
  }
}
