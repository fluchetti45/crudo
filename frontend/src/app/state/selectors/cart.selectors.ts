import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';
import { CartState } from '../../models/cart/cart.state';

export const selectCartFeature = (state: AppState) => state.cart;

export const selectLoading = createSelector(
  selectCartFeature,
  (state: CartState) => state.loading
);

export const selectCartItems = createSelector(
  selectCartFeature,
  (state: CartState) => state.products
);

export const selectSuccess = createSelector(
  selectCartFeature,
  (state: CartState) => state.success
);

export const selectError = createSelector(
  selectCartFeature,
  (state: CartState) => state.error
);

export const selectTotalAmount = createSelector(
  selectCartFeature,
  (state: CartState) => state.totalAmount
);

export const selectTotalItems = createSelector(
  selectCartFeature,
  (state: CartState) => state.totalItems
);

export const selectCheckoutStatus = createSelector(
  selectCartFeature,
  (state: CartState) => state.isCheckoutComplete
);
