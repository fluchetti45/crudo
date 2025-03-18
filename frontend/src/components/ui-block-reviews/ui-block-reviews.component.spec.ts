import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockReviewsComponent } from './ui-block-reviews.component';

describe('UiBlockReviewsComponent', () => {
  let component: UiBlockReviewsComponent;
  let fixture: ComponentFixture<UiBlockReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
