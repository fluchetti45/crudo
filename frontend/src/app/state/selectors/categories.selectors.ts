import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';
import { CategoriesState } from '../../models/categories/categories.state';
import { Category } from '../../models/categories/category.interface';

export const selectCategoriesFeature = (state: AppState) => state.categories;

export const selectLoading = createSelector(
  selectCategoriesFeature,
  (state: CategoriesState) => state.loading
);

export const selectCategoryList = createSelector(
  selectCategoriesFeature,
  (state: CategoriesState) => state.categories
);

export const selectCategorytDetail = createSelector(
  selectCategoriesFeature,
  (state: CategoriesState) => state.categoryDetail
);

export const selectSuccess = createSelector(
  selectCategoriesFeature,
  (state: CategoriesState) => state.success
);

export const selectError = createSelector(
  selectCategoriesFeature,
  (state: CategoriesState) => state.error
);

export const selectFilteredCategories = (filterName: string) =>
  createSelector(selectCategoryList, (categories: Category[]) => {
    if (!filterName) {
      return categories;
    }
    return categories.filter((category) =>
      category.name.toLowerCase().includes(filterName.toLowerCase())
    );
  });
