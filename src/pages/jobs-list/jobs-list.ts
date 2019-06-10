import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
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
  tag: '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    this.tag = this.navParams.get('tag');
    const jobsToBeMapped = this.navParams.get('jobs');
    const allJobs = this.navParams.get('allJobs');
    const loc = {
      lat: -26.121747,
      lng: 28.173450
    }
    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {

      let jobsToBeMapedWithUser = [];
      jobsToBeMapped.map(j => {
        jobsToBeMapedWithUser.push(Object.assign(j, { users: this.dataProvider.countJobOccurrence(allJobs, j.jid) }));
      });
      const mappedJobs = this.dataProvider.mapJobs(jobs, jobsToBeMapedWithUser);
      this.jobs = this.dataProvider.applyHaversine(mappedJobs, loc.lat, loc.lng);
    });
  }

  getDateFromNow(job): string {
    if (job && job.users && job.users.length > 0) {
      const sortedUsers = this.sortArrayByDate(job.users);
      return this.dataProvider.getDateTimeMoment(sortedUsers[0].date);
    }
    return this.dataProvider.getDateTimeMoment(job.date);
  }

  sortArrayByDate(array: any[]): any[] {
    return array.sort((a, b) => {
      return a.date - b.date;
    });
  }

  viewJobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, page: 'jobs' });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }


}
