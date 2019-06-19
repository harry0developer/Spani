import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { MultiLoginPage } from '../pages/multi-login/multi-login';
import { ProfilePage } from '../pages/profile/profile';
import { JobsPage } from '../pages/jobs/jobs';
import { User } from '../models/user';
import { Network } from '@ionic-native/network';
import { EVENTS } from '../utils/const';
import { FilterPage } from '../pages/filter/filter';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MultiLoginPage;

  pages: any;
  profile: User;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    private ionEvents: Events,
    private network: Network,
  ) {
    this.initializeApp();

    this.pages = {
      jobsPage: JobsPage,
      dashboardPage: DashboardPage,
      profilePage: ProfilePage
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.ionEvents.subscribe(EVENTS.loggedIn, (user) => {
        this.profile = user;
        console.log(user);
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.profile = this.authProvider.getStoredUser();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  profilePicture(): string {
    return this.dataProvider.getProfilePicture(this.profile);
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }

  logout() {
    this.authProvider.logout().then(() => {
      this.nav.setRoot(MultiLoginPage);
    });
  }


}
