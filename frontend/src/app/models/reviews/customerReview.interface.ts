export interface CustomerReview {
  id: number;
  productId: number;
  userId: number;
  comment: string;
  rating: number;
  createdAt: Date;
  filePathCover: string;
  productName: string;
}
