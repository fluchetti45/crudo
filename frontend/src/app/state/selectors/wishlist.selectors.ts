import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from '../reducers/wishlist.reducer';

export const selectWishlistState =
  createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistItems = createSelector(
  selectWishlistState,
  (state: WishlistState) => state.items
);

export const selectWishlistLoading = createSelector(
  selectWishlistState,
  (state: WishlistState) => state.loading
);

export const selectWishlistError = createSelector(
  selectWishlistState,
  (state: WishlistState) => state.error
);

export const selectWishlistCount = createSelector(
  selectWishlistItems,
  (items) => items.length
);

export const selectIsInWishlist = (productId: number) =>
  createSelector(selectWishlistItems, (items) =>
    items.some((item) => item.productId === productId)
  );
