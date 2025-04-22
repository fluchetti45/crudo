import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReviewFormComponentComponent } from './edit-review-form-component.component';

describe('EditReviewFormComponentComponent', () => {
  let component: EditReviewFormComponentComponent;
  let fixture: ComponentFixture<EditReviewFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReviewFormComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReviewFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
