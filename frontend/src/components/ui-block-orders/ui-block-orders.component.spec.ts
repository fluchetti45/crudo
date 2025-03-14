import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockOrdersComponent } from './ui-block-orders.component';

describe('UiBlockOrdersComponent', () => {
  let component: UiBlockOrdersComponent;
  let fixture: ComponentFixture<UiBlockOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
