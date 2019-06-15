import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-nationality',
  templateUrl: 'nationality.html',
})
export class NationalityPage {
  countries: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.getCountries();
  }


  getCountries() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getCountries().subscribe(res => {
      this.countries = res;
      this.feedbackProvider.dismissLoading();
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  selectCountry(country) {
    this.viewCtrl.dismiss(country);

  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}
