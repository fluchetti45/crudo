import { Component, Input } from '@angular/core';
import { Order } from '../../app/models/order/order.interface';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [NgClass, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {
  @Input() order!: Order;

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success text-white';
      case 'processing':
        return 'bg-warning text-dark';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }
}
