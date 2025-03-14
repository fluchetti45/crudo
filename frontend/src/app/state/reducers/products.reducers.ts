import { createReducer, on } from '@ngrx/store';
import {
  createProduct,
  createProductError,
  createProductSuccess,
  deleteProduct,
  deleteProductError,
  deleteProductSuccess,
  getProduct,
  getProductError,
  getProducts,
  getProductsByCategory,
  getProductsByCategoryError,
  getProductsByCategorySuccess,
  getProductsError,
  getProductsSuccess,
  getProductSucces,
  removeProductImage,
  removeProductImageError,
  removeProductImageSuccess,
  setProductFilter,
  updateProduct,
  updateProductCover,
  updateProductCoverError,
  updateProductCoverSuccess,
  updateProductError,
  updateProductSuccess,
  uploadProductImage,
  uploadProductImageError,
  uploadProductImageSuccess,
} from '../actions/products.actions';
import { ProductsState } from '../../models/products/products.state';
import { StatusChangeEvent } from '@angular/forms';

export const initialState: ProductsState = {
  loading: false,
  products: [],
  productDetail: null,
  error: null,
  success: null,
  productDeleted: false,
  filter: null,
};

export const productsReducer = createReducer(
  initialState,
  // FILTRO
  on(setProductFilter, (state, props) => {
    return { ...state, filter: props.filter };
  }),
  // PRODUCTOS
  on(getProducts, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(getProductsSuccess, (state, props) => {
    return { ...state, loading: false, products: props.products, error: null };
  }),
  on(getProductsError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // PRODUCTOS POR CATEGORIA
  on(getProductsByCategory, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(getProductsByCategorySuccess, (state, props) => {
    return { ...state, loading: false, products: props.products, error: null };
  }),
  on(getProductsByCategoryError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // PRODUCTO
  on(getProduct, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(getProductSucces, (state, props) => {
    return {
      ...state,
      productDetail: props.productDetail,
      loading: false,
      error: null,
    };
  }),
  on(getProductError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // CREAR PRODUCTO
  on(createProduct, (state) => {
    return { ...state, loading: true };
  }),
  on(createProductSuccess, (state, props) => {
    return {
      ...state,
      loading: false,
      products: [...state.products, props.product],
      success: 'Producto creado',
    };
  }),
  on(createProductError, (state, props) => {
    return {
      ...state,
      loading: false,
      success: null,
      error: props.error,
    };
  }),
  // ACTUALIZAR PRODUCTO
  on(updateProduct, (state, props) => {
    return { ...state, loading: true };
  }),
  on(updateProductSuccess, (state, props) => {
    console.log('PRODUCTO EDITADO CON SUCCESS', props.product);
    return {
      ...state,
      loading: false,
      productDetail: state.productDetail
        ? {
            ...state.productDetail, // Conserva las propiedades actuales
            ...props.product, // Sobrescribe las propiedades que vinieron con la acción
          }
        : null, // Si no hay productDetail, no hacemos nada (o puedes asignar un valor por defecto)
    };
  }),
  on(updateProductError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // BORRAR PRODUCTO
  on(deleteProduct, (state) => {
    return { ...state, loading: true };
  }),
  on(deleteProductSuccess, (state, props) => {
    return {
      ...state,
      loading: false,
      products: [...state.products.filter((p) => p.id !== props.productId)],
      productDetail: null,
      productDeleted: true,
    };
  }),
  on(deleteProductError, (state, props) => {
    return {
      ...state,
      loading: false,
      productDeleted: false,
      error: props.error || 'Algo salio mal',
    };
  }),
  // SUBIR IMAGENES DEL PRODUCTO
  on(uploadProductImage, (state, props) => {
    return { ...state, loading: true };
  }),
  on(uploadProductImageSuccess, (state, props) => {
    return {
      ...state,
      loading: false,
      productDetail: state.productDetail
        ? {
            ...state.productDetail,
            productImages: [
              ...state.productDetail.productImages,
              ...props.images,
            ],
          }
        : null,
    };
  }),
  on(uploadProductImageError, (state, props) => {
    return { ...state, loading: false, error: props.error || 'Algo salio mal' };
  }),
  // ACTUALIZAR PORTADA
  on(updateProductCover, (state, props) => {
    return { ...state, loading: true };
  }),
  on(updateProductCoverSuccess, (state, props) => {
    return {
      ...state,
      productDetail: state.productDetail
        ? {
            ...state.productDetail,
            productImages: state.productDetail.productImages.map((image) => ({
              ...image,
              isCover: image.id === props.coverId,
            })),
          }
        : null,
      loading: false,
      success: props.success,
    };
  }),
  on(updateProductCoverError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  // REMOVER IMAGEN DE PRODUCTO
  on(removeProductImage, (state, props) => {
    return { ...state, loading: true };
  }),
  on(removeProductImageSuccess, (state, props) => {
    return {
      ...state,
      productDetail: state.productDetail
        ? {
            ...state.productDetail,
            productImages: state.productDetail.productImages.filter(
              (image) => image.id !== props.imageId
            ),
          }
        : null,
      loading: false,
      success: props.success,
    };
  }),
  on(removeProductImageError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  })
);
