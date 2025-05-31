import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndustryModalComponent } from './add-industry-modal.component';

describe('AddIndustryModalComponent', () => {
  let component: AddIndustryModalComponent;
  let fixture: ComponentFixture<AddIndustryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIndustryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIndustryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
