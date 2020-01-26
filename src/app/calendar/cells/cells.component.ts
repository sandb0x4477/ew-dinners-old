import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getDate,
  isToday,
  isSunday,
  isSameWeek,
  isSameMonth,
} from 'date-fns';
import { Cell } from '../models/cell.model';

@Component({
  selector: 'app-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.scss'],
})
export class CellsComponent implements OnInit {
  @Input() currentMonth: Date;
  @Input() selectedDate: Date;
  @Input() weekStartsOn: any;
  @Output() command: EventEmitter<string> = new EventEmitter<string>();

  days: Cell[] = [];

  dateFormat = 'dd';
  formattedDate = '';

  constructor() {}

  ngOnInit() {}

  onCellClick(cell: Cell) {
    console.log('cell => ', cell);
    this.command.emit('cellSelected');
  }

  get monthStart() {
    return startOfMonth(this.currentMonth);
  }

  get monthEnd() {
    return endOfMonth(this.currentMonth);
  }

  get startOfWeek() {
    return startOfWeek(this.monthStart, { weekStartsOn: this.weekStartsOn });
  }

  get endOfWeek() {
    return endOfWeek(this.monthEnd, { weekStartsOn: this.weekStartsOn });
  }

  get cells() {
    this.days = [];
    const firstDay = startOfWeek(this.monthStart, { weekStartsOn: this.weekStartsOn });
    for (let i = 0; i < 42; i++) {
      const day = {
        cellDay: getDate(addDays(firstDay, i)),
        cellDate: addDays(firstDay, i),
        isToday: isToday(addDays(firstDay, i)),
        isSunday: isSunday(addDays(firstDay, i)),
        isSameWeek: isSameWeek(new Date(), addDays(firstDay, i), {
          weekStartsOn: this.weekStartsOn,
        }),
        isSameMonth: isSameMonth(this.currentMonth, addDays(firstDay, i)),
      } as Cell;
      this.days.push(day);
    }
    return this.days;
  }
}
