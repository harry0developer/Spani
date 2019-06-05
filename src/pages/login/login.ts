import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE, EVENTS, NETWORK, ERRORS } from '../../utils/const';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { JobsPage } from '../jobs/jobs';
import { DashboardPage } from '../dashboard/dashboard';
import { DataProvider } from '../../providers/data/data';
import { USER_NOT_FOUND, INVALID_PASSWORD } from '../../config';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Job } from '../../models/job';
import * as firebase from 'firebase';
import { MultiSignupPage } from '../multi-signup/multi-signup';
import { ErrorPage } from '../error/error';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'

})
export class LoginPage {
  data = {
    email: '',
    password: '',
    otp: '',
    phoneNumber: ''
  }
  login = {
    phoneNumber: false,
    emailAndPassword: false
  };
  type = 'password';
  showPass = false;
  showOTPPage = false;

  user: any;

  applicationVerifier: any;

  constructor(
    private navCtrl: NavController,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private ionEvents: Events
  ) { }

  ionViewDidLoad() {

    this.ionEvents.subscribe(NETWORK.error, () => {
      this.feedbackProvider.presentModal(ErrorPage, { type: ERRORS.connection })
    })
    const user = this.authProvider.isLoggedIn();
    if (user) {
      console.log('autologin');

      this.navigate(this.authProvider.getStoredUser());
    }
  }

  firebaseRecaptchaVerifier() {
    this.applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved - will proceed with submit function
        console.log('res: ', response);
      },
      'expired-callback': function () {
        console.log('RecaptchaVerifier timedout');
      }
    });
  }

  verifyOtp() {
    this.login = {
      phoneNumber: false,
      emailAndPassword: false
    }
    this.data.otp = this.data.otp.trim();
    console.log(this.data.otp);
  }

  phoneAuth() {
    this.feedbackProvider.presentLoading();
    this.firebaseRecaptchaVerifier();
    console.log(this.applicationVerifier);

    const provider = new firebase.auth.PhoneAuthProvider();
    provider.verifyPhoneNumber('+27829390061', this.applicationVerifier).then(verificationId => {
      this.feedbackProvider.dismissLoading();
      console.log(verificationId);
      this.showOTPPage = true;
      this.data.otp = this.data.otp.trim();
      console.log(this.data);

      //var verificationCode = window.prompt('Please enter the verification ' + 'code that was sent to your mobile device.');
      // return firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    }).then(function (phoneCredential) {
      this.feedbackProvider.dismissLoading();
      console.log(phoneCredential);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      console.log(err);
    });
  }

  loginWithPhonenumber() {
    this.phoneAuth();
  }


  loginWithPhoneNumber() {
    this.login = {
      phoneNumber: true,
      emailAndPassword: false
    }
  }

  loginWithEmailAndPassword() {
    this.login = {
      phoneNumber: false,
      emailAndPassword: true
    }
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

    console.log(job);

    this.dataProvider.addNewItemWithId(COLLECTION.jobs, job, job.jid).then(() => {
      console.log('success');
    }).catch((err) => {
      console.log(err);

    })

  }
  navigate(user) {
    this.ionEvents.publish(EVENTS.loggedIn, user);
    this.authProvider.storeUser(user);
    if (user.type === USER_TYPE.candidate) {
      this.navCtrl.setRoot(JobsPage)
    } else if (user.type === USER_TYPE.recruiter) {
      this.navCtrl.setRoot(DashboardPage)
    }
  }

  signinWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
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

  signInWithFacebook() {
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
