import { Component, inject, Input, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RelatedProductComponent } from '../related-product/related-product.component';
import { Product } from '../../app/models/products/product.interface';
import { ProductService } from '../../services/products.service';
import { ProductDetail } from '../../app/models/products/productDetail.interface';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SlickCarouselModule,
    RelatedProductComponent,
  ],
  templateUrl: './ui-block-related-products.component.html',
  styleUrl: './ui-block-related-products.component.css',
})
export class UiBlockRelatedProductsComponent implements OnInit {
  @Input() product!: ProductDetail;
  products: Product[] = [];

  private _productService = inject(ProductService);

  ngOnInit(): void {
    this._productService
      .getRelatedProducts(this.product.id)
      .subscribe((products) => {
        this.products = products;
      });
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
