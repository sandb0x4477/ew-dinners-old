import { Component, OnInit } from '@angular/core';
import { addMonths, subMonths, format } from 'date-fns';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  currentMonth = new Date();
  selectedDate = new Date();
  weekStartsOn = 1;

  monthDataString = '';
  monthFormat = 'MMM-yyyy';

  isModalActive = false;

  constructor(public fb: FirebaseService) {
  }

  ngOnInit() {
    this.getMonthDataString();
    // this.fb.selectMonth(this.monthDataString);
    console.log('monthDataString => ', this.monthDataString);
  }

  getMonthDataString() {
    this.monthDataString = format(this.currentMonth, this.monthFormat);
    this.fb.selectMonth(this.monthDataString);
  }

  onCommand(event: string) {
    switch (event) {
      case 'nextMonth':
        this.currentMonth = addMonths(this.currentMonth, 1);
        this.getMonthDataString();
        console.log('monthDataString => ', this.monthDataString);
        break;

      case 'prevMonth':
        this.currentMonth = subMonths(this.currentMonth, 1);
        this.getMonthDataString();
        console.log('monthDataString => ', this.monthDataString);
        break;

      case 'cellSelected':
        console.log('cellSelected => ', event);
        this.isModalActive = true;
        break;

      case 'cancelModal':
        console.log('cellSelected => ', event);
        this.isModalActive = false;
        break;

      default:
        break;
    }
  }
}
