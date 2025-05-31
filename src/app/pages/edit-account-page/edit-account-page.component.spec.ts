import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountPageComponent } from './edit-account-page.component';

describe('CreateAccountPageComponent', () => {
  let component: EditAccountPageComponent;
  let fixture: ComponentFixture<EditAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccountPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
