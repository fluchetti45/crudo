import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/products/product.interface';

import {
  ProductDetail,
  ProductImage,
} from '../../models/products/productDetail.interface';

// APLICAR FILTROS
export const setProductFilter = createAction(
  '[Product List] Set product filter',
  props<{ filter: string }>()
);
//  GET PRODUCTS
export const getProducts = createAction('[Product List] Get products');

export const getProductsSuccess = createAction(
  '[Product List] Get products success',
  props<{ products: Product[]; error: null }>()
);

export const getProductsError = createAction(
  '[Product List] Get products error',
  props<{ error: string }>()
);

// GET PRODUCTS BY CATEGORY
export const getProductsByCategory = createAction(
  '[Product List] Get products by category',
  props<{ categoryId: string }>()
);

export const getProductsByCategorySuccess = createAction(
  '[Product List] Get products by category success',
  props<{ products: Product[] }>()
);

export const getProductsByCategoryError = createAction(
  '[Product List] Get products by category',
  props<{ error: string }>()
);

// GET PRODUCT
export const getProduct = createAction(
  '[Product Detail] Get product',
  props<{ productId: string }>()
);

export const getProductSucces = createAction(
  '[Product Detail] Get product success',
  props<{ productDetail: ProductDetail }>()
);

export const getProductError = createAction(
  '[Product Detail] Get product error',
  props<{ error: string }>()
);

// CREATE PRODUCT
export const createProduct = createAction(
  '[Product List] Create product',
  props<{ product: FormData }>()
);

export const createProductSuccess = createAction(
  '[Product List] Create product success',
  props<{ product: Product }>()
);

export const createProductError = createAction(
  '[Product List] Create product error',
  props<{ error: string }>()
);

// DELETE PRODUCT
export const deleteProduct = createAction(
  '[Product List] Delete product',
  props<{ productId: number }>()
);

export const deleteProductSuccess = createAction(
  '[Product List] Delete product success',
  props<{ productId: number }>()
);

export const deleteProductError = createAction(
  '[Product List] Delete product error',
  props<{ error: string }>()
);

// UPDATE PRODUCT
export const updateProduct = createAction(
  '[Product List] Update product',
  props<{ id: number; product: FormData }>()
);

export const updateProductSuccess = createAction(
  '[Product List] Update product success',
  props<{ product: Product }>()
);

export const updateProductError = createAction(
  '[Product List] Update product error',
  props<{ error: string }>()
);

// UPLOAD PRODUCT IMAGES
export const uploadProductImage = createAction(
  '[Product Detail] Upload product image',
  props<{ productId: number; files: File[] }>()
);

export const uploadProductImageSuccess = createAction(
  '[Product Detail] Upload product image success',
  props<{ productId: number; images: ProductImage[] }>()
);

export const uploadProductImageError = createAction(
  '[Product Detail] Upload product image error',
  props<{ error: string }>()
);
// UPDATE PRODUCT COVER
export const updateProductCover = createAction(
  '[Product Detail] Update product cover',
  props<{ productId: number; coverId: number }>()
);

export const updateProductCoverSuccess = createAction(
  '[Product Detail] Update product cover success',
  props<{ success: string; coverId: number }>()
);

export const updateProductCoverError = createAction(
  '[Product Detail] Update product cover error',
  props<{ error: string }>()
);

// REMOVE PRODUCT IMAGE
export const removeProductImage = createAction(
  '[Product Detail] Delete product image',
  props<{ imageId: number }>()
);

export const removeProductImageSuccess = createAction(
  '[Product Detail] Delete product image success',
  props<{ success: string; imageId: number }>()
);

export const removeProductImageError = createAction(
  '[Product Detail] Delete product image error',
  props<{ error: string }>()
);
