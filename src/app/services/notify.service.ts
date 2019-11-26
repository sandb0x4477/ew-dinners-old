import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  notifySuccess(message: string = 'Success!') {
    this.notifier.show({
      type: 'success',
      message,
      id: 'THAT_NOTIFICATION_ID', // Again, this is optional
    });
  }
}
