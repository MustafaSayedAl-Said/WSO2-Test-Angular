 
import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [HttpClientModule, CommonModule, NgIf, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'wso2-api-test-app';

  fileName = '';
  showDialog = false;
  showDownloadDialog = false;
  fileUploadForm: FormGroup;
  fileDownloadForm: FormGroup;
  selectedFile: File = null;
  valueEntered: string = '';
  constructor(private apiService: ApiService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.createDocumentFileForm();
    this.createDownloadForm();
  }


  createDocumentFileForm(){
    this.fileUploadForm = this.fb.group({
      file: [null, Validators.required]
    })
  }
  createDownloadForm(){
    this.fileDownloadForm = this.fb.group({
      String: [null, Validators.required]
    })
  }

  get _file(){
    return this.fileUploadForm.get('file');
  }
  
  get _string(){
    return this.fileDownloadForm.get('String');
  }

  openDocumentAddDialog(){
    this.showDialog = true;
  }

  openDocumentDownloadDialog(){
    this.showDownloadDialog = true;
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
 
      if (
        fileExtension !== 'pdf' &&
        fileExtension !== 'txt'
      ) {
        console.error(
          'Please select a PDF, TXT file.'
        );
        input.value = '';
        this.fileUploadForm.patchValue({
          file: null,
        });
        this.fileName = '';
      } else {
        this.selectedFile = file;
        this.fileName = this.selectedFile.name;
        this.fileUploadForm.patchValue({
          file: this.selectedFile,
        });
        console.log('Ay haga');
      }
    }
  }

  onTextEntered(event: any): void{
    this.valueEntered = event.target.value;
  }

  
  Upload(){

    this.apiService.addDocument(this.selectedFile).subscribe({
    next: () => {
      console.log('Document added Successfully');
      this.showDialog = false;
      this.fileUploadForm.patchValue({ file: null });
      this.fileName = '';
      this.cancel();
    },
    error: (err) => {
      console.error('Error adding document', err);
      this.cancel();
    }
    });
  }

  Download(){

    this.apiService.downloadDocument(this.valueEntered).subscribe({
      next: (response) => {
        console.log('Download initiated successfully');
        this.cancel();
      },
      error: (err) => {
        console.error('Download failed', err);
        this.cancel();
      },
    });

  }


  cancel() {
    this.showDialog = false;
    this.showDownloadDialog = false;
    this.fileUploadForm.patchValue({ file: null });
    this.fileName = '';
    this.valueEntered = '';
    this.fileDownloadForm.patchValue({ String: null });
  }
}
