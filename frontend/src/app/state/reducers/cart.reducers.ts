import { createReducer, on } from '@ngrx/store';
import { CartState } from '../../models/cart/cart.state';
import * as CartActions from '../actions/cart.actions';
import { CartItem } from '../../models/cart/cartItem.iterface';

export const initialState: CartState = {
  loading: false,
  error: null,
  success: null,
  products: [],
  totalAmount: 0,
  totalItems: 0,
  isCheckoutComplete: false,
};

export const cartReducer = createReducer(
  initialState,
  // STOCK
  on(CartActions.validateProductStock, (state, props) => {
    return { ...state, loading: true };
  }),
  on(CartActions.validateProductStockSuccess, (state, props) => {
    return { ...state, loading: false };
  }),
  on(CartActions.validateProductStockError, (state, props) => {
    return { ...state, loading: false, eror: props.error };
  }),
  // AGRAGAR PRODUCTO
  on(CartActions.addProduct, (state, props) => {
    return { ...state, loading: true };
  }),
  on(CartActions.addProductSuccess, (state, { product }) => {
    // Verificamos si el producto ya existe en el carrito
    const existingProductIndex = state.products.findIndex(
      (p) => p.itemId === product.itemId
    );

    let updatedProducts: CartItem[];

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, actualizamos la cantidad
      updatedProducts = [...state.products];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantity: product.quantity,
      };
    } else {
      // Si el producto no existe, lo agregamos al carrito
      updatedProducts = [...state.products, product];
    }

    // Calculamos el totalAmount
    const totalAmount = updatedProducts.reduce(
      (total, product) => total + product.subtotal,
      0
    );

    const totalItems = updatedProducts.reduce(
      (total, p) => total + p.quantity,
      0
    );

    return {
      ...state,
      loading: false,
      products: updatedProducts,
      totalAmount: totalAmount,
      totalItems: totalItems,
    };
  }),
  // AGREGAR PRODUCTO AL CARRITO ERROR
  on(CartActions.addProductError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // OBTENER PRODUCTOS DEL CARRITO
  on(CartActions.getCartItems, (state, props) => {
    return { ...state, loading: true, error: null };
  }),
  // OBTENER PRODUCTOS DEL CARRITO EXITO
  on(CartActions.getCartItemsSuccess, (state, props) => {
    const totalAmount = props.cartItems.reduce(
      (total, product) => total + product.subtotal,
      0
    );
    const totalItems = props.cartItems.reduce(
      (total, product) => total + product.quantity,
      0
    );
    return {
      ...state,
      loading: false,
      error: null,
      products: props.cartItems,
      totalAmount: totalAmount,
      totalItems: totalItems,
    };
  }),
  // OBTENER PRODUCTOS DEL CARRITO ERROR
  on(CartActions.getCartItemsError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // BORRAR PRODUCTO DEL CARRITO
  on(CartActions.deleteCartItem, (state, props) => {
    return { ...state, loading: true };
  }),
  // BORRAR PRODUCTO DEL CARRITO EXITO
  on(CartActions.deleteCartItemSuccess, (state, props) => {
    const updatedProducts = [
      ...state.products.filter((p: CartItem) => p.itemId != props.cartItemId),
    ];
    const totalAmount = updatedProducts.reduce(
      (total, product) => total + product.subtotal,
      0
    );

    const totalItems = updatedProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );

    return {
      ...state,
      loading: false,
      products: updatedProducts,
      totalAmount: totalAmount,
      totalItems: totalItems,
    };
  }),
  // BORRAR PRODUCTO DEL CARRITO ERROR
  on(CartActions.deleteCartItemError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // ACUTALIZAR LA CANTIDAD DE PRODUCTO EN EL CARRITO
  on(CartActions.updateCartItemQuantity, (state, props) => {
    return { ...state, loading: true };
  }),
  // ACUTALIZAR LA CANTIDAD DE PRODUCTO EN EL CARRITO EXITO
  on(CartActions.updateCartItemQuantitySuccess, (state, props) => {
    const updatedProducts = state.products.map((p) =>
      p.itemId === props.itemId
        ? { ...p, quantity: props.newQuantity, subtotal: props.newSubtotal }
        : p
    );
    const totalAmount = updatedProducts.reduce(
      (total, product) => total + product.subtotal,
      0
    );

    const totalItems = updatedProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );

    return {
      ...state,
      loading: false,
      products: updatedProducts,
      totalAmount: totalAmount,
      totalItems: totalItems,
    };
  }),
  // ACUTALIZAR LA CANTIDAD DE PRODUCTO EN EL CARRITO ERROR
  on(CartActions.updateCartItemQuantityError, (state, props) => {
    return { ...state, loading: false, error: 'Algo salio mal' };
  }),
  // CHECKOUT CARRITO
  on(CartActions.oncheckout, (state, props) => {
    return { ...state, loading: true };
  }),
  on(CartActions.oncheckoutSuccess, (state) => {
    return initialState;
  }),
  on(CartActions.oncheckoutError, (state, props) => {
    return { ...state, error: props.error || 'Algo salio mal!' };
  })
);
