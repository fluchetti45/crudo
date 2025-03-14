import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShippingData } from '../../app/models/order/order.interface';

@Component({
  selector: 'app-shipping-addres',
  imports: [],
  templateUrl: './shipping-addres.component.html',
  styleUrl: './shipping-addres.component.css',
})
export class ShippingAddresComponent {
  @Input() address!: ShippingData;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<void>();

  onSelect() {
    this.selected.emit();
  }
}
