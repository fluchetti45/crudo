import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { oncheckout } from '../../app/state/actions/cart.actions';
import { NgIf } from '@angular/common';
import { ShippingService } from '../../services/shipping.service';
import { Router } from '@angular/router';
import { ShippingData } from '../../app/models/order/order.interface';

@Component({
  selector: 'app-shipping-data-form',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './shipping-data-form.component.html',
  styleUrl: './shipping-data-form.component.css',
})
export class ShippingDataFormComponent implements OnChanges {
  checkoutForm: FormGroup;
  @Input() creating: boolean = true;
  @Input() selectedAddress: ShippingData | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private _store: Store<AppState>,
    private _shipping: ShippingService,
    private _router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAddress']) {
      if (this.selectedAddress) {
        this.patchFormValues(); // Primero actualiza el formulario
        //this.disableFormControls(); // Luego deshabilita los controles
      } else {
        //this.enableFormControls(); // Habilita los campos si no hay dirección
        this.checkoutForm.reset(); // Resetea el formulario para crear una nueva dirección
      }
    }
  }

  patchFormValues(): void {
    if (this.selectedAddress) {
      this.checkoutForm.patchValue({
        id: this.selectedAddress.id || null,
        firstName: this.selectedAddress.firstName,
        lastName: this.selectedAddress.lastName,
        email: this.selectedAddress.email,
        address: this.selectedAddress.address,
        city: this.selectedAddress.city,
        country: this.selectedAddress.country,
        postalCode: this.selectedAddress.postalCode,
      });
    }
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      // Despacho la action
      this._store.dispatch(
        oncheckout({ shippingData: this.checkoutForm.value })
      );
    } else {
      console.log('INVALID FORM');
    }
  }
}
