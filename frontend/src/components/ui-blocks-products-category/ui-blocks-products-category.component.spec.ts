import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlocksProductsCategoryComponent } from './ui-blocks-products-category.component';

describe('UiBlocksProductsCategoryComponent', () => {
  let component: UiBlocksProductsCategoryComponent;
  let fixture: ComponentFixture<UiBlocksProductsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlocksProductsCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBlocksProductsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
