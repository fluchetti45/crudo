import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { getCategories } from './state/actions/categories.actions';
import { FooterComponent } from '../components/footer/footer.component';
import { getCartItems } from './state/actions/cart.actions';
import { loadWishlist } from './state/actions/wishlist.actions';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  title = 'Crudo';

  constructor(private _store: Store<AppState>) {}

  ngOnInit(): void {
    this._store.dispatch(getCategories());

    // Suscribirse al estado de autenticación
    this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        // Si el usuario está autenticado, cargar su carrito y wishlist
        this._store.dispatch(getCartItems());
        this._store.dispatch(loadWishlist());
      }
    });

    // Solo manejar la redirección si hay un hash en la URL (indicando un callback de Auth0)
    if (window.location.hash && window.location.hash.includes('state=')) {
      this._authService.handleRedirectCallback().subscribe({
        next: (result) => {
          // Remover el hash de la URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Navegar a la URL guardada o al home
          const targetUrl = result?.appState?.target || '/';
          this._router.navigateByUrl(targetUrl);
        },
        error: (error) => {
          console.error('Error handling redirect:', error);
          this._router.navigate(['/']);
        },
      });
    }
  }
}
