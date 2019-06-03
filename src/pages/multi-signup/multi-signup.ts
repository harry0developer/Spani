import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { USER_TYPE } from '../../utils/const';
import { DashboardPage } from '../dashboard/dashboard';
import { JobsPage } from '../jobs/jobs';
import { EMAIL_EXISTS } from '../../config';
import { MultiLoginPage } from '../multi-login/multi-login';
import { LoginPage } from '../login/login';
import { SetupPage } from '../setup/setup';

@IonicPage()
@Component({
  selector: 'page-multi-signup',
  templateUrl: 'multi-signup.html',
})
export class MultiSignupPage {
  signupType: string = 'phoneNumber';
  showOTPPage: boolean = false;
  countries: any = [];

  data: User = {
    uid: '',
    email: '',
    password: '',
    userType: '',
    firstname: '',
    lastname: '',
    gender: '',
    nationality: '',
    phonenumber: '',
    location: null,
    dob: '',
    dateCreated: '',
    settings: null
  }

  type = 'password';
  showPass = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider) { }

  ionViewDidLoad() { }

  signupWithPhoneNumber() {
    this.showOTPPage = true;
  }

  signupWithEmailAndPassword() {
    const data: User = {
      ...this.data,
      uid: null,
      settings: { hide_dob: false, hide_phone: false },
      dateCreated: this.dataProvider.getDateTime()
    }
    this.authProvider.signUpWithEmailAndPassword(data).then(() => {
      console.log('Success');
    }).catch(err => {
      if (err.code === EMAIL_EXISTS) {
        this.feedbackProvider.presentErrorAlert('Signup failed', 'Email already exists, please signin');
      }
      console.log(err);
    });
  }

  navigate(user) {
    if (user.type === USER_TYPE.candidate) {
      this.navCtrl.setRoot(DashboardPage)
    } else if (user.type === USER_TYPE.candidate) {
      this.navCtrl.setRoot(JobsPage)
    }
  }

  backToLogin() {
    this.navCtrl.setRoot(MultiLoginPage);
  }

  verifyLoginCode() {
    this.navCtrl.setRoot(SetupPage, { data: this.data });
  }

  cancelOtpVerification() {
    this.navCtrl.setRoot(LoginPage);
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
