import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../../../services/categories.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
  createCategory,
  createCategoryError,
  createCategorySuccess,
  deleteCategory,
  deleteCategoryError,
  deleteCategorySuccess,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  getCategory,
  getCategoryError,
  getCategorySuccess,
  getTopCategories,
  getTopCategoriesError,
  getTopCategoriesSuccess,
  updateCategory,
  updateCategoryError,
  updateCategorySuccess,
} from '../actions/categories.actions';

@Injectable()
export class CategoriesEffects {
  private _actions$ = inject(Actions);
  private _categories = inject(CategoriesService);
  private _toastr = inject(ToastrService);

  // GET ALL CATEGORIES
  loadCategories$ = createEffect(() =>
    this._actions$.pipe(
      ofType(getCategories),
      mergeMap(() =>
        this._categories.getCategories().pipe(
          map((categories) => getCategoriesSuccess({ categories: categories })),
          catchError((error) =>
            of(
              getCategoriesError({ error: error.message || 'Ocurrio un error' })
            )
          )
        )
      )
    )
  );
  // GET TOP CATEGORIES
  loadTopCategories$ = createEffect(() =>
    this._actions$.pipe(
      ofType(getTopCategories),
      mergeMap(() =>
        this._categories.getTopCategories().pipe(
          map((topCategories) =>
            getTopCategoriesSuccess({ topCategories: topCategories })
          ),
          catchError((error) =>
            of(
              getTopCategoriesError({
                error: error.message || 'Ocurrio un error',
              })
            )
          )
        )
      )
    )
  );

  // GET CATEGORY
  loadCategory$ = createEffect(() =>
    this._actions$.pipe(
      ofType(getCategory),
      mergeMap((categoryId) =>
        this._categories.getCategory(categoryId.categoryId).pipe(
          map((category) => getCategorySuccess({ category: category })),
          catchError((error) =>
            of(getCategoryError({ error: error.message || 'Ocurrio un error' }))
          )
        )
      )
    )
  );

  // DELETE CATEGORY
  deleteCategory$ = createEffect(() =>
    this._actions$.pipe(
      ofType(deleteCategory),
      mergeMap((categoryId) =>
        this._categories.deleteCategory(categoryId.categoryId).pipe(
          map(
            (category) => {
              this._toastr.success('Categoria borrada.', 'Exito');
              return deleteCategorySuccess(categoryId);
            },
            catchError((error) => {
              this._toastr.error('Algo salio mal...', 'Error');
              return of(
                deleteCategoryError({
                  error: error.message || 'Ocurrio un error',
                })
              );
            })
          )
        )
      )
    )
  );

  // CREATE CATEGORY

  createCategory$ = createEffect(() =>
    this._actions$.pipe(
      ofType(createCategory),
      mergeMap(({ category }) =>
        this._categories.createCategory(category).pipe(
          map((category) => {
            this._toastr.success('Categoria creada', 'Exito');
            return createCategorySuccess({ category: category });
          }),
          catchError((error) => {
            this._toastr.error('Algo fallo', 'Error');
            return of(
              createCategoryError({ error: error.message || 'Algo salio mal' })
            );
          })
        )
      )
    )
  );

  // UPDATE CATEGORY
  updateCategory$ = createEffect(() =>
    this._actions$.pipe(
      ofType(updateCategory),
      mergeMap(({ category }) =>
        this._categories.updateCategory(category).pipe(
          map((category) => {
            this._toastr.success('Categoria actualizada', 'Exito!');
            return updateCategorySuccess({ category: category });
          }),
          catchError((error) => {
            this._toastr.error('Algo salio mal..', 'Error');
            return of(
              updateCategoryError({ error: error.message || 'Algo salio mal' })
            );
          })
        )
      )
    )
  );
}
