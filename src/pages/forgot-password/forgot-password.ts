import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { MultiLoginPage } from '../multi-login/multi-login';
import { Country } from '../../models/country';
import { User } from '../../models/user';
import { COLLECTION } from '../../utils/const';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  data = {
    email: ''
  }

  users: User;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider
  ) {
  }

  ionViewDidLoad() {

  }

  confirmEmailAndSentOtp() {
    console.log('confirmEmailAndSentOtp');
  }

  resetPassword() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.users, 'email', this.data.email).subscribe(user => {
      this.feedbackProvider.dismissLoading();
      this.sendOTPViaEmail();
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  sendOTPViaEmail() {
    console.log('send email address');
  }

  goToLogin() {
    this.navCtrl.setRoot(MultiLoginPage);
  }
}
