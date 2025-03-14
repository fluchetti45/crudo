import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { Observable } from 'rxjs';

import {
  selectError,
  selectLoading,
} from '../../app/state/selectors/products.selectors';
import { UiBlockProductsComponent } from '../ui-block-products/ui-block-products.component';
import { getProductsByCategory } from '../../app/state/actions/products.actions';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getCategory } from '../../app/state/actions/categories.actions';
import { Category } from '../../app/models/categories/category.interface';
import { selectCategorytDetail } from '../../app/state/selectors/categories.selectors';
import { FilterComponent } from '../filter/filter.component';
import { UiBlocksProductsCategoryComponent } from '../ui-blocks-products-category/ui-blocks-products-category.component';

@Component({
  selector: 'app-ui-block-products-by-category',
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    FilterComponent,
    UiBlocksProductsCategoryComponent,
  ],
  templateUrl: './ui-block-products-by-category.component.html',
  styleUrl: './ui-block-products-by-category.component.css',
})
export class UiBlockProductsByCategoryComponent implements OnInit {
  categoryId: string | null = null;
  loading$: Observable<boolean> = new Observable();
  error$: Observable<string | null> = new Observable();
  category$: Observable<Category | null> = new Observable();
  constructor(private _store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryId = params.get('id');
      if (this.categoryId) {
        this._store.dispatch(
          getProductsByCategory({ categoryId: this.categoryId })
        );
        this._store.dispatch(
          getCategory({ categoryId: Number(this.categoryId) })
        );
      }
    });
    this.category$ = this._store.select(selectCategorytDetail);
    this.loading$ = this._store.select(selectLoading);
    this.error$ = this._store.select(selectError);
  }
}
