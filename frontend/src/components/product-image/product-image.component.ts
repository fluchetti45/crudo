import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ProductImage } from '../../app/models/products/productDetail.interface';

import { AppState } from '../../app/app.state';
import {
  removeProductImage,
  updateProductCover,
  uploadProductImage,
} from '../../app/state/actions/products.actions';
import { Observable } from 'rxjs';
import { selectLoading } from '../../app/state/selectors/products.selectors';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-image.component.html',
})
export class ProductImageComponent implements OnInit {
  @Input() productId!: number;
  @Input() productImages: ProductImage[] = [];

  loading$: Observable<boolean> = new Observable();

  constructor(private _store: Store<AppState>) {
    this.loading$ = this._store.select(selectLoading);
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);
    this.uploadImages(files);
  }

  uploadImages(files: File[]): void {
    // Despachar acción para indicar que se están subiendo imágenes
    this._store.dispatch(
      uploadProductImage({ productId: this.productId, files: files })
    );
  }

  updateCover(index: number): void {
    const newCover = this.productImages[index];
    this._store.dispatch(
      updateProductCover({ productId: this.productId, coverId: newCover.id })
    );
  }

  removeImage(index: number): void {
    const imageToRemove = this.productImages[index];
    this._store.dispatch(removeProductImage({ imageId: imageToRemove.id }));
  }
}
