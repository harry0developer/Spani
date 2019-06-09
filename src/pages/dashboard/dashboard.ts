import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AppointmentsPage } from '../appointments/appointments';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Job, AppliedJob, SharedJob, ViewedJob } from '../../models/job';
import { COLLECTION } from '../../utils/const';
import { Rating } from 'ngx-rating';
import { Appointment } from '../../models/appointment';
import { Message } from '../../models/message';
import { ProfilePage } from '../profile/profile';
import { JobsListPage } from '../jobs-list/jobs-list';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: User = null;

  postedJobs: Job[] = [];
  appliedJobs: AppliedJob[] = [];
  sharedJobs: SharedJob[] = [];
  viewedJobs: ViewedJob[] = [];

  dubplicateAppliedJobs: AppliedJob[] = [];
  dubplicateSharedJobs: SharedJob[] = [];
  dubplicateViewedJobs: ViewedJob[] = [];


  ratings: Rating[] = [];
  appointments: Appointment[] = [];
  chats: Message[] = [];

  jobs: Job[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider
  ) { }


  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    console.log(this.profile);

    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
      this.jobs = jobs;
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.jobs, 'uid', this.profile.uid).subscribe(jobs => {
      this.postedJobs = jobs;
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appliedJobs, 'rid', this.profile.uid).subscribe(jobs => {
      this.appliedJobs = jobs;
      // console.log(jobs);
    });

    this.dataProvider.getAllFromCollection(COLLECTION.viewedJobs).subscribe(jobs => {
      this.dubplicateViewedJobs = this.getMyViewedJobs(jobs);
      this.viewedJobs = this.dataProvider.removeDuplicates(this.dubplicateViewedJobs, 'jid');
      // console.log(this.dubplicateViewedJobs);

      // const jobsWithViewers = [];
      // this.viewedJobs.map(j => {
      //   jobsWithViewers.push(Object.assign(j, { viewers: this.dataProvider.countJobOccurrence(this.viewedJobs, j.jid) }));
      // });
      // console.log(jobsWithViewers);

    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.sharedJobs, 'rid', this.profile.uid).subscribe(jobs => {
      this.sharedJobs = jobs;
      // console.log(jobs);
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'rid', this.profile.uid).subscribe(ratings => {
      this.ratings = ratings;
      // console.log(ratings);
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appointments, 'rid', this.profile.uid).subscribe(appointments => {
      this.appointments = appointments;
      // console.log(appointments);
    });

    this.dataProvider.getAllFromCollection(COLLECTION.messages).subscribe(chats => {

      // console.log(chats);
    });

    this.dataProvider.getMyChats(COLLECTION.messages, this.profile.uid).subscribe(chats => {

      // console.log(chats);
    });

  }

  getMyViewedJobs(jobs) {
    let myJobs = [];
    jobs.map(job => {
      const j = this.dataProvider.getArrayFromObjectList(job);
      for (let i = 1; i < j.length; i++) {
        if (j[i].rid === this.profile.uid) {
          myJobs.push(j[i]);
        }
      }
    });
    return myJobs;
  }


  profilePicture(): string {
    return this.dataProvider.getProfilePicture(this.profile);
  }

  getJobsSummary() {
    // return this.viewedJobs.length + this.appliedJobs.length + this.sharedJobs.length || 0;
  }

  getRaters() {
    // return this.ratings && this.ratings.iRated && this.ratings.ratedMe ? this.ratings.ratedMe.length + this.ratings.iRated.length : 0;
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }


  add() {
    const job = {
      jid: 'IBJbPY3Uxq8ZHiI1559071115675',
      uid: 'qpsLMVTKL7ftvJQkJ10qLlCyQDl2',//'bxvezgEa2OcitrM8r5zjshNpnkb2', 
      rid: 'yuoVVtSUNHSo5hgJqCe1Ufz99JT2',
      date: this.dataProvider.getDateTime()
    };
    this.dataProvider.addUserActionToJobCollection(COLLECTION.viewedJobs, job)
  }

  viewPostedJobs() {
    this.navCtrl.push(JobsListPage, { jobs: this.postedJobs });
  }

  viewAppliedJobs() {
    const mappedJobs = this.dataProvider.mapJobs(this.jobs, this.appliedJobs);
    this.navCtrl.push(JobsListPage, { jobs: mappedJobs });
  }

  viewSharedJobs() {
    const mappedJobs = this.dataProvider.mapJobs(this.jobs, this.sharedJobs);
    this.navCtrl.push(JobsListPage, { jobs: mappedJobs });
  }

  viewViewedJobs() {
    // const mappedJobs = this.dataProvider.mapJobs(this.jobs, this.viewedJobs);
    this.navCtrl.push(JobsListPage, { jobs: this.viewedJobs, allJobs: this.dubplicateViewedJobs, tag: 'viewers' });
  }

  viewRaters() {
  }

  viewAppointments() {
    this.feedbackProvider.presentModal(AppointmentsPage);
  }

  getItemById(jid): any {
    this.jobs.find(j => {
      return j.jid === jid;
    });
  }

  viewProfile() {
    this.navCtrl.push(ProfilePage);
  }
  editProfile() {
    // let modal = this.modalCtrl.create(SettingsPage);
    // modal.onDidDismiss(data => {
    //   if (data) {
    //     this.updateSettings();
    //   }
    // });
    // modal.present();
  }

  updateSettings() {
    // this.feedbackProvider.presentLoading();
    // this.dataProvider.updateItem(COLLECTION.users, this.profile, this.profile.id).then(() => {
    //   this.feedbackProvider.dismissLoading();
    //   this.feedbackProvider.presentToast('Settings updated successfully');
    // }).catch(err => {
    //   console.log(err);
    //   this.feedbackProvider.dismissLoading();
    // });
  }
}
