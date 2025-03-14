import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockOrdersDetailComponent } from './ui-block-orders-detail.component';

describe('UiBlockOrdersDetailComponent', () => {
  let component: UiBlockOrdersDetailComponent;
  let fixture: ComponentFixture<UiBlockOrdersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockOrdersDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockOrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
