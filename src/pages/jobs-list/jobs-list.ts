import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { Job } from '../../models/job';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { COLLECTION } from '../../utils/const';
import { bounceIn } from '../../utils/animations';
import { PostJobPage } from '../post-job/post-job';
import { ServiceDetailsPage } from '../service-details/service-details';

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
    this.mappJobsWithUsers(jobsToBeMapped, allJobs);
  }


  mappJobsWithUsers(jobsToBeMapped: any[], allJobs: any[]) {
    this.feedbackProvider.presentLoading();
    let usersArray: any[] = [];
    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
      jobsToBeMapped.map(mj => {
        jobs.map(job => {
          if (mj.jid === job.jid) {
            usersArray = this.dataProvider.getArrayFromObjectList(this.getUserFromJobs(job, allJobs)[0]);
            usersArray.shift(); // remove key eg. list = ["adadsasd", {}, {}, {}]
            this.jobs.push(Object.assign(job, { users: usersArray }));
          }
        })
      });
      this.feedbackProvider.dismissLoading();
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  getUserFromJobs(job: any, allJobs: any[]) {
    return allJobs.filter(j => j.id === job.jid);
  }

  getDateFromNow(job): string {
    if (job && job.users && job.users.length > 0) {
      const sortedUsers = this.sortArrayByDate(job.users);
      return this.dataProvider.getDateTimeMoment(sortedUsers[0].date);
    }
    return this.dataProvider.getDateTimeMoment(job.date);
  }


  openPostJobPage() {
    this.navCtrl.push(PostJobPage)

  }

  sortArrayByDate(array: any[]): any[] {
    return array.sort((a, b) => {
      return a.date - b.date;
    });
  }

  viewJobDetails(job) {
    this.navCtrl.push(ServiceDetailsPage, { job: job, page: 'jobs' });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }


}
