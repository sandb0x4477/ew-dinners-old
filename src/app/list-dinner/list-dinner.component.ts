import { Component, OnInit } from '@angular/core';
import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { FirebaseService } from '../services/firebase.service';
import { StoreService } from '../services/store.service';
import { Dinner } from '../models/dinner.model';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-list-dinner',
  templateUrl: './list-dinner.component.html',
  styleUrls: ['./list-dinner.component.scss'],
})
export class ListDinnerComponent implements OnInit {
  noImage = 'assets/no-image.jpg';
  isModal = false;
  selectedDinner: Dinner;

  constructor(
    public firebase: FirebaseService,
    public store: StoreService,
    private notify: NotifyService
  ) {}

  ngOnInit() {}

  onDelete() {
    this.isModal = false;
    this.firebase
      .removeDinnerRecord(this.selectedDinner)
      .then(() => {
        console.log('Removed');
        this.notify.notifySuccess();
      })
      .catch(err => console.log('List Dinners Service => ', err.message));
  }

  onShowModal(data: Dinner) {
    this.selectedDinner = data;
    this.isModal = true;
  }

  onCloseModal() {
    this.isModal = false;
  }

  isLink(text: string) {
    const substring = text.substring(0, 3);
    if (substring === 'htt') {
      return true;
    }
    return false;
  }

  onMoveDown(id: string) {
    this.firebase.moveDown(id);
  }

  onMoveUp(id: string) {
    this.firebase.moveUp(id);
  }

  parseDate(unixstamp: string) {
    if (!unixstamp) {
      return '';
    }
    return formatDistanceToNow(fromUnixTime(+unixstamp));
  }
}
