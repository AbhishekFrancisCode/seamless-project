import { map, take } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
  constructor(private sharedservice:SharedService,private router:Router)
  {

  }
  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //  return this.sharedservice.user.pipe(
  //   take(1),
  //   map(user =>{
  //    const isauth = !!user;
  //    if (isauth)
  //    {
  //      return true;
  //    }
  //    return this.router.createUrlTree(['/Login'])
  //  }));
     if (localStorage.getItem('user_id'))
     {
        if (localStorage.getItem('user_id') &&  localStorage.getItem('branch_id'))
        {
          return true;
        }else{
          return this.router.createUrlTree(['/BranchSelect'])
        }
     }else {
       return this.router.createUrlTree(['/Login'])
     }

  }

}
