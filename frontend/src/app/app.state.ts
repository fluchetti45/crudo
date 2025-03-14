import { ActionReducerMap } from '@ngrx/store';
import { ProductsState } from './models/products/products.state';
import { productsReducer } from './state/reducers/products.reducers';
import { CategoriesState } from './models/categories/categories.state';
import { categoriesReducer } from './state/reducers/categories.reducers';
import { CartState } from './models/cart/cart.state';
import { cartReducer } from './state/reducers/cart.reducers';

export interface AppState {
  products: ProductsState;
  categories: CategoriesState;
  cart: CartState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  products: productsReducer,
  categories: categoriesReducer,
  cart: cartReducer,
};
