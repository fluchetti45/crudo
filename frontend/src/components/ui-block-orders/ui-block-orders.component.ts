import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { Order } from '../../app/models/order/order.interface';
import { OrdersService } from '../../services/order.service';
import { ReviewService } from '../../services/review.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-ui-block-orders',
  imports: [NgIf, NgFor, OrderComponent, RouterLink],
  templateUrl: './ui-block-orders.component.html',
  styleUrl: './ui-block-orders.component.css',
})
export class UiBlockOrdersComponent implements OnInit {
  private _orders = inject(OrdersService);
  private _review = inject(ReviewService);
  orders$: Order[] = [];
  loading$: boolean = true;
  countPendingReviews$: number = 0;

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
    this._review.getCountPendingReviews().subscribe({
      next: (res) => {
        this.countPendingReviews$ = res;
      },
    });
  }
}
