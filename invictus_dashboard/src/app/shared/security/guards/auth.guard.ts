import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private securityService: SecurityService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let claimType: string = route.data["claimType"];
      let hasClaimType:boolean =  this.securityService.securityObj[claimType as keyof typeof this.securityService.securityObj].toString() != '';

      if(this.securityService.securityObj.isAuthenticated && hasClaimType){
        return true;
      } else {
        this.router.navigate(['login'], {queryParams: { returnUrl: state.url }});
        return false;
      }
  }

}
