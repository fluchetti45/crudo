export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  comment: string;
  rating: number;
  createdAt: Date;
}
