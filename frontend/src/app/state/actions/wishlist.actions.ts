import { createAction, props } from '@ngrx/store';
import { WishlistItem } from '../../models/wishlist/wishlistItem.interface';

export const addToWishlist = createAction(
  '[Wishlist] Add Item',
  props<{ productId: number }>()
);

export const addToWishlistSuccess = createAction(
  '[Wishlist] Add Item Success',
  props<{ product: WishlistItem }>()
);

export const addToWishlistFailure = createAction(
  '[Wishlist] Add Item Failure',
  props<{ error: string }>()
);

export const removeFromWishlist = createAction(
  '[Wishlist] Remove Item',
  props<{ productId: number }>()
);

export const removeFromWishlistSuccess = createAction(
  '[Wishlist] Remove Item Success',
  props<{ productId: number }>()
);

export const removeFromWishlistFailure = createAction(
  '[Wishlist] Remove Item Failure',
  props<{ error: string }>()
);
export const clearWishlist = createAction('[Wishlist] Clear Wishlist');

export const clearWishlistSuccess = createAction(
  '[Wishlist] Clear Wishlist Success'
);

export const clearWishlistFailure = createAction(
  '[Wishlist] Clear Wishlist Failure',
  props<{ error: string }>()
);

export const loadWishlist = createAction('[Wishlist] Load Wishlist');

export const loadWishlistSuccess = createAction(
  '[Wishlist] Load Wishlist Success',
  props<{ items: WishlistItem[] }>()
);

export const loadWishlistFailure = createAction(
  '[Wishlist] Load Wishlist Failure',
  props<{ error: string }>()
);
