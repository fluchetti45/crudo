import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { NgFor, NgIf } from '@angular/common';
import { StatusService } from '../../services/status.service';

import { Status } from '../../app/models/status/status.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ui-block-status-detail',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './ui-block-status-detail.component.html',
  styleUrl: './ui-block-status-detail.component.css',
})
export class UiBlockStatusDetailComponent implements OnInit {
  statusForm: FormGroup;
  isEditing = false;
  editingStatusId: number | null = null;
  private _toastr = inject(ToastrService);
  filterForm: FormGroup;
  statuses$: Status[] = [];

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private status: StatusService
  ) {
    this.statusForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
    this.filterForm = this.formBuilder.group({
      filterName: [''],
    });
    this.status.getStatuses().subscribe({
      next: (res) => (this.statuses$ = res),
      error: (err) => console.log(err),
    });
  }

  ngOnInit(): void {
    console.log(this.statuses$);
  }

  onSubmit() {
    if (this.statusForm.valid) {
      // Esta creando
      if (!this.isEditing) {
        this.status
          .createStatus(this.statusForm.controls['name'].value)
          .subscribe({
            next: (res) => {
              this.statuses$.push(res);
              this._toastr.success('Status registrado', 'Exito!');
            },
            error: (err) => console.log(err),
          });
      }
      // Esta editando
      else {
        const status: Status = {
          id: this.editingStatusId!,
          name: this.statusForm.controls['name'].value,
        };
        this.status.updateStatus(status).subscribe({
          next: (res) => {
            // Actualizar la lista de status.
            console.log(res);
            console.log(this.statuses$);
            this.statuses$ = this.statuses$.map((status) =>
              status.id === res.id ? { ...status, name: res.name } : status
            );
            this._toastr.success('Status modificado', 'Exito!');
            this.statuses$;
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
      this.statusForm.reset();
      this.isEditing = false;
      this.editingStatusId = null;
    }
  }
  cancelEdit() {
    this.isEditing = false;
    this.editingStatusId = null;
    this.statusForm.reset();
  }

  editStatus(status: Status) {
    this.isEditing = true;
    this.editingStatusId = status.id;
    this.statusForm.patchValue({ name: status.name });
  }

  deleteStatus(statusId: number) {
    if (window.confirm('Borrar estado de orden?')) {
      this.status.deleteStatus(statusId).subscribe({
        next: (res) => {
          this.statuses$ = this.statuses$.filter(
            (status) => status.id !== res.id
          );
          this._toastr.success('Status eliminado', 'Exito!');
        },
        error: (err) => console.log(err),
      });
    }
  }
}
