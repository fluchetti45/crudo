import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setProductFilter } from '../../app/state/actions/products.actions';
import { AppState } from '../../app/app.state';
import { CommonModule } from '@angular/common'; // Necesario para ngModel
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar CommonModule y FormsModule
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  selectedFilter: string = ''; // Valor por defecto

  constructor(private _store: Store<AppState>) {}

  onFilterChange() {
    this._store.dispatch(setProductFilter({ filter: this.selectedFilter }));
  }
}
