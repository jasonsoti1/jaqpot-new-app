import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { configf } from './config/conf';
import { Config } from './config/config';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { AuthModule, OidcSecurityService, OidcConfigService, LogLevel, } from 'angular-auth-oidc-client';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { MatSortModule } from '@angular/material/sort';
import { FeatureTableComponent } from './feature-table/feature-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
// import { DialogsModule } from './dialogs/dialogs.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatasetCsvComponent } from './dataset-csv/dataset-csv.component';
import { AskForIdComponent } from './ask-for-id/ask-for-id.component';
import { PredictionsComponent } from './predictions/predictions.component';


@NgModule({
  declarations: [
    AppComponent,
    FeatureTableComponent,
    DatasetCsvComponent,
    AskForIdComponent,
    PredictionsComponent,
  ],
  imports: [
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,    
    BrowserAnimationsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    MatSelectModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    AuthModule.forRoot(),
    MatTableModule,
    MatSortModule
  ],
  // exports: [DialogsModule],
  // entryComponents: [AskForIdComponent],
  providers: [OidcConfigService,OidcSecurityService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService, HttpClient],
      multi: true,
  }],
  bootstrap: [AppComponent] //TestTableComponent
})


export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);


export function configureAuth(oidcConfigService: OidcConfigService, httpClient: HttpClient) {
  const setupAction$ = httpClient.get<any>(`/assets/conf.json`).pipe(
      map((customConfig:configf) => {
        Config.JaqpotBase = customConfig.jaqpotApi
        
          return {
              stsServer: customConfig.stsServer,              
              redirectUrl: customConfig.redirect_url,
              clientId: customConfig.client_id,
              responseType: customConfig.response_type,
              scope: customConfig.scope,
              silentRenew: true,
              silentRenewUrl: customConfig.silent_redirect_url,
              postLogoutRedirectUri: window.location.origin,
              logLevel: LogLevel.Debug, // LogLevel.Debug,
              maxIdTokenIatOffsetAllowedInSeconds: 120,
              historyCleanupOff: false,
              autoUserinfo: false,
              storage: localStorage
          };
      }),
      switchMap((config) => oidcConfigService.withConfig(config))
  );

  return () => setupAction$.toPromise();
}