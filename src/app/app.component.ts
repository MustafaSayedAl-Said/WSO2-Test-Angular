 
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
  fileUploadForm: FormGroup;
  selectedFile: File = null;
  constructor(private apiService: ApiService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.createDocumentFileForm();
  }


  createDocumentFileForm(){
    this.fileUploadForm = this.fb.group({
      file: [null, Validators.required]
    })
  }

  get _file(){
    return this.fileUploadForm.get('file');
  }

  openDocumentAddDialog(){
    this.showDialog = true;
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

  
  Upload(){

  }

  Download(){

  }


  cancel() {
    this.showDialog = false;
    this.fileUploadForm.patchValue({ file: null });
    this.fileName = '';
  }

  save() {
    // this.dmsService.addDocument(this.selectedFile, this.id).subscribe({
    //   next: () => {
    //     this.toast.success('Document added Successfully');
    //     this.showDialog = false;
    //     this.fileUploadForm.patchValue({ file: null });
    //     this.fileName = '';
    //     this.loadDocuments();
    //   },
    //   error: (err) => {
    //     this.toast.error('Error adding document', err);
    //   },
    // });s
  }
}
