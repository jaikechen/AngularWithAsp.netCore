import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { map } from 'rxjs/operators';

class MenuItem {
  public title: string;
  public url: string;
}

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
   public menuItems: Observable<MenuItem[]>;

  userMenu: MenuItem[] = [{
    title: 'Todo',
    url:'todos',
  }];

  adminMenu: MenuItem[] = [...this.userMenu,{
    title: 'Users',
    url:'users',
  }];

  constructor(
    private breakpointObserver: BreakpointObserver,
        private authorizeService: AuthorizeService
  ) {}
  ngOnInit() {
    this.menuItems =  this.authorizeService.getUser().pipe(
       map(u => !u?[]: u.is_admin == "1" ? this.adminMenu : this.userMenu)
    );
  }
}
