import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Filter } from '../../models/filter';
import { FILTER } from '../../utils/const';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  categories: any = [];
  filter: Filter = {
    category: FILTER.category,
    distance: FILTER.max_distance
  };
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public feedbackProvider: FeedbackProvider,
    public viewCtrl: ViewController,
  ) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.getCategories();
    this.setFilteredItems('');
    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }

  getCategories() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getCategories().subscribe(res => {
      this.categories = res;
      this.feedbackProvider.dismissLoading();
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems(searchTerm) {
    this.filter.category = this.filterItems(searchTerm);
  }

  filterItems(searchTerm) {
    return this.categories.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  selectCategory(category) {
    this.viewCtrl.dismiss(category.name);
  }


  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
