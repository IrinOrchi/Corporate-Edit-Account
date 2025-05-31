import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { IndustryType } from '../../Models/company';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { noBlacklistCharacters } from '../../utils/validators';

@Component({
  selector: 'app-add-industry-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-industry-modal.component.html',
  styleUrls: ['./add-industry-modal.component.scss'],
  encapsulation: ViewEncapsulation.None 

})
export class AddIndustryModalComponent implements OnChanges {
  @Input() closeModal!: () => void;
  @Input() industries: BehaviorSubject<IndustryType[]> = new BehaviorSubject<IndustryType[]>([]);
  @Input() selectedIndustryId: number = 0;
  @Output() newIndustry = new EventEmitter<{ IndustryName: string }>();
  @Input() employeeForm: FormGroup;
  @Output() industryTypeChanged = new EventEmitter<number>(); 





  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.employeeForm = this.fb.group({
      industryType: ['',],
      industryName: ['',  this.invalidCharacterValidator()],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndustryId']) {
      const selectedId = changes['selectedIndustryId'].currentValue;
      if (this.employeeForm.get('industryType')) {
        this.employeeForm.get('industryType')?.setValue(selectedId, { emitEvent: false });
        this.cdr.detectChanges();
      }
    }
  }
 
  ngOnInit(): void {
    document.body.classList.add('no-scroll');
  }
  ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
  }
  onNewIndustryTypeChange(event: any): void {
    const selectedValue = parseInt(event.target.value, 10);
    this.industryTypeChanged.emit(selectedValue); 
  }

  invalidCharacterValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const invalidCharacters = /[!@&#${},%*\d]/;
      if (control.value && invalidCharacters.test(control.value)) {
        return { invalidCharacters: true };
      }
      return null;
    };
  }
addIndustry(): void {
  const formValue = this.employeeForm.value; 
  const industryName = formValue.industryName?.trim();
  const invalidCharacters = /[!@&#${},%*\d]/;
  if (!industryName) {
    window.alert('Your Industry Name cannot be blank.');
    this.employeeForm.controls['industryName'].setValue('');
    this.cdr.detectChanges();
    return;
  }
  if (invalidCharacters.test(industryName)) {
    window.alert('Use (A-Z), (a-z) and following characters (, ), - and / only.');
    this.cdr.detectChanges();
    return;
  }
  this.newIndustry.emit({ IndustryName: industryName });
 
  this.closeModal();

}
}