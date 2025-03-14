import { Component, Input } from '@angular/core';
import { Category } from '../../app/models/categories/category.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-detail',
  imports: [RouterLink],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css',
})
export class CategoryDetailComponent {
  @Input() category!: Category;
}
