import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { COLLECTION } from '../../utils/const';
import { Job } from '../../models/job';
import { JobDetailsPage } from '../job-details/job-details';

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
  animations: [bounceIn]
})
export class JobsPage {

  profile: User;
  jobs: Job[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
  ) {
    // this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.feedbackProvider.presentLoading();
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
      const loc = {
        lat: -26.121747,
        lng: 28.173450
      }

      this.jobs = this.dataProvider.applyHaversine(jobs, loc.lat, loc.lng);
      this.feedbackProvider.dismissLoading();
    });
  }

  getDateFromNow(date: string) {
    return this.dataProvider.getDateTimeMoment(date);
  }



  setFilteredJobs() {
    // this.location = this.dataProvider.getLocation();
    // this.jobs = this.dataProvider.filterJobs(this.searchTerm);

    // if (this.location && this.location.lat && this.location.lng) {
    //   this.jobs = this.dataProvider.applyHaversine(this.jobs, this.location.lat, this.location.lng);
    // }
    // this.tempJobs = this.jobs;
  }

  getDateTime(date) {
    // return this.dateProvider.getDateFromNow(date);
  }

  viewJobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, page: 'jobs' });
  }

  doRefresh(refresher) {
    // this.dataProvider.initializeData();
    // this.tempJobs = this.jobs;
    // refresher.complete();
  }

  filterJobs() {
    // let modal = this.modalCtrl.create(FilterPage);

    // modal.onDidDismiss(filter => {
    //   const jobz = this.dataProvider.getJobs();
    //   this.dataProvider.sortByDistance(jobz);
    //   if (filter && filter !== 'all') {
    //     const j = jobz.filter(job => job.category.toLowerCase() === filter.toLowerCase());
    //     this.jobs = this.dataProvider.sortByDistance(j);
    //   } else {
    //     this.jobs = this.dataProvider.sortByDistance(jobz);
    //   }
    // });
    // modal.present();
  }

}
