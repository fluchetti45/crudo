import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/cart/cartItem.iterface';
import { AddCartItem } from '../../models/cart/addCartItem.interface';
import { ShippingData } from '../../models/order/order.interface';

// VALIDAR STOCK DEL PRODUCTO
export const validateProductStock = createAction(
  '[Cart] Validate stock',
  props<{ productId: number; quantity: number }>()
);

export const validateProductStockSuccess = createAction(
  '[Cart] Validate stock success',
  props<{ productId: number; quantity: number }>()
);

export const validateProductStockError = createAction(
  '[Cart] Validate stock error',
  props<{ error: string }>()
);

// AGREGAR PRODUCTO AL CARRITO

export const addProduct = createAction(
  '[Cart] Add product to cart',
  props<{ item: AddCartItem; availableStock: number }>()
);

export const addProductSuccess = createAction(
  '[Cart] Add product to cart success',
  props<{ product: CartItem }>()
);

export const addProductError = createAction(
  '[Cart] Add product to cart error',
  props<{ error: string }>()
);

// OBTENER PRODUCTOS DEL CARRITO

export const getCartItems = createAction('[Cart] Get cart items');

export const getCartItemsSuccess = createAction(
  '[Cart] Get cart items success',
  props<{ cartItems: CartItem[] }>()
);

export const getCartItemsError = createAction(
  '[Cart] Get cart items error',
  props<{ error: string }>()
);

// ELIMINAR PRODUCTO DEL CARRITO
export const deleteCartItem = createAction(
  '[Cart] Delete cart item',
  props<{ cartItemId: number }>()
);

export const deleteCartItemSuccess = createAction(
  '[Cart] Delete cart item success',
  props<{ cartItemId: number }>()
);

export const deleteCartItemError = createAction(
  '[Cart] Delete cart item error',
  props<{ error: string }>()
);

// MODIFICAR CANTIDAD DE PRODUCTO EN CARRITO
export const updateCartItemQuantity = createAction(
  '[Cart] Update cart item quantity',
  props<{ cartItemId: number; amount: number }>()
);

export const updateCartItemQuantitySuccess = createAction(
  '[Cart] Update cart item quantity success',
  props<{ itemId: number; newQuantity: number; newSubtotal: number }>()
);

export const updateCartItemQuantityError = createAction(
  '[Cart] Update cart item quantity error',
  props<{ cartItemId: number; amount: number }>()
);

// CHECKOUT DEL CARRITO
export const oncheckout = createAction(
  '[Cart] Checkout cart',
  props<{ shippingData: ShippingData }>()
);

export const oncheckoutSuccess = createAction('[Cart] Checkout cart success');

export const oncheckoutError = createAction(
  '[Cart] Checkout cart error',
  props<{ error: string }>()
);
