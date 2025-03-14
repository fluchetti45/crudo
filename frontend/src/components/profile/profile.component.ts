import { Component, inject, Input, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService, User } from '@auth0/auth0-angular';
import { RouterLink, RouterModule } from '@angular/router';
import { ShippingData } from '../../app/models/order/order.interface';
import { ShippingService } from '../../services/shipping.service';
import { ShippingAddresComponent } from '../shipping-addres/shipping-addres.component';

import { AddressModalComponent } from '../address-modal/address-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule, AddressModalComponent],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private _shipping = inject(ShippingService);
  private _toastr = inject(ToastrService);
  isAuthenticated$ = this.auth.isAuthenticated$;
  user$ = this.auth.user$;
  shippingData: ShippingData[] = [];
  showModal: boolean = false;
  selectedAddress: null | ShippingData = null;
  constructor() {
    this._shipping.getShippingData().subscribe({
      next: (res) => (this.shippingData = res),
      error: (err) => console.log(err),
    });
  }

  ngOnInit() {
    // Obtener y almacenar el token cuando el usuario se autentica
    this.auth.getAccessTokenSilently().subscribe({
      next: (token) => {
        localStorage.setItem('auth_token', token);
      },
      error: (err) => console.error('Error al obtener el token:', err),
    });

    // Observar cambios en la autenticación
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        localStorage.removeItem('auth_token');
      }
    });
  }

  login() {
    this.auth.loginWithRedirect({
      appState: { target: window.location.pathname },
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  editAddress(address: ShippingData) {
    this.selectedAddress = { ...address }; // Create a copy to avoid direct mutation
    this.showModal = true;
  }

  saveAddress(updatedAddress: ShippingData) {
    console.log('CAMBIOS.. NUEVA ADDRESS', updatedAddress);

    this._shipping.editShippingData(updatedAddress).subscribe({
      next: (res) => {
        // Actualiza la dirección en shippingData
        this.shippingData = this.shippingData.map((d) =>
          d.id === updatedAddress.id ? updatedAddress : d
        );
        this._toastr.success('Datos editados', 'Exito!');
      },
      error: (err) => {
        this._toastr.error('Algo salio mal', 'Error');
      },
    });
    // Resetear la dirección seleccionada y cerrar el modal
    this.selectedAddress = null;
    this.closeModal();
  }

  cancelEdit() {
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.selectedAddress = null;
  }

  deleteAddress(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      //this._shipping.deleteShippingData(id).subscribe(() => {
      //this.loadAddresses() // Reload addresses after delete
      console.log('Borrando..');
    }
  }
}
