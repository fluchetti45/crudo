import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../app/models/categories/category.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import {
  selectCategoryList,
  selectLoading,
} from '../../app/state/selectors/categories.selectors';
import { CategoryDetailComponent } from '../category-detail/category-detail.component';

@Component({
  selector: 'app-ui-block-categories',
  imports: [NgIf, NgFor, CategoryDetailComponent, AsyncPipe],
  templateUrl: './ui-block-categories.component.html',
  styleUrl: './ui-block-categories.component.css',
})
export class UiBlockCategoriesComponent {
  loading$: Observable<boolean> = new Observable();
  categories$: Observable<Category[]> = new Observable();

  constructor(private _store: Store<AppState>) {
    this.loading$ = this._store.select(selectLoading);
    this.categories$ = this._store.select(selectCategoryList);
  }
}
