import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockStatusDetailComponent } from './ui-block-status-detail.component';

describe('UiBlockStatusDetailComponent', () => {
  let component: UiBlockStatusDetailComponent;
  let fixture: ComponentFixture<UiBlockStatusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockStatusDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
