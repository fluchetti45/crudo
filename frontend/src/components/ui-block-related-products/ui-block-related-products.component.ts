import { Component, inject, Input, type OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RelatedProductComponent } from '../related-product/related-product.component';
import { Category } from '../../app/models/categories/category.interface';
import { Product } from '../../app/models/products/product.interface';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/products.service';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SlickCarouselModule,
    RelatedProductComponent,
    AsyncPipe,
  ],
  templateUrl: './ui-block-related-products.component.html',
  styleUrl: './ui-block-related-products.component.css',
})
export class UiBlockRelatedProductsComponent implements OnInit {
  @Input() category!: Category;
  @Input() productId!: number;
  private _productService = inject(ProductService);
  relatedProducts$: Observable<Product[]> = new Observable();
  ngOnInit(): void {
    this.relatedProducts$ = this._productService.getRelatedProducts(
      this.productId,
      this.category.id
    );
  }

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
}
