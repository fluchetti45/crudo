export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  comment: string;
  rating: number;
  createdAt: Date;
}

export interface ProductReviewSummary {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
}
