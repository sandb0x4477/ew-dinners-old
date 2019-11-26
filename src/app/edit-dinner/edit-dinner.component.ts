import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxCroppieComponent } from 'ngx-croppie';
import { CroppieOptions, ResultOptions } from 'croppie';

import { Dinner } from '../models/dinner.model';
import { FirebaseService } from '../services/firebase.service';
import { NotifyService } from '../services/notify.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-dinner',
  templateUrl: './edit-dinner.component.html',
  styleUrls: ['./edit-dinner.component.scss'],
})
export class EditDinnerComponent implements OnInit {
  @ViewChild('ngxCroppie', { static: false }) ngxCroppie: NgxCroppieComponent;
  dinnerForm: FormGroup;

  isNewImage = 0;

  dinner: Dinner;

  //#region Croppie
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
  //#endregion

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private firebase: FirebaseService,
    private notify: NotifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.dinner = data['dinner'];
    });
    this.imageUrl = this.dinner.imgUrl;
    this.croppieImage = this.imageUrl;
    this.dinnerForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: [
        this.dinner.title || '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      info: [this.dinner.info || ''],
    });
  }

  onSubmit() {
    // console.log('DinnerForm =>', this.dinnerForm.value);
    if (this.isNewImage <= 2) {
      const updatedRecord = {
        title: this.dinnerForm.value.title,
        info: this.dinnerForm.value.info,
        imgUrl: this.dinner.imgUrl,
        imgPath: this.dinner.imgPath,
        id: this.dinner.id,
        createdAt: this.dinner.createdAt,
      };

      this.firebase
        .updateRecord(updatedRecord)
        .then(() => {
          console.log('Record Updated');
          this.router.navigate(['/']);
          this.notify.notifySuccess();
        })
        .catch(err => console.log(err));
    } else {
      const oldImgPath = this.dinner.imgPath;
      const filePath = `/${new Date().getTime()}_${this.imageName}`;
      this.firebase
        .uploadImage(this.editedImage, filePath)
        .pipe(
          finalize(async () => {
            const downloadURL = await this.firebase.fileRef.getDownloadURL().toPromise();
            console.log('DownloadURL => ', downloadURL);
            this.updateRecordWithImage(downloadURL, filePath, oldImgPath);
            // this.addNewRecord(this.downloadURL, filePath);
          })
        )
        .subscribe();
    }

    // ! Delete Image
    // this.firebase
    //   .deleteImage(this.dinner.imgPath)
    //   .then(() => console.log('Image Deleted'))
    //   .catch(err => console.log(err));
    // this.db.uploadImage(this.editedImage, this.imageName, this.dinnerForm.value);
  }

  updateRecordWithImage(downloadURL: string, filePath: string, oldFilePath: string) {
    const updatedRecord = {
      title: this.dinnerForm.value.title,
      info: this.dinnerForm.value.info,
      imgUrl: downloadURL,
      imgPath: filePath,
      id: this.dinner.id,
      createdAt: this.dinner.createdAt,
    };

    this.firebase
      .updateRecord(updatedRecord)
      .then(() => {
        console.log('Record Updated with Image');
        this.router.navigate(['/']);
        this.notify.notifySuccess();
        // ! Delete Image
        this.firebase
          .deleteImage(oldFilePath)
          .then(() => console.log('Image Deleted'))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  newImageResultFromCroppie(img: Blob) {
    this.isNewImage++;
    console.log('this.isNewImage => ', this.isNewImage);
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
}
