import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcClientNotification, OidcSecurityService, PublicConfiguration, PublicEventsService,  EventTypes } from 'angular-auth-oidc-client';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = "<%= title %>";
  desc = "<%= description %>";

  isAuthenticated: boolean;
  loggedIn:boolean;
  subscription:Subscription;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

  configuration: PublicConfiguration;
  userDataChanged$: Observable<OidcClientNotification<any>>;
  userData$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  checkSessionChanged$: Observable<boolean>;
  checkSessionChanged: any;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private _router:Router,private eventService: PublicEventsService,
  ){}

  ngOnInit(){
    this.isAuthorizedSubscription = this.oidcSecurityService.isAuthenticated$.subscribe(
      (isAuthorized: boolean) => {
        if(isAuthorized === true){
          this.isAuthenticated = true;
        }else{
          this.isAuthenticated = false;
        }
      });
      this.configuration = this.oidcSecurityService.configuration;
      this.userData$ = this.oidcSecurityService.userData$;
      this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
      this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

      this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));

      this.eventService
          .registerForEvents()
          .pipe(filter((notification) => notification.type === EventTypes.CheckSessionReceived))
          .subscribe((value) => console.log('CheckSessionReceived with value from app', value));
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff()
  }

}