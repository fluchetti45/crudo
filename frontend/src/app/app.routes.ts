import { Routes } from '@angular/router';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { UiBlockProductDetailComponent } from '../components/ui-block-product-detail/ui-block-product-detail.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { ProductFormComponent } from '../components/product-form/create-product-form.component';
import { UiBlockProductsByCategoryComponent } from '../components/ui-block-products-by-category/ui-block-products-by-category.component';
import { UiBlockCartDetailComponent } from '../components/ui-block-cart-detail/ui-block-cart-detail.component';
import { UiBlockCategoriesDetailComponent } from '../components/ui-block-categories-detail/ui-block-categories-detail.component';
import { UiBlockCategoriesComponent } from '../components/ui-block-categories/ui-block-categories.component';
import { AboutComponent } from '../components/about/about.component';
import { FaqComponent } from '../components/faq/faq.component';
import { ContactComponent } from '../components/contact/contact.component';
import { TermsComponent } from '../components/terms/terms.component';
import { PrivacyComponent } from '../components/privacy/privacy.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { adminGuard } from './guards/admin.guard';
import { UiBlockOrdersComponent } from '../components/ui-block-orders/ui-block-orders.component';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { UiBlockStatusDetailComponent } from '../components/ui-block-status-detail/ui-block-status-detail.component';
import { SearchProductsComponent } from '../components/search-products/search-products.component';
import { UiBlockOrdersDetailComponent } from '../components/ui-block-orders-detail/ui-block-orders-detail.component';
import { ShippingDataFormComponent } from '../components/shipping-data-form/shipping-data-form.component';
import { ProductEditComponent } from '../components/product-edit/product-edit.component';
import { UiBlockProductsDetailComponent } from '../components/ui-block-products-detail/ui-block-products-detail.component';
import { ReturnsComponent } from '../components/returns/returns.component';
import { ShippingComponent } from '../components/shipping/shipping.component';
import { PendingReviewsComponent } from '../components/pending-reviews/pending-reviews.component';
import { UiBlockReviewsComponent } from '../components/ui-block-reviews/ui-block-reviews.component';
import { ReviewFormComponent } from '../components/review-form/review-form.component';
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'categories', component: UiBlockCategoriesComponent },
  { path: 'category/:id', component: UiBlockProductsByCategoryComponent },
  {
    path: 'admin-products',
    component: UiBlockProductsDetailComponent,
    canActivate: [AuthGuard, adminGuard],
  },
  {
    path: 'admin-categories',
    component: UiBlockCategoriesDetailComponent,
    canActivate: [AuthGuard, adminGuard],
  },
  {
    path: 'admin-status',
    component: UiBlockStatusDetailComponent,
    canActivate: [AuthGuard, adminGuard],
  },
  {
    path: 'admin-orders',
    component: UiBlockOrdersDetailComponent,
    canActivate: [AuthGuard, adminGuard],
  },
  { path: 'products', component: SearchProductsComponent },
  { path: 'product/:id', component: UiBlockProductDetailComponent },
  {
    path: 'create-product',
    component: ProductFormComponent,
    canActivate: [AuthGuard, adminGuard],
  },
  {
    path: 'edit-product/:id',
    component: ProductEditComponent,
    canActivate: [AuthGuard, adminGuard],
  },
  { path: 'cart', component: UiBlockCartDetailComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/reviews',
    component: UiBlockReviewsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/pending-review/:id',
    component: ReviewFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: UiBlockOrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-shipping-address',
    component: ShippingDataFormComponent,
    canActivate: [AuthGuard],
  },
  { path: 'about', component: AboutComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'shipping', component: ShippingComponent },
  { path: 'returns', component: ReturnsComponent },
  { path: '**', component: NotFoundComponent },
];
