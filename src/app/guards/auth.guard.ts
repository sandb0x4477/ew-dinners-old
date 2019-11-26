import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
// import { Observable } from 'rxjs';
// import { tap, map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await this.auth.getUser();
    const loggedIn = !!user;

    if (!loggedIn) {
      console.log('access denied');
      this.router.navigate(['/login']);
      return false;
    } else {
      console.log('access granted');
      return true;
    }
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> {
  //   return this.auth.user$.pipe(
  //     take(1),
  //     map(user => !!user), // <-- map to boolean
  //     tap(loggedIn => {
  //       if (!loggedIn) {
  //         console.log('access denied');
  //         this.router.navigate(['/login']);
  //       } else {
  //         console.log('access granted');
  //       }
  //     })
  //   );
  // }
}
