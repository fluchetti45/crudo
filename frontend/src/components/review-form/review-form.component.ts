import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { ProductService } from '../../services/products.service';

import { Product } from '../../app/models/products/product.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass, RouterLink],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent implements OnInit {
  private _router = inject(ActivatedRoute);
  private _productId = this._router.snapshot.params['id'];
  private _review = inject(ReviewService);
  public product!: Product;
  private _product = inject(ProductService);
  isSubmitting = false;
  currentRating = 1;
  hoverRating = 1;

  reviewForm: FormGroup;
  constructor(private _formBuilder: FormBuilder) {
    this.reviewForm = this._formBuilder.group({
      rating: [1, Validators.required],
      comment: [''],
    });
  }

  ngOnInit(): void {
    this._product.getProductGeneral(this._productId).subscribe((product) => {
      this.product = product;
      console.log(this.product);
    });
  }

  getRatingIconClass(rating: number) {
    return rating <= this.currentRating ? 'bi-star-fill' : 'bi-star';
  }

  submitReview() {
    console.log(this.reviewForm.value);
    const review = {
      rating: this.reviewForm.get('rating')?.value,
      comment: this.reviewForm.get('comment')?.value,
      productId: this._productId,
    };
    this.isSubmitting = true;
    this._review.createReview(review).subscribe((review) => {
      console.log(review);
      this.isSubmitting = false;
    });
  }

  setRating(rating: number) {
    this.currentRating = rating;
    this.reviewForm.get('rating')?.setValue(rating);
  }

  getRatingText() {
    const rating = this.reviewForm.get('rating')?.value;
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
}
