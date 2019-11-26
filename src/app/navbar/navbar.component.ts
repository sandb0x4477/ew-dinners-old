import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    `
    .navbar-item img {
        max-height: 42px !important;
        border-radius: 50%;
        margin-right: 10px;
    }
    .ew-text {
        margin-left: 30px;
    }`,
  ],
})
export class NavbarComponent implements OnInit {
  constructor(public store: StoreService) {}

  ngOnInit() {}
}
