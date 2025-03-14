import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockCategoriesComponent } from './ui-block-categories.component';

describe('UiBlockCategoriesComponent', () => {
  let component: UiBlockCategoriesComponent;
  let fixture: ComponentFixture<UiBlockCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlockCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
