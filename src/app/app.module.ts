import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
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

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    DashboardPage,
    AppointmentsPage,
    JobsPage,
    JobDetailsPage,
    ForgotPasswordPage,
    MultiLoginPage
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
    SignupPage,
    DashboardPage,
    AppointmentsPage,
    JobsPage,
    JobDetailsPage,
    ForgotPasswordPage,
    MultiLoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFirestore,
    AngularFireAuth,
    SocialSharing,
    AuthProvider,
    DataProvider,
    FeedbackProvider,
    WindowProvider
  ]
})
export class AppModule { }
