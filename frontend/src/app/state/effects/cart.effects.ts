import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../services/cart.service';
import * as CartActions from '../actions/cart.actions';
import { mergeMap, map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartItem } from '../../models/cart/cartItem.iterface';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private _cart = inject(CartService);
  private _toastr = inject(ToastrService);

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addProduct),
      switchMap(({ item, availableStock }) =>
        this._cart.addToCart(item).pipe(
          tap((cartItem) => {
            console.log('Respuesta de la API:', cartItem); // Ver si aquí llega la respuesta del backend
          }),
          map((cartItem) => {
            console.log(cartItem);
            this._toastr.success('Producto agregado al carrito', 'Éxito');
            return CartActions.addProductSuccess({
              product: cartItem,
            });
          }),
          catchError((error) => {
            this._toastr.error(error.error, 'Error');
            return of(CartActions.addProductError({ error: error.error }));
          })
        )
      )
    )
  );

  updateQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartItemQuantity),
      mergeMap(({ cartItemId, amount }) =>
        this._cart.updateCartItemQuantity(cartItemId, amount).pipe(
          map((cartItem: CartItem) => {
            return CartActions.updateCartItemQuantitySuccess({
              itemId: cartItem.itemId,
              newQuantity: cartItem.quantity,
              newSubtotal: cartItem.subtotal,
            });
          }),
          catchError((error) => {
            console.log(error);
            return of(
              CartActions.updateCartItemQuantityError({ cartItemId, amount })
            );
          })
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.deleteCartItem),
      mergeMap(({ cartItemId }) =>
        this._cart.deleteCartItem(cartItemId).pipe(
          map((deleted) => {
            if (deleted) {
              this._toastr.success('Producto eliminado del carrito', 'Exito');
              return CartActions.deleteCartItemSuccess({ cartItemId });
            } else {
              this._toastr.success('Algo salio mal al borrar', 'Error');
              return CartActions.deleteCartItemError({
                error: 'Algo salio mal',
              });
            }
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal', 'Error');
            return of(CartActions.deleteCartItemError({ error }));
          })
        )
      )
    )
  );

  getCartItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.getCartItems),
      mergeMap(() =>
        this._cart.getCartItems().pipe(
          map((cart) => {
            return CartActions.getCartItemsSuccess({ cartItems: cart.items });
          }),
          catchError((error) => of(CartActions.getCartItemsError({ error })))
        )
      )
    )
  );

  checkoutCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.oncheckout),
      mergeMap(({ shippingData }) =>
        this._cart.checkoutCart(shippingData).pipe(
          map((cart) => {
            console.log(cart);
            this._toastr.success('Compra realizada!', 'Exito');
            return CartActions.oncheckoutSuccess();
          }),
          catchError((err) =>
            of(CartActions.oncheckoutError({ error: err.message }))
          )
        )
      )
    )
  );
}
