import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingDataFormComponent } from './shipping-data-form.component';

describe('ShippingDataFormComponent', () => {
  let component: ShippingDataFormComponent;
  let fixture: ComponentFixture<ShippingDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingDataFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
