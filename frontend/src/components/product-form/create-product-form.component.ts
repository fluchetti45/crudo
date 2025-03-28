import { Component, Input, OnInit, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { createProduct } from '../../app/state/actions/products.actions';

import { Observable } from 'rxjs';
import {
  selectError,
  selectLoading,
  selectSuccess,
} from '../../app/state/selectors/products.selectors';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Category } from '../../app/models/categories/category.interface';
import { selectCategoryList } from '../../app/state/selectors/categories.selectors';
import { Product } from '../../app/models/products/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    AsyncPipe,
    NgFor,
    NgxEditorModule,
  ],
  templateUrl: './create-product-form.component.html',
  styleUrl: './create-product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  @Input() product?: Product; // Para recibir un producto existente

  previewMode = false;
  private _fb = inject(FormBuilder);
  loading$: Observable<boolean> = new Observable();
  success$: Observable<string | null> = new Observable();
  error$: Observable<string | null> = new Observable();
  categories$: Observable<Category[]> = new Observable();
  selectedImages: FileList | null = null; // Variable para almacenar archivos
  public productForm: FormGroup;

  constructor(private _store: Store<AppState>) {
    this.productForm = this._fb.group({
      name: ['', Validators.required],
      price: [0.0, Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
    this.categories$ = this._store.select(selectCategoryList);
    this.loading$ = this._store.select(selectLoading);
    this.success$ = this._store.select(selectSuccess);
    this.error$ = this._store.select(selectError);
  }

  ngOnInit() {
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        price: this.product.price,
        description: this.product.description,
        stock: this.product.stock,
        categoryId: this.product.categoryId,
      });
    }
  }

  // Función para manejar la selección de imágenes
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImages = input.files; // Guardar la lista de archivos
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      // Agregar los campos del formulario
      for (const field in this.productForm.value) {
        formData.append(field, this.productForm.value[field]);
      }

      // Agregar imágenes al FormData
      if (this.selectedImages) {
        for (let i = 0; i < this.selectedImages.length; i++) {
          formData.append('images', this.selectedImages[i]); // <- Mantener el mismo nombre 'images'
        }
      }
      this._store.dispatch(createProduct({ product: formData }));
    }
  }
}
