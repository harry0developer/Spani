import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ERRORS, COLLECTION } from '../../utils/const';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {
  type: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.type = this.navParams.get('type');
    if (this.type === ERRORS.connection) {
      console.log('connection error');
    }
  }

  retry() {
    this.dataProvider.getAllFromCollection(COLLECTION.users).subscribe(users => {
      console.log(users);
    })
  }

}
