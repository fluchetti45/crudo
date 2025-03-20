import { Component, inject, OnInit } from '@angular/core';
import { AuthButtonComponent } from '../authButton';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { selectCategoryList } from '../../app/state/selectors/categories.selectors';
import { Category } from '../../app/models/categories/category.interface';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';

import { selectTotalItems } from '../../app/state/selectors/cart.selectors';

@Component({
  selector: 'app-navbar',
  imports: [AuthButtonComponent, RouterLink, AsyncPipe, NgFor, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  categories$: Observable<Category[]> = new Observable();
  cartItems$: Observable<number> = new Observable();
  private auth = inject(AuthService);
  private _router = inject(Router);

  isAuthenticated$ = this.auth.isAuthenticated$;
  isAdmin$ = this.auth.user$.pipe(
    map((user) => user?.['https://crudo.com/claims/roles']?.includes('Admin'))
  );

  constructor(private _store: Store<AppState>) {}

  ngOnInit(): void {
    this.categories$ = this._store.select(selectCategoryList);
    this.cartItems$ = this._store.select(selectTotalItems);
  }

  onSearch() {
    this._router.navigate(['products']);
  }
}
