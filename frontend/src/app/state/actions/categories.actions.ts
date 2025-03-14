import { createAction, props } from '@ngrx/store';
import { Category } from '../../models/categories/category.interface';
import { UpdateCategory } from '../../models/categories/updateCategory.interface';

// Get all categories
export const getCategories = createAction('[Category List] Get categories');

// Get all categories success
export const getCategoriesSuccess = createAction(
  '[Category List] Get categories success',
  props<{ categories: Category[] }>()
);

// Get all categories error
export const getCategoriesError = createAction(
  '[Category List] Get categories error',
  props<{ error: 'Ocurrio un error' }>()
);

// Get category
export const getCategory = createAction(
  '[Category List] Get category',
  props<{ categoryId: number }>()
);

// Get category success
export const getCategorySuccess = createAction(
  '[Category List] Get category success',
  props<{ category: Category }>()
);

// Get category error
export const getCategoryError = createAction(
  '[Category List] Get category error',
  props<{ error: 'Ocurrio un error' }>()
);

// Create category
export const createCategory = createAction(
  '[Category List] Create category',
  props<{ category: Category }>()
);

// Create category success
export const createCategorySuccess = createAction(
  '[Category List] Create category success',
  props<{ category: Category }>()
);

// Create category error
export const createCategoryError = createAction(
  '[Category List] Create category error',
  props<{ error: 'Ocurrio un error' }>()
);

// Delete category
export const deleteCategory = createAction(
  '[Category List] Delete category',
  props<{ categoryId: number }>()
);

// Delete category success
export const deleteCategorySuccess = createAction(
  '[Category List] Delete category success',
  props<{ categoryId: number }>()
);

// Delete category error
export const deleteCategoryError = createAction(
  '[Category List] Delete category error',
  props<{ error: 'Ocurrio un error' }>()
);

// Update category
export const updateCategory = createAction(
  '[Category List] Update category',
  props<{ category: UpdateCategory }>()
);

export const updateCategorySuccess = createAction(
  '[Category List] Update category success',
  props<{ category: Category }>()
);

export const updateCategoryError = createAction(
  '[Category List] Update category error',
  props<{ error: 'Ocurrio un error' }>()
);
