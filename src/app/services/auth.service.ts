import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Login } from '../models/login.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  debug = environment.debug;

  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.user$ = this.afAuth.authState;
  }

  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  loginWithEmail(creds: Login): Promise<auth.UserCredential> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(creds.email, creds.password).then(
        userCreds => resolve(userCreds),
        err => reject(err)
      );
    });
  }

  loginWithGoogle(): Promise<auth.UserCredential> {
    return new Promise((resolve, reject) => {
      const provider = new auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth.signInWithPopup(provider).then(
        userCreds => resolve(userCreds),
        err => reject(err)
      );
    });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    await this.router.navigate(['/login']);
  }
}
