import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import {Observable} from 'rxjs';

import {SupaService} from './supa.service';

@Injectable({providedIn: 'root'})
export class LoginGuard implements CanActivate {
  constructor(private supa: SupaService, private router: Router) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !!this.supa.user ? true : this.router.parseUrl('');
  }
}
