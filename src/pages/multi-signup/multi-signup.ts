import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { USER_TYPE, COLLECTION, EVENTS } from '../../utils/const';
import { DashboardPage } from '../dashboard/dashboard';
import { JobsPage } from '../jobs/jobs';
import { EMAIL_EXISTS } from '../../config';
import { MultiLoginPage } from '../multi-login/multi-login';
import { LoginPage } from '../login/login';
import { SetupPage } from '../setup/setup';
import { WindowProvider } from '../../providers/window/window';
import * as firebase from 'firebase';

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
    type: '',
    firstname: '',
    lastname: '',
    gender: '',
    race: '',
    nationality: '',
    phonenumber: '',
    location: null,
    dob: '',
    date: '',
    settings: null,
    skills: null
  };
  otp: string;


  type = 'password';
  showPass = false;


  windowRef: any;
  phoneNumber: any;
  verificationCode: string;
  user: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public ionEvents: Events,
    public win: WindowProvider,
  ) { }

  ionViewDidLoad() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('my-recaptcha-container', {
      'size': 'invisible'
    })

    this.windowRef.recaptchaVerifier.render().then(widgetId => {
      this.windowRef.recaptchaWidgetId = widgetId;
    }).catch(err => {
      console.log(err);
    });
  }

  signupWithPhoneNumber() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = "+27" + this.data.phonenumber;
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithPhoneNumber(num, appVerifier).then(result => {
      this.feedbackProvider.dismissLoading();
      this.windowRef.confirmationResult = result;
      console.log('sms sent', result);
      this.showOTPPage = true;
    }).catch(error => {
      console.log('error sending sms');
      this.feedbackProvider.dismissLoading();
      console.log(error)
    });

  }

  verifyLoginCode() {
    this.feedbackProvider.presentLoading();
    this.windowRef.confirmationResult.confirm(this.otp).then(result => {
      this.feedbackProvider.dismissLoading();
      this.data.uid = result.user.uid;
      this.feedbackProvider.presentModal(SetupPage, { data: this.data });
    }).catch(error => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('OTP code error', 'The OTP code entered does not match the one sent to you by sms');
      console.log(error, "Incorrect code entered?");
    });
  }

  getDatabaseUserAndNavigate(user: firebase.User) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getItemById(COLLECTION.users, user.uid).subscribe(u => {
      this.feedbackProvider.dismissLoading();
      console.log(u);

      this.navigate(u);
    });
  }

  signupWithEmailAndPassword() {
    const data: User = {
      ...this.data,
      uid: null,
      settings: { hide_dob: false, hide_phone: false, hide_email: false },
      date: this.dataProvider.getDateTime(),
      skills: null
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
    this.ionEvents.publish(EVENTS.loggedIn, user);
    this.authProvider.storeUser(user);
    if (user.type.toLowerCase() === USER_TYPE.candidate) {
      this.navCtrl.setRoot(JobsPage)
    } else if (user.type.toLowerCase() === USER_TYPE.recruiter) {
      this.navCtrl.setRoot(DashboardPage)
    }
  }

  backToLogin() {
    this.navCtrl.setRoot(MultiLoginPage);
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
