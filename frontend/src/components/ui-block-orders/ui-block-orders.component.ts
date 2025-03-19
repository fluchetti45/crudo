import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { Order } from '../../app/models/order/order.interface';
import { OrdersService } from '../../services/order.service';
import { ReviewService } from '../../services/review.service';
import { RouterLink } from '@angular/router';
import { PagedResult } from '../../app/models/common/paged-result.interface';
@Component({
  selector: 'app-ui-block-orders',
  imports: [NgIf, NgFor, OrderComponent, RouterLink],
  templateUrl: './ui-block-orders.component.html',
  styleUrl: './ui-block-orders.component.css',
})
export class UiBlockOrdersComponent implements OnInit {
  private _orders = inject(OrdersService);
  private _review = inject(ReviewService);
  pagedOrders$: PagedResult<Order> = {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  };
  loading$: boolean = true;
  countPendingReviews$: number = 0;

  ngOnInit(): void {
    this._orders.getOrders(null).subscribe({
      next: (res) => {
        this.pagedOrders$ = res;
        this.loading$ = false;
      },
      error: (err) => {
        this.loading$ = false;
      },
    });
    this._review.getCountPendingReviews().subscribe({
      next: (res) => {
        this.countPendingReviews$ = res;
      },
    });
  }

  getOrders(page: number) {
    this.loading$ = true;
    this._orders.getOrders(null, page).subscribe({
      next: (res) => {
        this.pagedOrders$ = res;
        this.loading$ = false;
      },
      error: (err) => {
        console.log(err);
        this.loading$ = false;
      },
    });
  }
}
