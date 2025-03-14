import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Modal } from 'bootstrap'; // Importar la clase Modal de Bootstrap

import { OrderAdmin } from '../../app/models/order/order.interface';
import { OrdersService } from '../../services/order.service';

import { Status } from '../../app/models/status/status.interface';
import { StatusService } from '../../services/status.service';
import { OrderUtils } from '../../utils/order-utils';

@Component({
  selector: 'app-ui-block-orders-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ui-block-orders-detail.component.html',
  styleUrl: './ui-block-orders-detail.component.css',
})
export class UiBlockOrdersDetailComponent implements AfterViewInit {
  orders: OrderAdmin[] = [];
  statuses: Status[] = [];
  searchForm: FormGroup;
  editForm: FormGroup;
  filterForm: FormGroup;
  currentOrderId: number | null = null;
  currentOrder: OrderAdmin | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  total: number = 0;
  @ViewChild('editOrderModal') modalElement!: ElementRef;
  private modal: any;

  constructor(
    private formBuilder: FormBuilder,
    private _order: OrdersService,
    private _status: StatusService
  ) {
    this.filterForm = this.formBuilder.group({
      status: [''],
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
    this.editForm = this.formBuilder.group({
      status: ['', Validators.required],
    });

    // Cargar órdenes iniciales
    this.loadOrders(null);

    this._status.getStatuses().subscribe({
      next: (res) => {
        console.log(res);
        this.statuses = res;
      },
      error: (err) => console.log(err),
    });

    // Suscribirse a cambios en el filtro
    this.filterForm.get('status')?.valueChanges.subscribe((statusId) => {
      this.loadOrders(statusId ? Number(statusId) : null);
    });
  }

  loadOrders(statusId: number | null) {
    this._order.getOrdersAdmin(statusId, this.currentPage).subscribe({
      next: (res) => {
        console.log(res);
        this.orders = res.items;
        this.totalPages = res.totalPages;
        this.total = res.total;
      },
      error: (err) => console.log(err),
    });
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.modalElement.nativeElement);
  }

  onSearch() {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    this._order.getUserOrdersAdmin(searchTerm).subscribe({
      next: (res) => (this.orders = res),
      error: (err) => console.log(err),
    });
  }

  previousPage() {
    this.currentPage--;
    this.loadOrders(this.filterForm.get('status')?.value);
  }

  nextPage() {
    this.currentPage++;
    this.loadOrders(this.filterForm.get('status')?.value);
  }
  editOrder(order: OrderAdmin): void {
    // Guardar la orden completa para mostrar detalles en el modal
    this.currentOrder = { ...order };
    this.currentOrderId = order.id;
    // Actualizar el formulario con el estado actual
    this.editForm.patchValue({
      status: order.status,
    });

    // Abrir el modal
    this.modal.show();
  }

  updateOrder() {
    if (this.currentOrderId) {
      const newStatusId = Number(this.editForm.controls['status'].value);
      this._order.updateOrder(this.currentOrderId, newStatusId).subscribe({
        next: (res) => {
          // Recargar las órdenes con el filtro actual
          const currentStatusId = this.filterForm.get('status')?.value;
          this.loadOrders(currentStatusId ? Number(currentStatusId) : null);
          this.modal.hide();
        },
        error: (err) => console.log(err),
      });
    }
  }

  getStatusClass(status: string): string {
    return OrderUtils.getStatusClass(status);
  }
}
