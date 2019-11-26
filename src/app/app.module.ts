import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';

import { NgxCroppieModule } from 'ngx-croppie';
import { NotifierModule } from 'angular-notifier';
import { NotifierDefaultOptions } from './services/notifier.option';

import { environment } from '../environments/environment';
import { AuthGuard } from './guards/auth.guard';
import { DinnerResolver } from './resolvers/dinner.resolver';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AddDinnerComponent } from './add-dinner/add-dinner.component';
import { ListDinnerComponent } from './list-dinner/list-dinner.component';
import { EditDinnerComponent } from './edit-dinner/edit-dinner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    AddDinnerComponent,
    ListDinnerComponent,
    EditDinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    NgxCroppieModule,
    NotifierModule.withConfig(NotifierDefaultOptions),
  ],
  providers: [
    AuthGuard,
    DinnerResolver,
    { provide: StorageBucket, useValue: 'ew-dinners.appspot.com' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
