import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockRelatedProductsComponent } from './ui-block-related-products.component';

describe('UiBlockRelatedProductsComponent', () => {
  let component: UiBlockRelatedProductsComponent;
  let fixture: ComponentFixture<UiBlockRelatedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockRelatedProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockRelatedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
