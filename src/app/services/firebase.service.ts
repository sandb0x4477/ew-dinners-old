import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Dinner } from '../models/dinner.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  dinners$: Observable<Dinner[]>;
  order$: Observable<string[]>;
  sortedDinners$: Observable<Dinner[]>;
  order: string[] = [];

  dinnersRef: AngularFireList<any>;
  orderRef: AngularFireList<any>;

  percentage: Observable<number>;
  downloadURL: Observable<string>;

  fileRef: AngularFireStorageReference;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {
    this.dinnersRef = db.list('dinners');
    this.orderRef = db.list('order');

    this.dinners$ = this.dinnersRef.valueChanges();
    this.order$ = this.orderRef.valueChanges();

    combineLatest([this.dinners$, this.order$]).subscribe(([dinners, order]) => {
      this.order = order;
      this.sortedDinners$ = this.sortDinners(order, dinners);
    });
  }

  getDinner(id: string): Observable<Dinner> {
    return this.dinners$.pipe(map(results => results.filter(d => d.id === id)[0]));
  }

  async removeDinnerRecord(data: Dinner) {
    const orderTemp = [...this.order];
    const orderIndex = orderTemp.filter(k => k !== data.id);

    try {
      await this.orderRef.set('/', orderIndex);
      await this.dinnersRef.remove(data.id);
      await this.storage.storage.ref(data.imgPath).delete();
    } catch (error) {
      console.log('Firebase Service => ', error);
    }
  }

  uploadImage(image: Blob, filePath: string): Observable<firebase.storage.UploadTaskSnapshot> {
    this.fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, image);

    this.percentage = task.percentageChanges();

    return task.snapshotChanges();
  }

  deleteImage(imgPath: string) {
    return this.storage.storage.ref(imgPath).delete();
  }

  async addNewDinner(imgUrl: string, imgPath: string, formValues: any): Promise<void> {
    const keyRef = this.db.createPushId();
    const orderTemp = [...this.order];
    orderTemp.push(keyRef);

    const newEntry = {};

    newEntry[`/dinners/${keyRef}`] = {
      title: formValues.title,
      info: formValues.info,
      imgUrl,
      imgPath,
      id: keyRef,
      createdAt: Math.floor(Date.now() / 1000).toString(),
    };
    newEntry['/order'] = orderTemp;

    await this.db.database
      .ref()
      .update(newEntry)
      .catch(err => console.log(err));
  }

  updateRecord(data: Dinner) {
    return this.dinnersRef.update(data.id, data);
  }

  moveDown(key: string) {
    const orderTemp = [...this.order];
    const lengthOfOrder = orderTemp.length - 1;
    const currentIndex = orderTemp.findIndex(i => i === key);
    const id = orderTemp.splice(currentIndex, 1)[0];
    if (currentIndex === lengthOfOrder) {
      orderTemp.splice(0, 0, id);
    } else {
      orderTemp.splice(currentIndex + 1, 0, id);
    }
    this.orderRef.set('/', orderTemp).catch(err => console.log(err));
  }

  moveUp(key: string) {
    const orderTemp = [...this.order];
    const lengthOfOrder = orderTemp.length - 1;
    const currentIndex = orderTemp.findIndex(i => i === key);
    const id = orderTemp.splice(currentIndex, 1)[0];
    if (currentIndex === 0) {
      orderTemp.splice(lengthOfOrder, 0, id);
    } else {
      orderTemp.splice(currentIndex - 1, 0, id);
    }
    this.orderRef.set('/', orderTemp).catch(err => console.log(err));
  }

  private sortDinners(arrOrder: any[], arrDinners: any[]) {
    const tempArr = [];
    arrOrder.forEach(el => tempArr.push(arrDinners.find(e => e.id === el)));
    return of(tempArr);
  }
}
