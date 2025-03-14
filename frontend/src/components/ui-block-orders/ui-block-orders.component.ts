import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { OrderComponent } from '../order/order.component';
import { Observable } from 'rxjs';
import { Order } from '../../app/models/order/order.interface';
import { OrdersService } from '../../services/order.service';

@Component({
  selector: 'app-ui-block-orders',
  imports: [NgIf, NgFor, OrderComponent],
  templateUrl: './ui-block-orders.component.html',
  styleUrl: './ui-block-orders.component.css',
})
export class UiBlockOrdersComponent implements OnInit {
  private _orders = inject(OrdersService);
  orders$: Order[] = [];
  loading$: boolean = true;

  ngOnInit(): void {
    this._orders.getOrders().subscribe({
      next: (res) => {
        this.orders$ = res;
        this.loading$ = false;
        console.log(this.orders$);
      },
      error: (err) => {
        console.log(err);
        this.loading$ = false;
      },
    });
  }
}
