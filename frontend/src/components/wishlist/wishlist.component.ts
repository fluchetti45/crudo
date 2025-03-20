import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectWishlistItems } from '../../app/state/selectors/wishlist.selectors';
import { AppState } from '../../app/app.state';
import { WishlistItem } from '../../app/models/wishlist/wishlistItem.interface';
import { Observable } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-wishlist',
  imports: [AsyncPipe, NgFor, NgIf, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  wishlistItems$: Observable<WishlistItem[]> = new Observable();
  constructor(private _store: Store<AppState>) {
    this.wishlistItems$ = this._store.select(selectWishlistItems);
  }
}
