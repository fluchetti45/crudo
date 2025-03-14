import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import {
  selectCartItems,
  selectTotalAmount,
} from '../../app/state/selectors/cart.selectors';

import { ShippingData } from '../../app/models/order/order.interface';
import { ShippingService } from '../../services/shipping.service';
import { ShippingAddresComponent } from '../shipping-addres/shipping-addres.component';
import { ShippingDataFormComponent } from '../shipping-data-form/shipping-data-form.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShippingAddresComponent,
    ShippingDataFormComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  selectedAddressId: number | null = null;
  selectedAddress: ShippingData | null = null;
  cartItems$: Observable<any[]>;
  cartTotal$: Observable<number>;
  shippingData: ShippingData[] = [];
  constructor(
    private store: Store<AppState>,
    private _shipping: ShippingService
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectTotalAmount);

    this._shipping.getShippingData().subscribe({
      next: (res) => {
        this.shippingData = res;
      },
    });
  }

  onAddressSelected(addressId: number): void {
    if (this.selectedAddressId === addressId) {
      this.selectedAddressId = null;
      this.selectedAddress = null;
      return;
    } else {
      this.selectedAddressId = addressId;
      this.selectedAddress = this.shippingData.find(
        (address) => address.id === addressId
      )!;
    }
  }
}
