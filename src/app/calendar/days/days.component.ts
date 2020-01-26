import { Component, OnInit, Input } from '@angular/core';
import { startOfWeek, addDays, format } from 'date-fns';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss']
})
export class DaysComponent implements OnInit {
  @Input() currentMonth: Date;
  @Input() weekStartsOn: any;

  dateFormat = 'EEE';
  days = [];
  startDate: Date;

  constructor() {}

  ngOnInit() {
    this.startDate = startOfWeek(this.currentMonth, { weekStartsOn: this.weekStartsOn });
    for (let i = 0; i < 7; i++) {
      this.days.push(format(addDays(this.startDate, i), this.dateFormat));
    }
  }

}
