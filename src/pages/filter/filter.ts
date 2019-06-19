import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { CategoryPage } from '../category/category';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY, MAX_DISTANCE } from '../../utils/const';
import { Filter } from '../../models/filter';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  filter: Filter = {
    category: 'All',
    distance: MAX_DISTANCE
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.filter = this.navParams.get(STORAGE_KEY.filter);
  }

  getMaxDistance(): number {
    return MAX_DISTANCE;
  }

  getCategories() {
    let modal = this.modalCtrl.create(CategoryPage, { filter: this.filter });
    modal.onDidDismiss(category => {
      if (category) {
        this.filter.category = category;
      }
    });
    modal.present();
  }

  dismissModal() {
    this.viewCtrl.dismiss(this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.filter));
  }

  applyFilter() {
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.filter, this.filter);
    this.viewCtrl.dismiss(this.filter);
  }

  clearFilter() {
    this.filter.category = 'All';
    this.filter.distance = MAX_DISTANCE;
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.filter, this.filter);
    this.viewCtrl.dismiss(this.filter);
  }
}
