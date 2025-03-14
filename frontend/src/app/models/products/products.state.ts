import { Product } from './product.interface';
import { ProductDetail } from './productDetail.interface';

export interface ProductsState {
  loading: boolean;
  products: Product[];
  productDetail: ProductDetail | null;
  productDeleted: boolean;
  error: string | null;
  success: string | null;
  filter: string | null;
}
