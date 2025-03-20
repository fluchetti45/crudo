import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as WishlistActions from '../actions/wishlist.actions';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class WishlistEffects {
  private actions$ = inject(Actions);
  private wishlistService = inject(WishlistService);
  private _toastr = inject(ToastrService);

  loadWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.loadWishlist),
      mergeMap(() =>
        this.wishlistService.getWishlist().pipe(
          map((items) => WishlistActions.loadWishlistSuccess({ items })),
          catchError((error) =>
            of(WishlistActions.loadWishlistFailure({ error }))
          )
        )
      )
    )
  );

  addToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.addToWishlist),
      mergeMap(({ productId }) =>
        this.wishlistService.addToWishlist(productId).pipe(
          map((product) => {
            console.log(product);
            this._toastr.success('Product added to wishlist');
            return WishlistActions.addToWishlistSuccess({ product });
          }),
          catchError((error) => {
            console.log(error);
            this._toastr.error('Error adding product to wishlist');
            return of(WishlistActions.addToWishlistFailure({ error }));
          })
        )
      )
    )
  );

  removeFromWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.removeFromWishlist),
      mergeMap(({ productId }) =>
        this.wishlistService.removeFromWishlist(productId).pipe(
          map(() => {
            this._toastr.success('Product removed from wishlist');
            return WishlistActions.removeFromWishlistSuccess({ productId });
          }),
          catchError((error) => {
            this._toastr.error('Error removing product from wishlist');
            return of(WishlistActions.removeFromWishlistFailure({ error }));
          })
        )
      )
    )
  );

  clearWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.clearWishlist),
      mergeMap(() =>
        this.wishlistService.clearWishlist().pipe(
          map(() => {
            this._toastr.success('Wishlist cleared');
            return WishlistActions.loadWishlist();
          }),
          catchError((error) => {
            this._toastr.error('Error clearing wishlist');
            return of(WishlistActions.loadWishlistFailure({ error }));
          })
        )
      )
    )
  );
}
