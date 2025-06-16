import { Component, computed, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckNamesService } from '../../Services/check-names.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { TextAreaComponent } from '../../components/text-area/text-area.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { IndustryTypeResponseDTO, IndustryType, LocationResponseDTO, RLNoRequestModel, UpdateAccountRequestModel } from '../../Models/company';
import { ContactPerson } from '../../Models/company';
import { RadioGroupComponent } from '../../components/radio-group/radio-group.component';
import { MathCaptchaComponent } from '../../components/math-captcha/math-captcha.component';
import { filePath,countrie ,disabilities} from '../../constants/file-path.constants';
import { AuthService } from '../../Services/shared/auth.service';
import { passwordMatchValidator, yearValidator, banglaTextValidator, noWhitespaceValidator, noBlacklistCharacters, companyAddressValidator } from '../../utils/validators';
import { Router } from '@angular/router';
import { ProfileImageModalComponent } from '../../components/profile-image-modal/profile-image-modal.component';
import { AddIndustryModalComponent } from '../../components/add-industry-modal/add-industry-modal.component';
import { SettingsSidebarComponent } from "../../components/settings-sidebar/settings-sidebar.component";



@Component({
  selector: 'app-edit-account-page',
  standalone: true,
  imports: [RadioGroupComponent, InputFieldComponent,
    TextAreaComponent, ReactiveFormsModule, FormsModule, CommonModule, AddIndustryModalComponent, ProfileImageModalComponent, InputFieldComponent, SettingsSidebarComponent],
  templateUrl: './edit-account-page.component.html',
  styleUrls: ['./edit-account-page.component.scss']
})
export class EditAccountPageComponent implements OnInit {
  filePath = filePath;
  countrie = countrie;
  disabilities = disabilities;
  @ViewChild(MathCaptchaComponent) captchaComponent!: MathCaptchaComponent;
  isCaptchaValid = false;
  isLoadingCompanyData: boolean = true;
  companyData: any = null;
  selectedCountry: LocationResponseDTO | null = null;
  searchTerm = new FormControl('');
  isOpenCountry: boolean = false;
  isOpenCountryBilling: boolean = false;
  isOpen: boolean = false;
  showAddIndustryButton: boolean = false; 
  fieldsOrder: string[] = [];
  newlyAddedIndustriesnew: { [key: number]: IndustryTypeResponseDTO[] } = {};

  industries: BehaviorSubject<IndustryType[]> = new BehaviorSubject<IndustryType[]>([]);
  industryTypes: IndustryTypeResponseDTO[] = [];
  allIndustryTypes: IndustryTypeResponseDTO[] = []; 
  filteredIndustryTypes: IndustryTypeResponseDTO[] = [];
  allIndustryNames: { industryId: number; industryName: string }[] = [];
  countries: LocationResponseDTO[] = [];
  districts: LocationResponseDTO[] = [];
  thanas: LocationResponseDTO[] = [];
  newlyAddedIndustries: IndustryTypeResponseDTO[] = [];
  outsideBd: boolean = false;  
  selectedIndustries: { IndustryValue: number; IndustryName: string }[] = [];
currentCountry = { name: 'Bangladesh', code: 'BD', phoneCode: '+880' }; 
currentFlagPath = this.filePath['Bangladesh'];
filteredCountriesList = this.countrie;

  employeeForm: FormGroup = new FormGroup({
    
    facilityForDisability: new FormControl(0),
    username: new FormControl('', [ noBlacklistCharacters]),  
    password: new FormControl('', noBlacklistCharacters),
    confirmPassword: new FormControl('',),
    companyName: new FormControl('', [Validators.required, noWhitespaceValidator()]),
    companyNameBangla: new FormControl('',),
    yearsOfEstablishMent: new FormControl('', [Validators.required, yearValidator()]),
    companySize: new FormControl('', [Validators.required]),
    country: new FormControl('',[Validators.required]), 
    district: new FormControl('',[Validators.required]),
    thana: new FormControl('',[Validators.required]), 
    companyAddress: new FormControl('', [Validators.required, noWhitespaceValidator(), companyAddressValidator()]),
    outSideBd: new FormControl('',[Validators.required]),
    outsideBDCompanyAddress: new FormControl('',[Validators.required]),
    industryType: new FormControl('-1'),
    industryTypeArray: new FormControl('', [Validators.required]),
    businessDesc: new FormControl(''),
    tradeNo: new FormControl(''),
    webUrl: new FormControl(''),
    contactName: new FormControl('', [Validators.required, noWhitespaceValidator()]),
    contactDesignation: new FormControl('', [Validators.required, noWhitespaceValidator()]),
    contactEmail: new FormControl('', [Validators.required, Validators.email, noWhitespaceValidator()]),
    contactMobile: new FormControl({ value: '', disabled: true }, [Validators.required]),
    inclusionPolicy: new FormControl<string>(''),
    support: new FormControl<string>(''),
    disabilityWrap: new FormControl(''),
    billingAddress: new FormControl(''),
    billingEmail: new FormControl(''),
    billingContact: new FormControl(''),
    training: new FormControl<string>(''),
    industryName: new FormControl('', [Validators.maxLength(100),]),
    hidEntrepreneur: new FormControl(''),
    rlNoStatus: new FormControl(''),
    outsideBDCompanyAddressBng: new FormControl(''),
    // captchaInput: new FormControl('', [Validators.required, Validators.maxLength(2),Validators.pattern('^[0-9]*$')]),
    companyAddressBangla: new FormControl('',[banglaTextValidator()]),
    rlNo: new FormControl({value: null, disabled: true},[Validators.pattern('^[0-9]*$')]),
    // isPolicyAcceptedControl: new FormControl('')
  },{ validators: passwordMatchValidator() }
);
  formControlSignals = computed(() => {
    const signals: { [key: string]: FormControl<any> } = {};
    Object.keys(this.employeeForm.controls).forEach(key => {
      signals[key] = this.employeeForm.get(key) as FormControl<any>;
    });
    return signals;
  });
  usernameExistsMessage: string = '';
  companyNameExistsMessage: string = '';
  isUniqueCompanyName: boolean = false;
  rlErrorMessage: string = '';
  showError: boolean = false;
  showErrorModal: boolean = false; 
  showAll: boolean = false;  
  isDropdownUpwards = false;
  showAddIndustryModal = false;
  selectedIndustryId: number = 0;
  isBangladesh: boolean = false;
  searchControl: FormControl = new FormControl(''); 
  contactPersons: ContactPerson[] = [];
  selectedContactPerson: ContactPerson | null = null;
  showProfileImageModal = false;
  profileImageUrl: string | null = null;
  private industryCounter = -1; 

  constructor(private checkNamesService: CheckNamesService , private authService: AuthService ,
  private router: Router) {}
  ngOnInit(): void {
   

    this.searchControl.valueChanges
    .pipe(debounceTime(300)) 
    .subscribe(() => {
      this.filteredCountriesList = this.filteredCountrie();
    });

    this.FetchCompanyInformation();
   
    this.isBangladesh = true;
    this.fetchIndustries();
    this.setupSearch();
    this.fetchIndustryTypes();
    this.fetchCountries();
    this.updateFlagPath();
    this.searchTerm.valueChanges.subscribe(() => this.filterCountries());
    this.employeeForm.get('companyAddress')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.employeeForm.get('companyAddress')?.updateValueAndValidity();
      });

    this.selectedCountry = {
      OptionText: 'Bangladesh',
      OptionValue: '118',
      flagPath: this.filePath['Bangladesh'],
    };
  
    this.currentCountry = { name: 'Bangladesh', code: 'BD', phoneCode: '+880' };
    this.currentFlagPath = this.filePath['Bangladesh'];
    this.employeeForm.get('industryType')?.valueChanges.subscribe(selectedIndustryId => {
      this.onIndustryTypeChange(selectedIndustryId);
      this.selectedIndustryId = selectedIndustryId;
      console.log('Parent Component - Selected Industry ID:', selectedIndustryId);

    });
    this.employeeForm.get('facilityForDisability')?.valueChanges.subscribe((value: boolean) => {
      this.employeeForm.patchValue({
        facilityForDisability: value ? 1 : 0,
      }, { emitEvent: false });
    });
    this.employeeForm.get('country')?.valueChanges.subscribe((value: string) => {
            if (value === 'Bangladesh') {
              this.outsideBd = false;  
              this.fetchDistricts();
              this.employeeForm.get('district')?.setValidators([Validators.required]);
              this.employeeForm.get('thana')?.setValidators([Validators.required]);
              this.employeeForm.get('companyAddress')?.setValidators([Validators.required, noWhitespaceValidator(),companyAddressValidator()]);
              this.employeeForm.get('outSideBd')?.clearValidators();
              this.employeeForm.get('outSideBd')?.setValue(''); 
              this.employeeForm.get('outsideBDCompanyAddress')?.clearValidators();
              this.employeeForm.get('outsideBDCompanyAddress')?.setValue('');       
            } else {
              this.outsideBd = true; 
              this.employeeForm.get('district')?.clearValidators();
              this.employeeForm.get('thana')?.clearValidators();
              this.employeeForm.get('companyAddress')?.clearValidators();
              this.employeeForm.get('district')?.setValue(''); 
              this.employeeForm.get('thana')?.setValue(''); 
              this.employeeForm.get('companyAddress')?.setValue(''); 
              this.employeeForm.get('outSideBd')?.setValidators([Validators.required]); 
              this.employeeForm.get('outsideBDCompanyAddress')?.setValidators([Validators.required,noWhitespaceValidator(),companyAddressValidator()]);   
            }
            this.employeeForm.get('district')?.updateValueAndValidity();
            this.employeeForm.get('thana')?.updateValueAndValidity();
            this.employeeForm.get('companyAddress')?.updateValueAndValidity();
            this.employeeForm.get('outSideBd')?.updateValueAndValidity();
            this.employeeForm.get('outsideBDCompanyAddress')?.updateValueAndValidity();

          });
    this.employeeForm.get('district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        this.fetchThanas(districtId);
      }
    });
    this.fetchContactPersons();
    
    this.employeeForm.get('contactName')?.valueChanges.subscribe((value: string) => {
      this.onContactPersonSelect(value);
    });
  }
  filterCountries(): LocationResponseDTO[] {
    return this.countries.filter(country => 
      country.OptionText.toLowerCase().includes(this.searchTerm.value?.toLowerCase() || '')
    );
  }

  private containsBlacklistCharacters(value: string): boolean {
    const blacklistPattern = /[!@&#${}%*\s]/; 
    return blacklistPattern.test(value);
  }

  filteredCountrie() {
    const query = this.searchControl.value?.toLowerCase() || '';
    return this.countrie.filter(country =>
      country.name.toLowerCase().includes(query)
    );
  }

  // Fetch all industries
  fetchIndustries(): void {
    this.checkNamesService.getAllIndustryIds().pipe(
      map((response: any) => {
        if (response.responseCode === 1 && Array.isArray(response.data)) {
          const industries = response.data.map((industry: any) => ({
            IndustryId: industry.industryId,
            IndustryName: industry.industryName,
            OrganizationName: '',
          }));
  
          industries.push({ IndustryId: -10, IndustryName: 'Others' }); 
          return industries;
        } else {
          throw new Error('Failed to fetch industries due to an unexpected response');
        }
      })
    ).subscribe({
      next: (industries: { IndustryId: number; IndustryName: string; OrganizationName: string }[]) => {
        this.industries.next(industries); 
      },
      error: (err: any) => {
        console.error('Error fetching industry data:', err);
      },
    });
  }
 
  private fetchIndustryTypes(industryId: number = -1): Promise<void> {
    return new Promise((resolve, reject) => {
      this.showAddIndustryButton = industryId !== -1;
    
      this.checkNamesService.fetchIndustryTypes(industryId).subscribe({
        next: (response: any) => {
          if (response.responseCode === 1 && Array.isArray(response.data)) {
            const industryData = response.data.map((item: any) => ({
              IndustryValue: item.industryValue,
              IndustryName: item.industryName,
            }));
    
            this.industryTypes = [...industryData];
    
            if (industryId !== -1 && this.newlyAddedIndustriesnew[industryId]) {
              this.industryTypes.push(...this.newlyAddedIndustriesnew[industryId]);
            }
            else if (industryId === -1) {
              this.allIndustryTypes = industryData;
            }
    
            this.filteredIndustryTypes = [...this.industryTypes];
            resolve();
          } else {
            console.warn(
              `Unexpected response or no industry types found for IndustryId: ${industryId}.`
            );
            this.clearIndustryLists();
            reject(new Error('Invalid response format'));
          }
        },
        error: (error: any) => {
          console.error('Error fetching industry types:', error);
          this.clearIndustryLists();
          reject(error);
        },
      });
    });
  }
  
  private clearIndustryLists(): void {
    this.industryTypes = [];
    this.filteredIndustryTypes = [];
    if (this.allIndustryTypes.length === 0) {
      this.allIndustryTypes = [];
    }
  }
  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = parseInt(checkbox.value, 10);
    const currentValues = this.formControlSignals()['disabilityWrap'].value
      ? this.formControlSignals()['disabilityWrap'].value.split(',').map(Number) 
      : [];
    if (checkbox.checked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value);
      }
    } else {
      const index = currentValues.indexOf(value);
      if (index !== -1) {
        currentValues.splice(index, 1);
      }
    }
    this.formControlSignals()['disabilityWrap'].setValue(currentValues.join(','));
  }
  private toggleBodyScroll(disable: boolean) {
    const body = document.body;
    if (disable) {
      const scrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      const scrollY = parseInt(body.getAttribute('data-scroll-y') || '0');
      body.style.removeProperty('position');
      body.style.removeProperty('top');
      body.style.removeProperty('width');
      body.style.removeProperty('overflow');
      window.scrollTo(0, scrollY);
      body.removeAttribute('data-scroll-y');
    }
  }

  addNewIndustry(): void {
    this.showAddIndustryModal = true;
    this.toggleBodyScroll(true);
  }

  closeAddIndustryModal(): void {
    this.showAddIndustryModal = false;
    this.toggleBodyScroll(false);
  }

  private formatIndustryName(industryName: string, industryTypeId: number): string {
    return `${this.industryCounter--}_${industryName}_${industryTypeId}`;
  }

  onNewIndustryAdded(event: { IndustryName: string }): void {
    const industryName = event.IndustryName.trim(); 
    const currentIndustryId = this.selectedIndustryId;
    
    this.checkNamesService.organizationCheck(industryName).subscribe({
      next: (response: any) => {
        if (response.responseCode === 200) {
          if (response.data && response.data.success && response.data.data === true) {
            const { orgTypeName, orgTypeId, industryId } = response.data;
    
            const isAlreadyChecked = this.selectedIndustries.some(
              (industry) => industry.IndustryName.toLowerCase() === orgTypeName.toLowerCase()
            );
    
            if (isAlreadyChecked) {
              alert('You have already added this industry.');
              return;
            }

            const formattedIndustryName = this.formatIndustryName(orgTypeName, industryId);
            const currentIndustryNames = this.employeeForm.controls['industryName'].value;
            const updatedIndustryNames = currentIndustryNames
              ? `${currentIndustryNames}*#*${formattedIndustryName}`
              : formattedIndustryName;
            this.employeeForm.controls['industryName'].setValue(updatedIndustryNames);
    
            const backendIndustry: IndustryTypeResponseDTO = {
              IndustryValue: orgTypeId,
              IndustryName: orgTypeName,
            };
    
            if (!this.industryTypes.find((industry) => industry.IndustryName.toLowerCase() === orgTypeName.toLowerCase())) {
              this.industryTypes.push(backendIndustry);
              if (!this.allIndustryNames.find(industry => industry.industryId === orgTypeId)) {
                this.allIndustryNames.push({
                  industryId: orgTypeId,
                  industryName: orgTypeName
                });
              }
            }
            this.selectedIndustries.push(backendIndustry);
          }
          else if (response.dataContext === 'Organization not found') {
            const formattedIndustryName = this.formatIndustryName(industryName, currentIndustryId);
            const currentIndustryNames = this.employeeForm.controls['industryName'].value;
            const updatedIndustryNames = currentIndustryNames
              ? `${currentIndustryNames}*#*${formattedIndustryName}`
              : formattedIndustryName;
            this.employeeForm.controls['industryName'].setValue(updatedIndustryNames);

            const newIndustry: IndustryTypeResponseDTO = {
              IndustryValue: Date.now() % 2147483647, 
              IndustryName: industryName,
            };
            if (!this.newlyAddedIndustriesnew[currentIndustryId]) {
              this.newlyAddedIndustriesnew[currentIndustryId] = [];
            }
            this.newlyAddedIndustriesnew[currentIndustryId].push(newIndustry);
            if (this.selectedIndustryId === currentIndustryId) {
              this.industryTypes.push(newIndustry);
              this.filteredIndustryTypes = [...this.industryTypes];
              this.allIndustryNames.push({
                industryId: newIndustry.IndustryValue,
                industryName: newIndustry.IndustryName
              });
            }
            this.selectedIndustries.push(newIndustry);
            const selectedValues = this.selectedIndustries
              .map((industry: { IndustryValue: number; IndustryName: string }) => industry.IndustryValue)
              .join(',');
            this.employeeForm.controls['industryTypeArray'].setValue(selectedValues);
          }
        }
      },
      error: (error: any) => {
        console.error('Error validating industry name:', error);
      },
    });
  }

  onNewIndustryTypeChange(newIndustryId: number): void {
    this.employeeForm.get('industryType')?.setValue(newIndustryId); 
  }
  onIndustryTypeChange(selectedIndustryId: string | number): void {
    const parsedIndustryId = parseInt(selectedIndustryId as string, 10); 
    if (!isNaN(parsedIndustryId)) {
      this.fetchIndustryTypes(parsedIndustryId).then(() => {
        if (parsedIndustryId === -1) {
          this.allIndustryNames = this.allIndustryTypes.map(type => ({
            industryId: type.IndustryValue,
            industryName: type.IndustryName
          }));
        } else {
          this.allIndustryNames = this.industryTypes.map(type => ({
            industryId: type.IndustryValue,
            industryName: type.IndustryName
          }));
        }
      });
    } else {
      this.filteredIndustryTypes = [...this.industryTypes];
    }
  }
 
 
  onIndustryCheckboxChange(event: Event, industry: { industryId: number; industryName: string }): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const industryDTO: IndustryTypeResponseDTO = {
      IndustryValue: industry.industryId,
      IndustryName: industry.industryName
    };
  
    if (isChecked) {
      if (this.selectedIndustries.length >= 10) {
        alert('You cannot select more than 10 Industries.');
        (event.target as HTMLInputElement).checked = false;
        return;
      }
      this.selectedIndustries.push(industryDTO);
    } else {
      this.selectedIndustries = this.selectedIndustries.filter(
        selected => selected.IndustryValue !== industry.industryId
      );
      const currentIndustryId = this.selectedIndustryId;
      const newlyAddedIndustriesForId = this.newlyAddedIndustriesnew[currentIndustryId];
      if (newlyAddedIndustriesForId) {
        const index = newlyAddedIndustriesForId.findIndex(
          (newIndustry) => newIndustry.IndustryValue === industry.industryId
        );
  
        if (index !== -1) {
          newlyAddedIndustriesForId.splice(index, 1);
          this.allIndustryNames = this.allIndustryNames.filter(
            item => item.industryId !== industry.industryId
          );
          this.industryTypes = this.industryTypes.filter(
            (type) => type.IndustryValue !== industry.industryId
          );
          this.filteredIndustryTypes = [...this.industryTypes];
        }
      }
    }

    const selectedValues = this.selectedIndustries
      .map((industry: { IndustryValue: number; IndustryName: string }) => industry.IndustryValue)
      .join(',');
    this.employeeForm.controls['industryTypeArray'].setValue(selectedValues);
    this.employeeForm.controls['industryTypeArray'].markAsTouched();
  }
   
  isIndustryChecked(industryValue: number): boolean {
    return this.selectedIndustries.some(
      (industry) => industry.IndustryValue === industryValue
    );
  }
  removeIndustry(industry: IndustryTypeResponseDTO): void {
    const checkbox = document.getElementById(
      `industry_type_${industry.IndustryValue}`
    ) as HTMLInputElement | null;

    this.selectedIndustries = this.selectedIndustries.filter(
      selected => selected.IndustryValue !== industry.IndustryValue
    );

    const currentIndustryId = this.selectedIndustryId;
    const newlyAddedIndustriesForId = this.newlyAddedIndustriesnew[currentIndustryId];
    if (newlyAddedIndustriesForId) {
      const index = newlyAddedIndustriesForId.findIndex(
        (newIndustry) => newIndustry.IndustryValue === industry.IndustryValue
      );

      if (index !== -1) {
        newlyAddedIndustriesForId.splice(index, 1);
        this.allIndustryNames = this.allIndustryNames.filter(
          item => item.industryId !== industry.IndustryValue
        );
        this.industryTypes = this.industryTypes.filter(
          (type) => type.IndustryValue !== industry.IndustryValue
        );
        this.filteredIndustryTypes = [...this.industryTypes];
      }
    }

    const selectedValues = this.selectedIndustries
      .map((industry: { IndustryValue: number; IndustryName: string }) => industry.IndustryValue)
      .join(',');
    this.employeeForm.controls['industryTypeArray'].setValue(selectedValues);

    if (checkbox) {
      checkbox.checked = false;
    }
  }
  
  
  // Fetch countries (Outside Bangladesh included)
  private fetchCountries(): Promise<void> {
    return new Promise((resolve, reject) => {
      const requestPayload = { OutsideBd: '1', DistrictId: '', CountryId: '' };
      this.checkNamesService.getLocations(requestPayload).subscribe({
        next: (response: any) => {
  
          if (response.responseCode === 1 && Array.isArray(response.data)) {
            const countryData = response.data;
            if (countryData.length > 0) {
              this.countries = countryData.map((item: any) => ({
                OptionValue: item.optionValue,
                OptionText: item.optionText,
                flagPath: this.filePath[item.optionText] || '',
              }));
              resolve();
            } else {
              this.countries = [];
            }
          } else {
            this.countries = [];
          }
        },
        
      });
    });
  }
// Fetch districts within Bangladesh
private fetchDistricts(): Promise<void> {
  return new Promise((resolve, reject) => {
    const requestPayload = { OutsideBd: '0', DistrictId: '' };
    this.checkNamesService.getLocations(requestPayload).subscribe({
      next: (response: any) => {
        if (response.responseCode === 1 && Array.isArray(response.data)) {
          const districtData = response.data;
          this.districts = districtData.map((item: any) => ({
            OptionValue: `${item.optionValue}##${item.optionText}`,
            OptionText: item.optionText,
          }));
          this.thanas = [];
          resolve();
        } else {
          this.districts = [];
          reject(new Error('Invalid response format'));
        }
      },
      error: (error: any) => {
        this.districts = [];
        reject(error);
      }
    });
  });
}
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.checkDropdownPosition();
    }
  }
  toggleDropdownCountry() {
    this.isOpenCountry = !this.isOpenCountry;
  }
  toggleDropdownCountryBilling() {
    this.isOpenCountryBilling = !this.isOpenCountryBilling;
  }
  checkDropdownPosition() {
    const dropdownButton = document.querySelector('.dropdown-container button') as HTMLElement;
    const viewportHeight = window.innerHeight;

    if (dropdownButton) {
      const buttonRect = dropdownButton.getBoundingClientRect();
      this.isDropdownUpwards = buttonRect.bottom + 200 > viewportHeight; 
    }
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const targetElement = event.target as HTMLElement;

    const isInsideDropdown = targetElement.closest('.dropdown-container');
    if (!isInsideDropdown) {
      this.isOpen = false;
      this.isOpenCountry = false;
      this.isOpenCountryBilling = false;
    }
  }

  selectCountry(country: LocationResponseDTO) {
    this.selectedCountry = country;
    this.isOpen = false;
    this.searchTerm.setValue('');
    this.employeeForm.get('country')?.setValue(country.OptionText); 
  }

  get filteredCountries() {
    return this.filterCountries();
  }

 public getFlagSvg(country: LocationResponseDTO): string {
    const filePath = country.flagPath;
      `<img src="${filePath}" alt="flag" width="24" height="24" />`
    return filePath;
  
  }
// Fetch thanas for the selected district
private fetchThanas(districtFormattedValue: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const districtId = districtFormattedValue.split('##')[0];
    const requestPayload = { OutsideBd: '0', DistrictId: districtId };
    this.checkNamesService.getLocations(requestPayload).subscribe({
      next: (response: any) => {
        if (response.responseCode === 1 && Array.isArray(response.data)) {
          const thanaData = response.data;
          this.thanas = thanaData.map((item: any) => ({
            OptionValue: `${item.optionValue}##${item.optionText}`,
            OptionText: item.optionText,
          }));
          resolve();
        } else {
          this.thanas = [];
          reject(new Error('Invalid response format'));
        }
      },
      error: (error: any) => {
        this.thanas = [];
        reject(error);
      }
    });
  });
}
setupSearch(): void {
  this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((query: string) => {
      this.filterIndustryTypes(query);
    });
}
 
  getTypes(): IndustryTypeResponseDTO[] {
    return this.filteredIndustryTypes;
  }

  filterIndustryTypes(query: string): void {
    if (!query) {
      this.filteredIndustryTypes = [...this.allIndustryTypes]; 
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredIndustryTypes = this.allIndustryTypes.filter(type =>
        type.IndustryName.toLowerCase().includes(lowerQuery)
      );
    }
  }
  onCategoryChange(event: Event): void {
    const selectedIndustryId = parseInt((event.target as HTMLSelectElement).value);
    this.fetchIndustryTypes(selectedIndustryId);
    this.onIndustryTypeChange(selectedIndustryId);
    this.showAddIndustryButton = false;
  }
  chooseCountry(country: any) {
    this.currentCountry = country;
    this.isBangladesh = country.name === 'Bangladesh';
    this.currentFlagPath = this.filePath[country.name];
    this.isOpenCountry = false;
    this.isOpenCountryBilling = false;
  }
  private updateFlagPath() {
   const countryCode = this.employeeForm.controls['contactMobile'].value;
    const country = this.countrie.find(c => c.code === countryCode);
    this.currentFlagPath = country ? this.filePath[country.name] : '';
  }

formValue : any
currentValidationFieldIndex: number = 0;
firstInvalidField: string | null = null;
isContinueClicked: boolean = false;
rlNoHasValue: boolean = false;
isLoading: boolean = false;
errorMessage: string = '';
showValidationError: boolean = false;

onInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.rlNoHasValue = input.value.trim().length > 0;

}
toggleShowAll() {
  this.showAll = !this.showAll;
}

onContinue() {
  this.isContinueClicked = true;
  this.isLoading = true;
  this.errorMessage = '';
  this.showValidationError = false;

  Object.keys(this.employeeForm.controls).forEach(key => {
    const control = this.employeeForm.get(key);
    control?.markAsTouched();
  });

  if (this.employeeForm.valid) {
    const formValues = this.employeeForm.getRawValue();
    
    // request data
    const requestData: UpdateAccountRequestModel = {
      industryType: formValues.industryType || '',
      preIndustryTypes: this.selectedIndustries.map(i => i.IndustryValue).join(','),
      companyId: localStorage.getItem('CompanyId') || '',
      industryName: formValues.industryName || '',
      country: this.selectedCountry?.OptionValue || '',
      companyName: formValues.companyName || '',
      companyNameBangla: formValues.companyNameBangla || '',
      district: formValues.district || '',
      thana: formValues.thana || '',
      outSideBdCompanyAddress: formValues.outsideBDCompanyAddress || '',
      companyAddress: formValues.companyAddress || '',
      outSideBdCompanyAddressBng: formValues.outsideBDCompanyAddressBng || '',
      companyAddressBng: formValues.companyAddressBangla || '',
      outSideCity: formValues.outSideBd || '',
      rlNo: formValues.rlNo || '',
      billingAddress: formValues.billingAddress || '',
      billingContact: formValues.billingContact || '',
      billingEmail: formValues.billingEmail || '',
      contactId: parseInt(formValues.contactName) || 0,
      facilityForDisability: formValues.facilityForDisability === 1 ? 1 : 0,
      yearsOfEstablishMent: parseInt(formValues.yearsOfEstablishMent) || 0,
      companySize: formValues.companySize || '',
      userId: localStorage.getItem('UserId') || '',
      tradeNo: formValues.tradeNo || '',
      webUrl: formValues.webUrl || '',
      businessDesc: formValues.businessDesc || '',
      inclusionPolicy: parseInt(formValues.inclusionPolicy) || 0,
      support: parseInt(formValues.support) || 0,
      training: parseInt(formValues.training) || 0,
      disabilityWrap: this.getSelectedDisabilityValues()
    };

    this.checkNamesService.updateAccount(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.responseType === 'Success' && response.responseCode === 1 && response.data === 'Update Successfully') {
          this.router.navigate(['/account-created-successfully']);
        } else {
          alert('Error updating account. Please try again.');
        }
      },
      error: (error) => {
        this.isLoading = false;

        if (error.error?.responseType === 'Error' && error.error?.dataContext) {
          const validationErrors = error.error.dataContext;
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach(err => {
              console.error(`Validation Error - Field: ${err.invalidValue}, Message: ${err.message}`);
              alert(`Error: ${err.message}`);
              if (err.invalidValue === 'IndustryType') {
                this.employeeForm.get('industryType')?.setErrors({ 'apiError': true });
              }
            });
          }
        } else {
          alert('Error updating account. Please try again.');
        }
      }
    });
  } else {
    this.isLoading = false;
    const firstInvalidField = Object.keys(this.employeeForm.controls).find(
      key => {
        const control = this.employeeForm.get(key);
        return control?.invalid && !control?.disabled;
      }
    );
    if (firstInvalidField) {
      this.firstInvalidField = firstInvalidField;
      const element = document.getElementById(firstInvalidField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}

private getSelectedDisabilityValues(): number[] {
  const selectedValues: number[] = [];
  const disabilityCheckboxes = document.querySelectorAll('input[name="disability_type"]:checked');
  disabilityCheckboxes.forEach((checkbox: Element) => {
    const value = parseInt((checkbox as HTMLInputElement).value);
    if (!isNaN(value)) {
      selectedValues.push(value);
    }
  });
  return selectedValues;
}

//edit account
private FetchCompanyInformation(): void {
    this.isLoadingCompanyData = true;
    this.checkNamesService.getCompanyInformation().subscribe({
      next: (response) => {
        if (response && response.data && response.data.companyInformation && response.data.companyInformation.length > 0) {
          this.companyData = response.data.companyInformation[0]; 
          console.log('Company Data from API:', this.companyData);

          // Handle industry data
          if (response.data.allIndustryNames) {
            this.allIndustryNames = response.data.allIndustryNames;
          }
          
          // Handle selected industries
          if (response.data.industryName) {
            const selectedIndustries = response.data.industryName.map((industry: any) => ({
              IndustryValue: industry.industryId,
              IndustryName: industry.industryName
            }));
            this.selectedIndustries = selectedIndustries;
            
            // Update form control with selected industry values
            const selectedValues = selectedIndustries
              .map((industry: { IndustryValue: number; IndustryName: string }) => industry.IndustryValue)
              .join(',');
            this.employeeForm.controls['industryTypeArray'].setValue(selectedValues);
          }

          if (this.companyData.companyFacilities) {
            const facilities = this.companyData.companyFacilities;
            
            if (facilities.inclusionPolicy !== undefined) {
              const inclusionPolicyValue = facilities.inclusionPolicy.toString();
              this.employeeForm.patchValue({
                inclusionPolicy: inclusionPolicyValue
              });
            }

            if (facilities.support !== undefined) {
              const supportValue = facilities.support.toString();
              this.employeeForm.patchValue({
                support: supportValue
              });
            }

            if (facilities.training !== undefined) {
              const trainingValue = facilities.training.toString();
              this.employeeForm.patchValue({
                training: trainingValue
              });
            }
          }

          const facilityForDisabilityControl = this.employeeForm.get('facilityForDisability');
          if (facilityForDisabilityControl) {
            facilityForDisabilityControl.setValue(this.companyData.facilityPWD ? 1 : 0);
          }

          const companySizeControl = this.employeeForm.get('companySize');
          if (companySizeControl && this.companyData.minimumEmployee !== undefined && this.companyData.maximumEmployee !== undefined) {
            let companySizeValue = '';
            const maxEmp = this.companyData.maximumEmployee;
            
            if (maxEmp <= 25) {
              companySizeValue = '1-25';
            } else if (maxEmp <= 50) {
              companySizeValue = '26-50';
            } else if (maxEmp <= 100) {
              companySizeValue = '51-100';
            } else if (maxEmp <= 500) {
              companySizeValue = '101-500';
            } else if (maxEmp <= 1000) {
              companySizeValue = '501-1000';
            } else {
              companySizeValue = '1000+';
            }
            companySizeControl.setValue(companySizeValue);
          }
     
          if (response.data.recordContactPerson && response.data.recordContactPerson.length > 0) {
            this.contactPersons = response.data.recordContactPerson;
            
            const companyContactId = this.companyData.contactId; 
            const contactPerson = this.contactPersons.find(person => person.contactId === companyContactId);
            
            if (contactPerson) {
              const contactNameControl = this.employeeForm.get('contactName');
              if (contactNameControl) {
                contactNameControl.setValue(contactPerson.contactId.toString());
                
                this.employeeForm.patchValue({
                  contactDesignation: contactPerson.designation,
                  contactEmail: contactPerson.email,
                  contactMobile: this.isBangladesh && contactPerson.mobile.startsWith('0') 
                    ? contactPerson.mobile.substring(1) 
                    : contactPerson.mobile
                });
              }
            }
          }

          const companyNameControl = this.employeeForm.get('companyName');
          const companyNameBanglaControl = this.employeeForm.get('companyNameBangla');
          const countryControl = this.employeeForm.get('country');
          const districtControl = this.employeeForm.get('district');
          const thanaControl = this.employeeForm.get('thana');
          const companyAddressControl = this.employeeForm.get('companyAddress');
          const companyAddressBanglaControl = this.employeeForm.get('companyAddressBangla');
          const outsideBDCompanyAddressBngControl = this.employeeForm.get('outsideBDCompanyAddressBng');
          const yearsOfEstablishMentControl = this.employeeForm.get('yearsOfEstablishMent');
          const businessDescControl = this.employeeForm.get('businessDesc');
          const billingAddressControl = this.employeeForm.get('billingAddress');
          const tradeNoControl = this.employeeForm.get('tradeNo');
          const rlNoControl = this.employeeForm.get('rlNo');
          const contactEmailBillingControl = this.employeeForm.get('billingEmail');
          const billingContactControl = this.employeeForm.get('billingContact');
          const webUrlControl = this.employeeForm.get('webUrl');
          
          if (companyNameControl && companyNameBanglaControl && yearsOfEstablishMentControl) {
            // Set company basic information
            companyNameControl.setValue(this.companyData.companyName);
            companyNameBanglaControl.setValue(this.companyData.companyNameBng);
            yearsOfEstablishMentControl.setValue(this.companyData.companyEstablishment || '');

            // Set company address in Bangla based on country
            if (this.companyData.country === 'Bangladesh') {
              companyAddressBanglaControl?.setValue(this.companyData.companyAddressBng || '');
            } else {
              outsideBDCompanyAddressBngControl?.setValue(this.companyData.companyAddressBng || '');
            }

            // Set business description
            if (businessDescControl) {
              businessDescControl.setValue(this.companyData.businessDescription || '');
            }
            // Set billing address
            if (billingAddressControl) {
              billingAddressControl.setValue(this.companyData.billingAddress || '');
            }

            // Set license number
            if (tradeNoControl) {
              tradeNoControl.setValue(this.companyData.licenseNo || '');
            }
            // Set contact email for billing
            if (contactEmailBillingControl) {
              contactEmailBillingControl.setValue(this.companyData.billingEmail || '');
            }
            // Set billing contact number
            if (billingContactControl) {
              let billingNumber = this.companyData.billingContact || '';
              if (this.isBangladesh && billingNumber.startsWith('0')) {
                billingNumber = billingNumber.substring(1);
              }
              billingContactControl.setValue(billingNumber);
            }

            // Set RL number
            if (rlNoControl) {
              rlNoControl.setValue(this.companyData.rL_No || '');
              this.rlNoHasValue = !!this.companyData.rL_No;
            }

            // Set website URL
            if (webUrlControl) {
              webUrlControl.setValue(this.companyData.url || '');
            }

            // Handle location data
            const countryName = this.companyData.country || '';
            this.fetchCountries().then(() => {
              const matchedCountry = this.countries.find(c => 
                c.OptionText.toLowerCase() === countryName.toLowerCase()
              );

              if (matchedCountry) {
                this.selectedCountry = matchedCountry;
                countryControl?.setValue(matchedCountry.OptionText);

                if (matchedCountry.OptionText === 'Bangladesh') {
                  this.fetchDistricts().then(() => {
                    const districtName = this.companyData.city || '';
                    
                    const matchedDistrict = this.districts.find(d => 
                      d.OptionText.toLowerCase() === districtName.toLowerCase()
                    );

                    if (matchedDistrict) {
                      districtControl?.setValue(matchedDistrict.OptionValue);
                      this.fetchThanas(matchedDistrict.OptionValue).then(() => {
                        const thanaName = this.companyData.area || '';                        
                        const matchedThana = this.thanas.find(t => 
                          t.OptionText.toLowerCase() === thanaName.toLowerCase()
                        );

                        if (matchedThana) {
                          thanaControl?.setValue(matchedThana.OptionValue);
                        } 
                      });
                    } 
                  });
                } else {
                  this.outsideBd = true;
                  const outSideBdControl = this.employeeForm.get('outSideBd');
                  const outsideBDCompanyAddressControl = this.employeeForm.get('outsideBDCompanyAddress'); 
                  outSideBdControl?.setValue(this.companyData.city || '');
                  outsideBDCompanyAddressControl?.setValue(this.companyData.companyAddress || '');
                }
              } 
            });

            companyAddressControl?.setValue(this.companyData.companyAddress || '');
       
            this.employeeForm.updateValueAndValidity({ emitEvent: true });
          } 
        }
      },
   
    });
  }

  fetchContactPersons(): void {
    this.checkNamesService.getCompanyInformation().subscribe({
      next: (response: any) => {
        if (response?.data?.recordContactPerson) {
          this.contactPersons = response.data.recordContactPerson;
        } 
      },
      error: (error) => {
        console.error('Error fetching contact persons:', error);
      }
    });
  }

  onContactPersonSelect(eventOrValue: Event | string): void {
    let contactId: string;
    
    if (eventOrValue instanceof Event) {
      const select = eventOrValue.target as HTMLSelectElement;
      contactId = select.value;
    } else {
      contactId = eventOrValue;
    }
    
    if (!contactId) {
      this.employeeForm.patchValue({
        contactName: '', 
        contactDesignation: '',
        contactEmail: '',
        contactMobile: ''
      });
      return;
    }

    const selectedPerson = this.contactPersons.find(person => person.contactId.toString() === contactId);
    
    if (selectedPerson) {
      this.employeeForm.patchValue({
        contactDesignation: selectedPerson.designation,
        contactEmail: selectedPerson.email,
        contactMobile: this.isBangladesh && selectedPerson.mobile.startsWith('0') 
          ? selectedPerson.mobile.substring(1) 
          : selectedPerson.mobile
      });
    }
  }

  openProfileImageModal() {
    this.showProfileImageModal = true;
  }

  closeProfileImageModal() {
    this.showProfileImageModal = false;
  }

  onProfileImageUploaded(file: File) {

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImageUrl = reader.result as string;
      const profileIcon = document.querySelector('.icon-commercial') as HTMLElement;
      if (profileIcon) {
        profileIcon.style.backgroundImage = `url(${this.profileImageUrl})`;
        profileIcon.style.backgroundSize = 'cover';
        profileIcon.style.backgroundPosition = 'center';
      }
    };
    reader.readAsDataURL(file);
  }

  isValueInDiList(value: string): boolean {
    return this.companyData?.companyFacilities?.diList?.some((v: string | number) => String(v) === value) ?? false;
  }
 
}