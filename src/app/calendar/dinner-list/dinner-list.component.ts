import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-dinner-list',
  templateUrl: './dinner-list.component.html',
  styleUrls: ['./dinner-list.component.scss'],
})
export class DinnerListComponent implements OnInit {
  @Input() isModalActive: boolean;
  @Output() cancelModal: EventEmitter<string> = new EventEmitter<string>();

  constructor(public fb: FirebaseService) {}

  ngOnInit() {}

  onSelectDinner(dinner: any) {
    console.log('dinner => ', dinner);
  }

  onCancelModal() {
    this.cancelModal.emit('cancelModal');
  }
}
