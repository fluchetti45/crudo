import { createReducer, on } from '@ngrx/store';

import * as WishlistActions from '../actions/wishlist.actions';
import { WishlistItem } from '../../models/wishlist/wishlistItem.interface';
export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

export const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const wishlistReducer = createReducer(
  initialState,
  on(WishlistActions.addToWishlist, (state, props) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistActions.addToWishlistSuccess, (state, props) => ({
    ...state,
    items: [...state.items, props.product],
    loading: false,
    error: null,
  })),
  on(WishlistActions.addToWishlistFailure, (state, props) => ({
    ...state,
    error: props.error,
    loading: false,
  })),
  on(WishlistActions.removeFromWishlist, (state, { productId }) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistActions.removeFromWishlistSuccess, (state, props) => ({
    ...state,
    items: state.items.filter((item) => item.productId !== props.productId),
  })),
  on(WishlistActions.removeFromWishlistFailure, (state, props) => ({
    ...state,
    loading: false,
    error: props.error,
  })),
  on(WishlistActions.clearWishlist, (state) => ({
    ...state,
    items: [],
  })),
  on(WishlistActions.clearWishlistSuccess, (state) => ({
    ...state,
    items: [],
  })),
  on(WishlistActions.clearWishlistFailure, (state, props) => ({
    ...state,
    error: props.error,
  })),
  on(WishlistActions.loadWishlist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistActions.loadWishlistSuccess, (state, props) => ({
    ...state,
    items: props.items,
    loading: false,
  })),
  on(WishlistActions.loadWishlistFailure, (state, props) => ({
    ...state,
    error: props.error,
    loading: false,
  }))
);
