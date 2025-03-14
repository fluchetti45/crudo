import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '../../../services/products.service';
import { catchError, EMPTY, map, mergeMap, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  createProduct,
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
import { Router } from '@angular/router';
import { ProductImageService } from '../../../services/productImage.service';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private _products = inject(ProductService);
  private _images = inject(ProductImageService);
  private _toastr = inject(ToastrService);
  private _router = inject(Router);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProducts),
      mergeMap(() =>
        this._products.getProducts().pipe(
          map((products) => {
            return getProductsSuccess({ products: products, error: null });
          }),
          catchError((error) =>
            of(getProductsError({ error: error.message || 'Algo salio mal..' }))
          )
        )
      )
    )
  );

  loadProductsByCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProductsByCategory),
      mergeMap((categoryId) =>
        this._products
          .getProductsByCategory(Number(categoryId.categoryId))
          .pipe(
            map((products) => {
              return getProductsByCategorySuccess({ products: products });
            }),
            catchError((error) =>
              of(
                getProductsByCategoryError({
                  error: error.message || 'Algo salio mal..',
                })
              )
            )
          )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProduct),
      mergeMap(({ productId }) =>
        this._products.getProduct(productId).pipe(
          map(
            (product) => {
              return getProductSucces({ productDetail: product });
            },
            catchError((error) =>
              of(
                getProductError({ error: error.message || 'Algo salio mal!!' })
              )
            )
          )
        )
      )
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProduct),
      mergeMap(({ product }) =>
        this._products.createProduct(product).pipe(
          map((product) => {
            this._toastr.success('Producto creado.', 'Exito!');
            this._router.navigate(['product/', product.id]);
            return createProductSuccess({ product: product });
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal.', 'Error');
            return of(
              deleteProductError({
                error: error.message || 'Algo salio mal',
              })
            );
          })
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProduct),
      mergeMap(({ productId }) =>
        this._products.deleteProduct(productId).pipe(
          map(() => {
            this._toastr.success('Estado actualizado.', 'Exito!');
            return deleteProductSuccess({ productId: productId });
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal.', 'Error');
            return of(
              deleteProductError({
                error: error.message || 'Algo salio mal',
              })
            );
          })
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProduct),
      mergeMap(({ id, product }) =>
        this._products.updateProduct(id, product).pipe(
          map((product) => {
            this._toastr.success('Producto editado', 'Exito!');
            return updateProductSuccess({ product: product });
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal', 'Error');
            return of(
              updateProductError({ error: error.message || 'Algo salio mal' })
            );
          })
        )
      )
    )
  );

  uploadProductImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadProductImage),
      mergeMap(({ productId, files }) =>
        this._images.uploadImage(productId, files).pipe(
          map((images) => {
            this._toastr.success('Imagenes subidas', 'Exito');
            return uploadProductImageSuccess({
              productId: productId,
              images: images,
            });
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal', 'Error');
            return of(
              uploadProductImageError({
                error: error.message || 'Algo salio mal',
              })
            );
          })
        )
      )
    )
  );

  updateProductCover$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductCover),
      mergeMap(({ productId, coverId }) =>
        this._images.updateCover(productId, coverId).pipe(
          map(() => {
            this._toastr.success('Portada actualizada', 'Exito!');
            return updateProductCoverSuccess({
              success: 'Exito',
              coverId: coverId,
            });
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal', 'Error');
            return of(
              updateProductCoverError({
                error: error.message || 'Algo salio mal',
              })
            );
          })
        )
      )
    )
  );

  deleteProductImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeProductImage),
      mergeMap(({ imageId }) =>
        this._images.deleteImage(imageId).pipe(
          map(() => {
            this._toastr.success('Imagen eliminada', 'Exito');
            return removeProductImageSuccess({
              imageId: imageId,
              success: 'Eliminada',
            });
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal', 'Error');
            return of(
              removeProductImageError({
                error: error.message || 'Algo salio mal',
              })
            );
          })
        )
      )
    )
  );
}
