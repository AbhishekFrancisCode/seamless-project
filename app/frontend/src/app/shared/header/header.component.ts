import { SharedService } from './../shared.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NB_WINDOW, NbMenuService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated = false;
  userSub: Subscription;
  branch_name;
  user_name;
  items = [{ title: 'Profile' }, { title: 'Log out' }];
  branch_city: string;

  constructor(private sharedservice: SharedService,
    private nbMenuService: NbMenuService,
    @Inject(NB_WINDOW) private window) { }

  ngOnInit(): void {

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title =>
        {
          console.log(title);
          if (title == 'Log out'){
            this.logout();
          }
        });


    this.branch_name = localStorage.getItem('branch_name') ;
    this.branch_city = localStorage.getItem('branch_city')
    this.user_name = localStorage.getItem('first_name');
    this.userSub = this.sharedservice.userSubject.subscribe(user => {

      this.isAuthenticated = !!user;
    });


    // else
    // {
    //   this.userSub =  this.sharedservice.userSubject.subscribe(user=>
    //     {

    //       this.isAuthenticated = this.sharedservice.checkLogin();
    //     });
    // }
  }

  logout() {
    this.sharedservice.logout();

  }

}
