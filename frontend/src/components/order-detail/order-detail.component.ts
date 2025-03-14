import { Component, inject, OnInit } from '@angular/core';

import { OrdersService } from '../../services/order.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Order, OrderDetail } from '../../app/models/order/order.interface';
import { OrderUtils } from '../../utils/order-utils';
@Component({
  selector: 'app-order-detail',
  imports: [DatePipe, NgClass, NgIf, CurrencyPipe, NgFor, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  order: OrderDetail | null;

  orderId: number;
  loading: boolean = true;
  private _route = inject(ActivatedRoute);
  private _order = inject(OrdersService);

  constructor() {
    this.order = null;
    this.orderId = 0;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.orderId = params['id']; // 'id' es el nombre del parámetro en la ruta
    });
    if (this.orderId != 0) {
      this._order.getOrder(this.orderId).subscribe({
        next: (res) => {
          console.log(res);
          this.order = res;

          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
    }
  }
  getStatusClass(status: string) {
    return OrderUtils.getStatusClass(status);
  }
}
