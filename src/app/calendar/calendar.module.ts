import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { HeaderComponent } from './header/header.component';
import { DaysComponent } from './days/days.component';
import { CellsComponent } from './cells/cells.component';
import { DinnerListComponent } from './dinner-list/dinner-list.component';

@NgModule({
  declarations: [
    CalendarComponent,
    HeaderComponent,
    DaysComponent,
    CellsComponent,
    DinnerListComponent,
  ],
  imports: [CommonModule, CalendarRoutingModule],
})
export class CalendarModule {}
