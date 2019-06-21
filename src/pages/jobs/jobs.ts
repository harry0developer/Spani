import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { COLLECTION, STORAGE_KEY, FILTER } from '../../utils/const';
import { Job } from '../../models/job';
import { JobDetailsPage } from '../job-details/job-details';
import { FilterPage } from '../filter/filter';
import { Filter } from '../../models/filter';

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
  animations: [bounceIn]
})
export class JobsPage {

  profile: User;
  jobs: Job[] = [];
  tmpJobs: Job[] = [];

  filter: Filter = {
    category: FILTER.category,
    distance: FILTER.max_distance
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
  ) {
    // this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    const filter = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.filter);
    this.filter.category = filter && filter.category ? filter.category : FILTER.category;
    this.filter.distance = filter && filter.distance > 0 ? filter.distance : FILTER.max_distance;
    this.profile = this.authProvider.getStoredUser();
    this.feedbackProvider.presentLoading();
    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
      const loc = {
        lat: -26.121747,
        lng: 28.173450
      }
      this.jobs = this.dataProvider.applyHaversine(jobs, loc.lat, loc.lng);
      console.log(this.jobs);

      this.tmpJobs = this.jobs;
      this.applyJobFilter(this.filter);
      this.feedbackProvider.dismissLoading();
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  getMaxDistance(): number {
    return FILTER.max_distance;
  }

  getDateFromNow(date: string) {
    return this.dataProvider.getDateTimeMoment(date);
  }

  viewJobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, page: 'jobs' });
  }

  filterJobs() {
    let modal = this.modalCtrl.create(FilterPage, { filter: this.filter });
    modal.onDidDismiss(filter => {
      if (filter) {
        this.filter = filter;
        this.applyJobFilter(filter);
      }
    });
    modal.present();
  }

  applyJobFilter(filter: Filter) {
    this.jobs = this.tmpJobs;
    console.log(filter);


    if (filter.distance && filter.distance > 0) {
      this.jobs = this.jobs.filter(j => parseInt(j.distance) <= filter.distance);
    }
    if (filter.category && filter.category && filter.category !== FILTER.category) {
      this.jobs = this.jobs.filter(j => j.category.toLocaleLowerCase() === filter.category.toLocaleLowerCase());
    }

    if (filter.distance === FILTER.max_distance && filter.category.toLocaleLowerCase() === FILTER.category) { //reset filter
      this.jobs = this.tmpJobs;
    }
  }

  doRefresh(refresher) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
      const loc = {
        lat: -26.121747,
        lng: 28.173450
      }
      this.jobs = this.dataProvider.applyHaversine(jobs, loc.lat, loc.lng);
      this.tmpJobs = this.jobs;
      this.applyJobFilter(this.filter);
      this.feedbackProvider.dismissLoading();
      refresher.complete();
    }, err => {
      this.feedbackProvider.dismissLoading();
      refresher.complete();
    });
  }

}
