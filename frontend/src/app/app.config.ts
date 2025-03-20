import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { productsReducer } from './state/reducers/products.reducers';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { ProductsEffects } from './state/effects/products.effects';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CategoriesEffects } from './state/effects/categories.effects';
import { categoriesReducer } from './state/reducers/categories.reducers';
import { cartReducer } from './state/reducers/cart.reducers';
import { CartEffects } from './state/effects/cart.effects';
import { authInterceptor } from './interceptors/auth.interceptor';
import { wishlistReducer } from './state/reducers/wishlist.reducer';
import { WishlistEffects } from './state/effects/wishlist.effects';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAuth0({
      domain: 'dev-0jqcv570c243l2th.us.auth0.com',
      clientId: 'snOfvwrrz3qQwcBNInVyXZiNdwKYa0wB',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'http://localhost:5075',
        scope: 'openid profile email',
      },
      cacheLocation: 'memory',
      useRefreshTokensFallback: false,
      sessionCheckExpiryDays: 0,
    }),
    provideStore({
      products: productsReducer,
      categories: categoriesReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([
      ProductsEffects,
      CategoriesEffects,
      CartEffects,
      WishlistEffects,
    ]),
    provideToastr(),
    provideAnimations(),
  ],
};
