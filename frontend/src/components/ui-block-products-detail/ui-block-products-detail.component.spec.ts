import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockProductsDetailComponent } from './ui-block-products-detail.component';

describe('UiBlockProductsDetailComponent', () => {
  let component: UiBlockProductsDetailComponent;
  let fixture: ComponentFixture<UiBlockProductsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockProductsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockProductsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
