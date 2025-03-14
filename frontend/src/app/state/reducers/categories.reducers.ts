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
  updateCategory,
  updateCategoryError,
  updateCategorySuccess,
} from '../actions/categories.actions';

export const initialState: CategoriesState = {
  loading: false,
  categories: [],
  categoryDetail: null,
  error: null,
  success: null,
};

export const categoriesReducer = createReducer(
  initialState,
  on(getCategories, (state) => {
    return { ...state, loading: true };
  }),
  on(getCategoriesSuccess, (state, props) => {
    return { ...state, loading: false, categories: props.categories };
  }),
  on(getCategoriesError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  on(getCategory, (state) => {
    return { ...state, loading: true };
  }),
  on(getCategorySuccess, (state, props) => {
    return { ...state, loading: false, categoryDetail: props.category };
  }),
  on(getCategoryError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
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
