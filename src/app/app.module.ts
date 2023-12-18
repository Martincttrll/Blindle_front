import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LoggedComponent } from './pages/logged/logged.component';
import { ProfileComponent } from './pages/logged/profile/profile.component';
import { ModalComponent } from './pages/logged/modal/modal.component';
import { AchievementCardComponent } from './shared/layout/achievement-card/achievement-card.component';
import { ListComponent } from './shared/layout/list/list.component';
import { ListItemComponent } from './shared/layout/list/list-item/list-item.component';
import { LobbyComponent } from './pages/logged/lobby/lobby.component';
import { AlertErrorComponent } from './shared/layout/alert-error/alert-error.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoggedComponent,
    ProfileComponent,
    ModalComponent,
    AchievementCardComponent,
    ListComponent,
    ListItemComponent,
    LobbyComponent,
    AlertErrorComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
