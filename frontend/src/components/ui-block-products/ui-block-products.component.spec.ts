import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockProductsComponent } from './ui-block-products.component';

describe('UiBlockProductsComponent', () => {
  let component: UiBlockProductsComponent;
  let fixture: ComponentFixture<UiBlockProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
