export interface Product {
  id: number;
  name: string;
  isDeleted: boolean;
  price: number;
  description: string;
  categoryId: string;
  stock: number;
  createdAt: Date;
  filePathCover: string;
}

export interface ProductForReview {
  id: number;
  name: string;
  filePathCover: string;
  orderDate: Date;
}
