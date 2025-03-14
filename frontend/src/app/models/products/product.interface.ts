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
