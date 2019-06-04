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
  ratings: Rating[] = [];
  appointments: Appointment[] = [];

  myJobs: Job[] = [];

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

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.jobs, 'uid', this.profile.uid).subscribe(jobs => {
      this.myJobs = jobs;
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appliedJobs, 'rid', this.profile.uid).subscribe(jobs => {
      this.appliedJobs = jobs;
      console.log(jobs);
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.viewedJobs, 'rid', this.profile.uid).subscribe(jobs => {
      this.viewedJobs = jobs;
      console.log(jobs);
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.sharedJobs, 'rid', this.profile.uid).subscribe(jobs => {
      this.sharedJobs = jobs;
      console.log(jobs);
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'rid', this.profile.uid).subscribe(ratings => {
      this.ratings = ratings;
      console.log(ratings);
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appointments, 'rid', this.profile.uid).subscribe(appointments => {
      this.appointments = appointments;
      console.log(appointments);
    });

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

  viewAppointments() {
    this.feedbackProvider.presentModal(AppointmentsPage);
  }

  viewPostedJobs() {
  }

  viewAppliedJobs() {
  }

  viewSharedJobs() {
  }

  viewViewedJobs() {
  }

  viewRaters() {
    // this.feedbackProvider.presentModal(RatingsPage);
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
