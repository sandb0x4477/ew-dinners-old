import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { DinnerResolver } from './resolvers/dinner.resolver';

import { LoginComponent } from './login/login.component';
import { AddDinnerComponent } from './add-dinner/add-dinner.component';
import { ListDinnerComponent } from './list-dinner/list-dinner.component';
import { EditDinnerComponent } from './edit-dinner/edit-dinner.component';

const routes: Routes = [
  { path: '', component: ListDinnerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add', component: AddDinnerComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:id',
    component: EditDinnerComponent,
    resolve: {
      dinner: DinnerResolver,
    },
    canActivate: [AuthGuard],
  },
  { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
