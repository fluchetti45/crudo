import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';

@Component({
  imports: [NgIf, AsyncPipe],
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <a href="#" (click)="logout()" class="btn-logout">
        <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
      </a>
    </ng-container>

    <ng-template #loggedOut>
      <button class="btn btn-primary rounded-pill px-4" (click)="login()">
        <i class="bi bi-person me-2"></i>Iniciar Sesión
      </button>
    </ng-template>
  `,
  styles: [
    `
      .btn-logout {
        color: #dc3545;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
      }
      .btn-logout:hover {
        color: #bb2d3b;
      }
    `,
  ],
  standalone: true,
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  async logout() {
    // Limpiar cualquier dato de sesión local
    localStorage.clear();
    sessionStorage.clear();

    // Logout de Auth0 y del Identity Provider
    await this.auth.logout({
      logoutParams: {
        returnTo: document.location.origin,
        // Asegurarse de cerrar la sesión del IdP también
        federated: true,
        // Forzar el cierre completo de sesión
        localOnly: false,
        // Forzar que se abra en la misma ventana
        openUrl: false,
      },
    });
  }

  async login() {
    await this.auth.loginWithRedirect({
      authorizationParams: {
        prompt: 'login',
      },
    });
  }
}
