import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LoggedComponent } from './pages/logged/logged.component';
import { ProfileComponent } from './pages/logged/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoggedComponent,
    ProfileComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
