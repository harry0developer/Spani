import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE, EVENTS } from '../../utils/const';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { JobsPage } from '../jobs/jobs';
import { DashboardPage } from '../dashboard/dashboard';
import { DataProvider } from '../../providers/data/data';
import { USER_NOT_FOUND, INVALID_PASSWORD } from '../../config';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Job } from '../../models/job';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  data = {
    email: '',
    password: ''
  }
  type = 'password';
  showPass = false;

  user: any;

  constructor(
    private navCtrl: NavController,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private ionEvents: Events
  ) { }

  ionViewDidLoad() {
    if (this.authProvider.isLoggedIn()) {
      this.navigate(this.authProvider.getStoredUser());
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
    this.navCtrl.setRoot(SignupPage);
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
