import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getProducts } from '../../app/state/actions/products.actions';

import { Observable } from 'rxjs';
import {
  selectError,
  selectLoading,
} from '../../app/state/selectors/products.selectors';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';

import { UiBlockProductsComponent } from '../ui-block-products/ui-block-products.component';
import { AppState } from '../../app/app.state';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-home-page',
  imports: [
    AsyncPipe,
    NgIf,
    UiBlockProductsComponent,
    ErrorComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private _store: Store<AppState> = inject(Store);
  loading$: Observable<boolean> = new Observable();
  error$: Observable<string | null> = new Observable();
  testimonials = [
    {
      author: 'Juan Pérez',
      comment: 'Excelente calidad y servicio. ¡Totalmente recomendado!',
    },
    {
      author: 'María García',
      comment: 'Los productos superaron mis expectativas. Volveré a comprar.',
    },
    {
      author: 'Carlos Rodríguez',
      comment: 'Entrega rápida y productos en perfecto estado. Muy satisfecho.',
    },
  ];

  ngOnInit(): void {
    this._store.dispatch(getProducts());
    this.loading$ = this._store.select(selectLoading);
    this.error$ = this._store.select(selectError);
  }
}
