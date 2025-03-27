import { createReducer, on } from '@ngrx/store';
import { CategoriesState } from '../../models/categories/categories.state';
import {
  createCategory,
  createCategoryError,
  createCategorySuccess,
  deleteCategory,
  deleteCategoryError,
  deleteCategorySuccess,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  getCategory,
  getCategoryError,
  getCategorySuccess,
  getTopCategories,
  getTopCategoriesError,
  getTopCategoriesSuccess,
  updateCategory,
  updateCategoryError,
  updateCategorySuccess,
} from '../actions/categories.actions';

export const initialState: CategoriesState = {
  loading: false,
  categories: [],
  topCategories: [],
  categoryDetail: null,
  error: null,
  success: null,
};

export const categoriesReducer = createReducer(
  initialState,
  // Get categories
  on(getCategories, (state) => {
    return { ...state, loading: true };
  }),
  // Get categories success
  on(getCategoriesSuccess, (state, props) => {
    return { ...state, loading: false, categories: props.categories };
  }),
  // Get categories error
  on(getCategoriesError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // Get top categories
  on(getTopCategories, (state) => {
    return { ...state, loading: true };
  }),
  // Get top categories success
  on(getTopCategoriesSuccess, (state, props) => {
    return { ...state, loading: false, topCategories: props.topCategories };
  }),
  // Get top categories error
  on(getTopCategoriesError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // Get category
  on(getCategory, (state) => {
    return { ...state, loading: true };
  }),
  // Get category success
  on(getCategorySuccess, (state, props) => {
    return { ...state, loading: false, categoryDetail: props.category };
  }),
  // Get category error
  on(getCategoryError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // Create category
  on(createCategory, (state) => {
    return { ...state, loading: true };
  }),
  on(createCategorySuccess, (state, props) => {
    return {
      ...state,
      loading: false,
      categories: [...state.categories, props.category],
    };
  }),
  on(createCategoryError, (state, props) => {
    return { ...state, loading: false, error: props.error || 'Algo salio mal' };
  }),
  on(deleteCategory, (state) => {
    return { ...state, loading: true };
  }),
  on(deleteCategorySuccess, (state, props) => {
    return {
      ...state,
      loading: false,
      categories: [
        ...state.categories.filter((c) => c.id !== props.categoryId),
      ],
    };
  }),
  on(deleteCategoryError, (state, props) => {
    return {
      ...state,
      loading: false,
      error: props.error || 'Algo salio mal..',
    };
  }),
  on(updateCategory, (state, props) => {
    return { ...state, loading: true };
  }),
  on(updateCategorySuccess, (state, props) => {
    return {
      ...state,
      loading: false,
      success: 'Categoria actualizada',
      error: null,
      categories: state.categories.map((c) =>
        c.id === props.category.id ? { ...c, ...props.category } : c
      ),
    };
  }),
  on(updateCategoryError, (state, props) => {
    return {
      ...state,
      error: props.error || 'Ocurrio  un error',
      loading: false,
    };
  })
);
