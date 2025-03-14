import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Category } from '../../app/models/categories/category.interface';
import { selectFilteredCategories } from '../../app/state/selectors/categories.selectors';
import * as CategoryActions from '../../app/state/actions/categories.actions';
import { UpdateCategory } from '../../app/models/categories/updateCategory.interface';
import { AppState } from '../../app/app.state';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ui-block-categories-detail.component.html',
  styleUrls: ['./ui-block-categories-detail.component.css'],
})
export class UiBlockCategoriesDetailComponent implements OnInit {
  filteredCategories$: Observable<Category[]>;
  categoryForm: FormGroup;
  isEditing = false;
  editingCategoryId: number | null = null;
  filterForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.filterForm = this.formBuilder.group({
      filterName: [''],
    });

    // Inicia con todas las categorías (sin filtro)
    this.filteredCategories$ = this.store.pipe(
      select(selectFilteredCategories('')) // Pasa un filtro vacío inicialmente
    );
  }

  ngOnInit() {
    // Se suscribe al valor del filtro y actualiza el observable de categorías filtradas
    this.filterForm.get('filterName')?.valueChanges.subscribe((filterName) => {
      // Limpiar espacios en blanco antes de filtrar
      const trimmedFilter = filterName.trim();

      // Si el filtro es vacío después de quitar los espacios, muestra todas las categorías
      if (trimmedFilter === '') {
        this.filteredCategories$ = this.store.pipe(
          select(selectFilteredCategories('')) // Pasa un filtro vacío
        );
      } else {
        this.filteredCategories$ = this.store.pipe(
          select(selectFilteredCategories(trimmedFilter)) // Aplica el filtro
        );
      }
    });

    // Despacha la acción para obtener las categorías al inicializar
    this.store.dispatch(CategoryActions.getCategories());
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const category = this.categoryForm.value;
      if (this.isEditing) {
        const updateCategory: UpdateCategory = {
          id: this.editingCategoryId!,
          name: category.name,
          description: category.description,
        };
        this.store.dispatch(
          CategoryActions.updateCategory({ category: updateCategory })
        );
      } else {
        this.store.dispatch(
          CategoryActions.createCategory({ category: category })
        );
      }
      this.resetForm();
    }
  }

  editCategory(category: Category) {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
    });
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.store.dispatch(CategoryActions.deleteCategory({ categoryId: id }));
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.isEditing = false;
    this.editingCategoryId = null;
    this.categoryForm.reset();
  }
}
