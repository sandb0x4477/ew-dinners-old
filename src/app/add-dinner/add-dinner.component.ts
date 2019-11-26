import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCroppieComponent } from 'ngx-croppie';
import { CroppieOptions, ResultOptions } from 'croppie';

import { FirebaseService } from '../services/firebase.service';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-add-dinner',
  templateUrl: './add-dinner.component.html',
  styleUrls: ['./add-dinner.component.scss'],
})
export class AddDinnerComponent implements OnInit {
  @ViewChild('ngxCroppie', { static: false }) ngxCroppie: NgxCroppieComponent;
  dinnerForm: FormGroup;

  percentage: Observable<number>;
  downloadURL: string;

  widthPx = '348';
  heightPx = '261';
  imageUrl = 'assets/no-image.jpg';
  croppieImage: string | ArrayBuffer;
  editedImage: Blob;
  defaultZoom = 0.3;
  imageName = 'no-image.jpg';

  outputFormatOptions: ResultOptions = {
    size: { width: 600, height: 450 },
    format: 'jpeg',
    quality: 0.8,
    type: 'blob',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public firebase: FirebaseService,
    private notify: NotifyService
  ) {}

  ngOnInit() {
    this.croppieImage = this.imageUrl;
    this.dinnerForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      info: [''],
    });
  }

  public get croppieOptions(): CroppieOptions {
    const opts: CroppieOptions = {};
    opts.viewport = {
      width: parseInt(this.widthPx, 10),
      height: parseInt(this.heightPx, 10),
    };
    opts.boundary = {
      width: parseInt(this.widthPx, 10) + 5,
      height: parseInt(this.heightPx, 10) + 5,
    };
    opts.enforceBoundary = true;
    opts.enableExif = true;
    opts.enableZoom = true;
    opts.enableOrientation = true;
    return opts;
  }

  onSubmit() {
    // console.log('DinnerForm =>', this.dinnerForm.value);
    const filePath = `/${new Date().getTime()}_${this.imageName}`;
    this.firebase.uploadImage(this.editedImage, filePath).pipe(
      finalize( async () => {
        this.downloadURL = await this.firebase.fileRef.getDownloadURL().toPromise();
        console.log('this.downloadURL => ', this.downloadURL);
        this.addNewRecord(this.downloadURL, filePath);
      })
    ).subscribe();
  }

  addNewRecord(downloadURL: string, filePath: string) {
    this.firebase.addNewDinner(downloadURL, filePath, this.dinnerForm.value)
    .then(() => {
      console.log('New Record Added!!!');
      this.router.navigate(['/']);
      this.notify.notifySuccess();
    })
    .catch(err => console.error(err));
  }

  newImageResultFromCroppie(img: Blob) {
    this.editedImage = img;
  }

  imageUploadEvent(evt: any) {
    this.imageName = evt.target.files[0].name;
    if (!evt.target) {
      return;
    }
    if (!evt.target.files) {
      return;
    }
    if (evt.target.files.length !== 1) {
      return;
    }
    const file = evt.target.files[0];
    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/gif' &&
      file.type !== 'image/jpg'
    ) {
      return;
    }
    const fr = new FileReader();
    fr.onloadend = loadEvent => {
      this.croppieImage = fr.result.toString();
    };
    fr.readAsDataURL(file);
  }
}
