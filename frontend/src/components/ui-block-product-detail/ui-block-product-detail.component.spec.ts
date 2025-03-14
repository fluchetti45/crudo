import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockProductDetailComponent } from './ui-block-product-detail.component';

describe('UiBlockProductDetailComponent', () => {
  let component: UiBlockProductDetailComponent;
  let fixture: ComponentFixture<UiBlockProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockProductDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
