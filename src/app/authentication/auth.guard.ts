import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) {}
    
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): true | UrlTree {
        const url: string = state.url;
    
        return this.checkLogin(url);
      }

      checkLogin(url: string): true | UrlTree {
        if (this.userService.authToken) {
          return true;
        }
    
        // Store the attempted URL for redirecting
        this.userService.redirectUrl = url;
    
        // Redirect to the login page
        return this.router.parseUrl("/login");
      }
}
