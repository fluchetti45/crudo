import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockCategoriesDetailComponent } from './ui-block-categories-detail.component';

describe('UiBlockCategoriesDetailComponent', () => {
  let component: UiBlockCategoriesDetailComponent;
  let fixture: ComponentFixture<UiBlockCategoriesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockCategoriesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockCategoriesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
