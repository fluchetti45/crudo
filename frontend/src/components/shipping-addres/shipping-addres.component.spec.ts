import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddresComponent } from './shipping-addres.component';

describe('ShippingAddresComponent', () => {
  let component: ShippingAddresComponent;
  let fixture: ComponentFixture<ShippingAddresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingAddresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAddresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
