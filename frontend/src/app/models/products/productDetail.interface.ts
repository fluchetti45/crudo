import { Category } from '../categories/category.interface';

export interface ProductImage {
  id: number;
  productId: number;
  filePath: string;
  ImageUrl: string; // La URL completa de la imagen
  isCover: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  description: string;
  category: Category;
  categoryId: string;
  stock: number;
  isDeleted: boolean;
  createdAt: Date;
  productImages: ProductImage[];
}
