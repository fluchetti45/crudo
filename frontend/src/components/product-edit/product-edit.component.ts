import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ProductDetail,
  ProductImage,
} from '../../app/models/products/productDetail.interface';
import { Category } from '../../app/models/categories/category.interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { selectCategoryList } from '../../app/state/selectors/categories.selectors';
import {
  selectLoading,
  selectProductDetail,
} from '../../app/state/selectors/products.selectors';
import { ProductImageComponent } from '../product-image/product-image.component';
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from '../../app/state/actions/products.actions';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    ProductImageComponent,
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  loading$: Observable<boolean> = new Observable();
  product$: Observable<ProductDetail | null>;
  categories$: Observable<Category[]>;
  productId!: number;
  productForm!: FormGroup;
  submitted = false;
  editor: Editor;

  constructor(private store: Store<AppState>) {
    this.categories$ = this.store.select(selectCategoryList);
    this.product$ = this.store.select(selectProductDetail);
    this.loading$ = this.store.select(selectLoading);
    this.productForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
    this.editor = new Editor({
      content: '',
      history: true,
      keyboardShortcuts: true,
      inputRules: true,
      plugins: [],
    });
  }

  ngOnInit(): void {
    this.product$.subscribe((product) => {
      if (product) {
        this.updateForm(product);
        this.productId = product.id;
      }
    });
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  get f() {
    return this.productForm.controls;
  }

  updateForm(product: ProductDetail): void {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      stock: product.stock,
    });
  }

  updateProduct(): void {
    if (this.productForm.invalid) {
      return;
    }
    const formData = new FormData();
    // Agregar los campos del formulario
    for (const field in this.productForm.value) {
      formData.append(field, this.productForm.value[field]);
    }
    this.store.dispatch(
      updateProduct({ id: this.productId, product: formData })
    );
  }

  handleActivation() {
    if (
      this.productId &&
      confirm(
        '¿Estás seguro de que deseas cambiar el estado de publicacion del producto?'
      )
    ) {
      this.store.dispatch(deleteProduct({ productId: this.productId }));
    }
  }

  cancel(): void {
    this.router.navigate(['/product', this.productId]);
  }
}
