import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { format } from 'date-fns';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() currentMonth: Date;
  @Output() command: EventEmitter<string> = new EventEmitter<string>();

  dateFormat = 'MMMM yy';

  constructor() { }

  ngOnInit() {
  }

  get currMonth() {
    return format(this.currentMonth, this.dateFormat);
  }

  onCommand(cmd: string) {
    this.command.emit(cmd);
  }
}
