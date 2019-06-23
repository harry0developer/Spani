import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DashboardPage } from '../pages/dashboard/dashboard';
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

import { BrMaskerModule } from 'brmasker-ionic-3';
import { MultiLoginPage } from '../pages/multi-login/multi-login';
import { WindowProvider } from '../providers/window/window';
import { MultiSignupPage } from '../pages/multi-signup/multi-signup';
import { SetupPage } from '../pages/setup/setup';
import { PlacesPage } from '../pages/places/places';
import { ProfilePage } from '../pages/profile/profile';
import { ErrorPage } from '../pages/error/error';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { RatersPage } from '../pages/raters/raters';
import { NationalityPage } from '../pages/nationality/nationality';
import { SmtpProvider } from '../providers/smtp/smtp';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { SuccessPage } from '../pages/success/success';
import { UsersPage } from '../pages/users/users';
import { FilterPage } from '../pages/filter/filter';
import { CategoryPage } from '../pages/category/category';
import { PostJobPage } from '../pages/post-job/post-job';
import { ServicesPage } from '../pages/services/services';
import { ServiceDetailsPage } from '../pages/service-details/service-details';

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    AppointmentsPage,
    ForgotPasswordPage,
    MultiLoginPage,
    MultiSignupPage,
    SetupPage,
    PlacesPage,
    ProfilePage,
    ErrorPage,
    UserDetailsPage,
    RatersPage,
    NationalityPage,
    SuccessPage,
    UsersPage,
    FilterPage,
    CategoryPage,
    PostJobPage,
    ServicesPage,
    ServiceDetailsPage,
    ServiceDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    BrMaskerModule,
    HttpClientModule,
    RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    AppointmentsPage,
    ForgotPasswordPage,
    MultiLoginPage,
    MultiSignupPage,
    SetupPage,
    PlacesPage,
    ProfilePage,
    ErrorPage,
    UserDetailsPage,
    RatersPage,
    NationalityPage,
    SuccessPage,
    UsersPage,
    FilterPage,
    CategoryPage,
    PostJobPage,
    ServicesPage,
    ServiceDetailsPage,
    ServiceDetailsPage
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
    NetworkProvider,
    SmtpProvider,
    HTTP
  ]
})
export class AppModule { }
