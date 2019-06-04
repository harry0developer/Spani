import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AppointmentsPage } from '../appointments/appointments';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: User = null;


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
    // this.feedbackProvider.presentModal(MyJobsPage);
  }

  viewViewedJobs() {
    // this.feedbackProvider.presentModal(ViewedJobsPage);
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
