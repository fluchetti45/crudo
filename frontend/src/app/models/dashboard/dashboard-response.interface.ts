import { ProductsCategoryCount } from './products-category-count.interface';
import { TopCategory } from './top-category.interface';
import { TopProduct } from './top-product.interface';
import { OrderStatus } from './order-status.interface';
export interface DashboardResponse {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalSales: number;
  productsByCategory: ProductsCategoryCount[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  orderStatus: OrderStatus[];
}
