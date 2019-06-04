import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE, EVENTS } from '../../utils/const';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { JobsPage } from '../jobs/jobs';
import { DashboardPage } from '../dashboard/dashboard';
import { DataProvider } from '../../providers/data/data';
import { USER_NOT_FOUND, INVALID_PASSWORD } from '../../config';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Job } from '../../models/job';
import * as firebase from 'firebase';
import { WindowProvider } from '../../providers/window/window';
import { MultiSignupPage } from '../multi-signup/multi-signup';

@Component({
  selector: 'page-multi-login',
  templateUrl: 'multi-login.html',
})
export class MultiLoginPage {

  loginType: string = 'phoneNumber';
  data = {
    email: '',
    password: '',
    otpCode: '',
    phonenumber: ''
  }
  type = 'password';
  showPass = false;
  showOTPPage = false;
  verificationId: string = '';

  // user: any;
  applicationVerifier: any;


  windowRef: any;
  verificationCode: string;
  user: any;
  constructor(
    private navCtrl: NavController,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private ionEvents: Events,
    private win: WindowProvider
  ) { }

  ionViewDidLoad() {
    // if (this.authProvider.isLoggedIn()) {
    //   this.navigate(this.authProvider.getStoredUser());
    // }
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

  signinWithPhonenumber() {
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
    this.windowRef.confirmationResult.confirm(this.data.otpCode).then(result => {
      this.feedbackProvider.dismissLoading();
      this.getDatabaseUserAndNavigate(result.user);
    }).catch(error => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('OTP code error', 'The OTP code entered does not match the one sent to you by sms');
      console.log(error, "Incorrect code entered?");
    });
  }

  signinWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.feedbackProvider.dismissLoading();
      this
      // this.addUserToDatabase(res.user);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithFacebook() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithFacebook().then((res) => {
      this.feedbackProvider.dismissLoading();
      this.getDatabaseUserAndNavigate(res.user);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithTwitter() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithFacebook().then((res) => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.feedbackProvider.dismissLoading();
        this.navigate(u);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
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

  navigate(user) {
    this.ionEvents.publish(EVENTS.loggedIn, user);
    this.authProvider.storeUser(user);
    if (user.type.toLowerCase() === USER_TYPE.candidate) {
      this.navCtrl.setRoot(JobsPage)
    } else if (user.type.toLowerCase() === USER_TYPE.recruiter) {
      this.navCtrl.setRoot(DashboardPage)
    }
  }

  cancelOtpVerification() {
    this.showOTPPage = false;
  }

  addJobs() {
    const job: Job = {
      jid: this.dataProvider.generateId(15),
      uid: 'LvdXgZjVXhbps8iUiD9GqOZVuP72',
      title: 'Helper wanted',
      description: 'We need a helper with our house chores and baby sitting, we have a place for your to stay.',
      date: '2019/05/03 10:09:18',
      skills: ['nanny', 'baby care', 'cleaning', 'washing', 'cooking'],
      category: 'Security',
      location: {
        address: '102 Zola, Soweto Johannesburg',
        geo: {
          lat: '-19.10001',
          lng: '29.669'
        }
      }
    }

    this.dataProvider.addNewItemWithId(COLLECTION.jobs, job, job.jid).then(() => {
      console.log('success');
    }).catch((err) => {
      console.log(err);
    });
  }

  goToSignup() {
    this.navCtrl.setRoot(MultiSignupPage);
  }

  goToForgotPassword() {
    this.navCtrl.setRoot(ForgotPasswordPage);
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


// sendOtpCode() {
//   this.feedbackProvider.presentLoading();
//   this.firebaseRecaptchaVerifier();
//   const provider = new firebase.auth.PhoneAuthProvider();
//   provider.verifyPhoneNumber('+27829390061', this.applicationVerifier).then(verificationId => {
//     this.feedbackProvider.dismissLoading();
//     console.log(verificationId);
//     this.showOTPPage = true;
//     this.data.otpCode = this.data.otpCode.trim();
//     console.log(this.data);

//     //var verificationCode = window.prompt('Please enter the verification ' + 'code that was sent to your mobile device.');
//     // return firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
//   }).then(function (phoneCredential) {
//     this.feedbackProvider.dismissLoading();
//     console.log(phoneCredential);
//   }).catch(err => {
//     this.feedbackProvider.dismissLoading();
//     console.log(err);
//   });
// }