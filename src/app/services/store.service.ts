import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private isEdit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }

  public get isEdited() {
    return this.isEdit;
  }

  onEditToggle() {
    this.isEdit.next(!this.isEdit.getValue());
  }
}
