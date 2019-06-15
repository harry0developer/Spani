import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { JobsPage } from '../pages/jobs/jobs';
import { JobDetailsPage } from '../pages/job-details/job-details';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { AppointmentsPage } from '../pages/appointments/appointments';

import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { FeedbackProvider } from '../providers/feedback/feedback';

import { RatingModule } from "ngx-rating";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { firebaseConfig } from '../config';
import { SocialSharing } from '@ionic-native/social-sharing';

// import { NgxMaskModule, IConfig } from 'ngx-mask'
// export let options: Partial<IConfig> | (() => Partial<IConfig>);

import { BrMaskerModule } from 'brmasker-ionic-3';
import { MultiLoginPage } from '../pages/multi-login/multi-login';
import { WindowProvider } from '../providers/window/window';
import { HttpClientModule } from '@angular/common/http';
import { MultiSignupPage } from '../pages/multi-signup/multi-signup';
import { SetupPage } from '../pages/setup/setup';
import { PlacesPage } from '../pages/places/places';
import { ProfilePage } from '../pages/profile/profile';
import { ErrorPage } from '../pages/error/error';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import { JobsListPage } from '../pages/jobs-list/jobs-list';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { RatersPage } from '../pages/raters/raters';
import { TestUiPage } from '../pages/test-ui/test-ui';
import { NationalityPage } from '../pages/nationality/nationality';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    DashboardPage,
    AppointmentsPage,
    JobsPage,
    JobDetailsPage,
    ForgotPasswordPage,
    MultiLoginPage,
    MultiSignupPage,
    SetupPage,
    PlacesPage,
    ProfilePage,
    ErrorPage,
    JobsListPage,
    UserDetailsPage,
    RatersPage,
    NationalityPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    BrMaskerModule,
    HttpClientModule,
    // NgxMaskModule.forRoot(options),
    RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    DashboardPage,
    AppointmentsPage,
    JobsPage,
    JobDetailsPage,
    ForgotPasswordPage,
    MultiLoginPage,
    MultiSignupPage,
    SetupPage,
    PlacesPage,
    ProfilePage,
    ErrorPage,
    JobsListPage,
    UserDetailsPage,
    RatersPage,
    NationalityPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFirestore,
    AngularFireAuth,
    SocialSharing,
    Network,
    AuthProvider,
    DataProvider,
    FeedbackProvider,
    WindowProvider,
    NetworkProvider
  ]
})
export class AppModule { }
