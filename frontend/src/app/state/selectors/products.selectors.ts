import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';
import { ProductsState } from '../../models/products/products.state';

export const selectProductsFeature = (state: AppState) => state.products;

export const selectLoading = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.loading
);

export const selectProductList = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.products
);

export const selectProductDetail = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.productDetail
);

export const selectSuccess = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.success
);

export const selectError = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.error
);

export const selectProductDelete = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.productDeleted
);

export const selectFilter = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.filter
);

export const selectFilteredProducts = createSelector(
  selectProductsFeature,
  (state: ProductsState) => {
    let sortedProducts = [...state.products];

    // Aplicar el filtro seleccionado
    switch (state.filter) {
      case 'priceAsc':
        sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts = sortedProducts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'oldest':
        sortedProducts = sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }
    return sortedProducts;
  }
);
