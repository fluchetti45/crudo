import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockCartDetailComponent } from './ui-block-cart-detail.component';

describe('UiBlockCartDetailComponent', () => {
  let component: UiBlockCartDetailComponent;
  let fixture: ComponentFixture<UiBlockCartDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockCartDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockCartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
