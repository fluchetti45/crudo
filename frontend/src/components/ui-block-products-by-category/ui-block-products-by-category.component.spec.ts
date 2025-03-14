import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockProductsByCategoryComponent } from './ui-block-products-by-category.component';

describe('UiBlockProductsByCategoryComponent', () => {
  let component: UiBlockProductsByCategoryComponent;
  let fixture: ComponentFixture<UiBlockProductsByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockProductsByCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockProductsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
