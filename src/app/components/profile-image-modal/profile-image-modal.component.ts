import { Component, EventEmitter, Input, Output, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckNamesService } from '../../Services/check-names.service';
import { CompanyLogoErrorResponse, CompanyLogoUpdateRequest } from '../../Models/company';

interface UploadedImage {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-profile-image-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-image-modal.component.html',
  styleUrls: ['./profile-image-modal.component.scss']
})
export class ProfileImageModalComponent implements OnInit {
  @Input() closeModal!: () => void;
  @Output() imageUploaded = new EventEmitter<string>();

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadedImages: UploadedImage[] = [];
  isDragging = false;
  gridSize = 4;
  errorMessage: string | null = null;
  isUploading = false;
  latestImages: string[] = [];
  selectedImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private checkNamesService: CheckNamesService
  ) {
    this.uploadForm = this.fb.group({});
  }

  ngOnInit() {
    this.fetchLatestImages();
  }

  fetchLatestImages() {
    const companyId = localStorage.getItem('CompanyId');
    if (!companyId) return;
    this.checkNamesService.getCompanyLogos(companyId).subscribe({
      next: (response) => {
        if (response.responseCode === 1 && response.data) {
          const active = response.data.find(img => img.isActive === 1);
          const rest = response.data
            .filter(img => img.isActive !== 1)
            .sort((a, b) => b.logoName.localeCompare(a.logoName));
          this.latestImages = [];
          if (active) {
            const activeUrl = `https://corporate.bdjobs.com/logos/${active.logoName}?v=${new Date().getTime()}`;
            this.latestImages.push(activeUrl);
          }
          for (let i = 0; i < 3 && i < rest.length; i++) {
            this.latestImages.push(`https://corporate.bdjobs.com/logos/${rest[i].logoName}?v=${new Date().getTime()}`);
          }
          if (!active) {
            const sorted = response.data.sort((a, b) => b.logoName.localeCompare(a.logoName));
            this.latestImages = sorted.slice(0, 4).map(img => `https://corporate.bdjobs.com/logos/${img.logoName}?v=${new Date().getTime()}`);
          }
          if (this.latestImages.length > 0) {
            this.selectedImageUrl = this.latestImages[0];
            this.previewUrl = this.selectedImageUrl;
          }
        }
      }
    });
  }

  private validateImageDimensions(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width === 300 && img.height === 300);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private validateFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    return allowedTypes.includes(file.type.toLowerCase());
  }

  async handleFile(file: File) {
    this.errorMessage = null;
    if (!this.validateFileType(file)) {
      this.errorMessage = 'Invalid file extension. Allowed: .jpg, .jpeg, .png, .gif, .bmp, .webp';
      return;
    }
    const isValidDimensions = await this.validateImageDimensions(file);
    if (!isValidDimensions) {
      this.errorMessage = 'Image must be exactly 300x300 pixels.';
      return;
    }
    
    this.isUploading = true;
    
    const companyId = localStorage.getItem('CompanyId');
    if (!companyId) {
      this.errorMessage = 'Company ID not found';
      this.isUploading = false;
      return;
    }
    
    this.checkNamesService.uploadCompanyLogo(companyId, file).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.fetchLatestImages();
      },
      error: (error) => {
        this.isUploading = false;
        if (error.dataContext?.length > 0) {
          this.errorMessage = error.dataContext.map((err: any) => err.message).join('\n');
        } else {
          this.errorMessage = 'Failed to upload image. Please try again.';
        }
      }
    });
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      await this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      await this.handleFile(file);
    }
  }

  onSubmit() {
    if (this.selectedImageUrl) {
      // If the selected image is from the API (not a data URL), call update API
      if (this.selectedImageUrl.startsWith('https://corporate.bdjobs.com/logos/')) {
        // Remove query parameters before extracting the logo name
        const baseUrl = this.selectedImageUrl.split('?')[0];
        const logoName = baseUrl.split('/').pop();
        const companyId = localStorage.getItem('CompanyId');
        
        if (logoName && companyId) {
          const updateRequest: CompanyLogoUpdateRequest = {
            companyId: companyId,
            logoName: logoName
          };
          
          this.isUploading = true;
          this.checkNamesService.updateCompanyLogo(updateRequest).subscribe({
            next: (response) => {
              this.isUploading = false;
              if (response.responseCode === 1) {
                this.imageUploaded.emit(this.selectedImageUrl!);
                this.closeModal();
              } else {
                this.errorMessage = 'Failed to update image';
              }
            }, 
          });
        } 
      } else {
        this.imageUploaded.emit(this.selectedImageUrl);
        this.closeModal();
      }
    }
  }

  removeImage() {
    if (this.selectedImageUrl && this.selectedImageUrl.startsWith('https://corporate.bdjobs.com/logos/')) {
      // Remove query parameters before extracting the logo name
      const baseUrl = this.selectedImageUrl.split('?')[0];
      const logoName = baseUrl.split('/').pop();
      const companyId = localStorage.getItem('CompanyId');
      
      if (logoName && companyId) {
        const deleteRequest = {
          companyId: companyId,
          logoName: logoName
        };
        
        this.checkNamesService.deleteCompanyLogo(deleteRequest).subscribe({
          next: (response) => {
            if (response.responseCode === 1) {
              this.fetchLatestImages();
            } else {
              this.errorMessage = 'Failed to delete image';
            }
          },
          error: (error) => {
            this.errorMessage = 'Failed to delete image. Please try again.';
          }
        });
      }
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
      this.errorMessage = null;
      if (this.latestImages.length > 0) {
        this.selectImageFromApi(this.latestImages[0]);
      }
    }
  }

  selectImage(uploadedImage: UploadedImage) {
    this.selectedFile = uploadedImage.file;
    this.previewUrl = uploadedImage.previewUrl;
    this.errorMessage = null;
  }

  selectImageFromApi(url: string) {
    this.selectedImageUrl = url;
    this.previewUrl = url;
  }

  triggerFileInput() {
    if (this.latestImages.length < 4) {
      const fileInput = this.document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

} 