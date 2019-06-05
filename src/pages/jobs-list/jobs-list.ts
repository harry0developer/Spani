import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Job } from '../../models/job';
import { JobDetailsPage } from '../job-details/job-details';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { COLLECTION } from '../../utils/const';
import { bounceIn } from '../../utils/animations';

@IonicPage()
@Component({
  selector: 'page-jobs-list',
  templateUrl: 'jobs-list.html',
  animations: [bounceIn]
})
export class JobsListPage {

  profile: User;
  jobs: Job[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
  ) { }

  ionViewDidLoad() {
    const jobs = this.navParams.get('jobs');
    const loc = {
      lat: -26.121747,
      lng: 28.173450
    }
    this.jobs = this.dataProvider.applyHaversine(jobs, loc.lat, loc.lng);
  }

  getDateFromNow(date: string) {
    return this.dataProvider.getDateTimeMoment(date);
  }

  viewJobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, page: 'jobs' });
  }


}
