import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { FirebaseService } from '../services/firebase.service';
import { Dinner } from '../models/dinner.model';

@Injectable()
export class DinnerResolver implements Resolve<Dinner> {
  constructor(private router: Router, private db: FirebaseService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Dinner | null> {
    return this.db.getDinner(route.params['id']).pipe(
      first(),
      catchError(err => {
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
