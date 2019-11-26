import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AddDinnerComponent } from './add-dinner/add-dinner.component';
import { ListDinnerComponent } from './list-dinner/list-dinner.component';
import { AuthGuard } from './guards/auth.guard';
import { EditDinnerComponent } from './edit-dinner/edit-dinner.component';
import { DinnerResolver } from './resolvers/dinner.resolver';

const routes: Routes = [
  { path: '', component: ListDinnerComponent, canActivate: [AuthGuard] },
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
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
