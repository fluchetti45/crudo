import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShippingData } from '../../app/models/order/order.interface';
import {
  FormBuilder,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-address-modal',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './address-modal.component.html',
  styleUrl: './address-modal.component.css',
})
export class AddressModalComponent {
  @Input() address!: ShippingData;
  @Output() save = new EventEmitter<ShippingData>();
  @Output() cancel = new EventEmitter<void>();

  addressForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      id: [this.address.id],
      firstName: [this.address.firstName, Validators.required],
      lastName: [this.address.lastName, Validators.required],
      email: [this.address.email, [Validators.required, Validators.email]],
      address: [this.address.address, Validators.required],
      city: [this.address.city, Validators.required],
      postalCode: [this.address.postalCode, Validators.required],
      country: [this.address.country, Validators.required],
    });
  }

  onSave(): void {
    if (this.addressForm.valid) {
      this.save.emit(this.addressForm.value);
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
