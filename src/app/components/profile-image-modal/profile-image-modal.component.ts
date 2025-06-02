import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
export class ProfileImageModalComponent {
  @Input() closeModal!: () => void;
  @Output() imageUploaded = new EventEmitter<File>();

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadedImages: UploadedImage[] = [];
  isDragging = false;
  gridSize = 4; 

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.uploadForm = this.fb.group({
      image: [null, [Validators.required]]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFile(file);
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

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    // if (file.size > 5 * 1024 * 1024) {
    //   alert('File size should not exceed 5MB');
    //   return;
    // }

    this.selectedFile = file;
    this.uploadForm.patchValue({ image: file });

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = reader.result as string;
      // Add the new file and its previewUrl to the uploadedImages array, limiting to 4
      if (this.uploadedImages.length < 4) {
         this.uploadedImages.push({ file: file, previewUrl: previewUrl });
         this.uploadedImages = [...this.uploadedImages]; // Trigger change detection
      }
      this.previewUrl = previewUrl;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.imageUploaded.emit(this.selectedFile);
      this.closeModal();
    }
  }

  removeImage() {
    const index = this.uploadedImages.findIndex(f => f.file === this.selectedFile);
    if (index > -1) {
      this.uploadedImages.splice(index, 1);
    }

    this.selectedFile = null;
    this.previewUrl = null;
    this.uploadForm.patchValue({ image: null });

    // If there are other images, set the first one as the selected file
    if (this.uploadedImages.length > 0) {
      this.selectImage(this.uploadedImages[0]);
    }
  }

  selectImage(uploadedImage: UploadedImage) {
    this.selectedFile = uploadedImage.file;
    this.previewUrl = uploadedImage.previewUrl;
    this.uploadForm.patchValue({ image: uploadedImage.file });
  }

  triggerFileInput() {
    // Only trigger file input if less than 4 images are uploaded
    if (this.uploadedImages.length < 4) {
       const fileInput = this.document.getElementById('fileInput') as HTMLInputElement;
       if (fileInput) {
         fileInput.click();
       }
    }
  }
} 