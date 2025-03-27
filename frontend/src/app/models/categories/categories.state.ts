import { Category } from './category.interface';
import { TopCategory } from './topCategory.interface';
export interface CategoriesState {
  loading: boolean;
  categories: Category[];
  categoryDetail: Category | null;
  topCategories: TopCategory[];
  error: string | null;
  success: string | null;
}
