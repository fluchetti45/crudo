import { Category } from './category.interface';

export interface CategoriesState {
  loading: boolean;
  categories: Category[];
  categoryDetail: Category | null;
  error: string | null;
  success: string | null;
}
