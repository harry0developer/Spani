import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, EVENTS, STATUS, USER_TYPE, } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { ViewedJob, Job, AppliedJob, SharedJob } from '../../models/job';
import { AppointmentsPage } from '../appointments/appointments';
import { MyJobsPage } from '../my-jobs/my-jobs';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  profile: User;
  viewedJobs: ViewedJob[] = [];
  appliedJobs: AppliedJob[] = [];
  sharedJobs: SharedJob[] = [];

  postedJobs: Job[] = [];
  appointments: Appointment[] = [];
  appointment: Appointment;
  appointmentsInProgress: Appointment[] = [];
  userRating: string;

  user: User;
  hired: boolean = false;
  skills: any[] = [];

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private actionSheetCtrl: ActionSheetController,
    private ionEvent: Events,
  ) { }


  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    console.log(this.user);

    this.profile = this.authProvider.getStoredUser();
    if (this.authProvider.isRecruiter(this.user)) {
      this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'rid', this.user.uid).subscribe(raters => {
        this.userRating = this.dataProvider.getUserRating(raters);
      });
    } else {
      this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'uid', this.user.uid).subscribe(raters => {
        this.userRating = this.dataProvider.getUserRating(raters);
      });
    }
    console.log(this.user);
  }

  isUserInAppointment() {
    this.appointments.forEach(app => {
      if (app.uid === this.user.uid) {
        this.appointment = app;
        if (app.status === STATUS.inProgress) {
          this.hired = true;
        }
      }
    });
  }

  isRecruiter(user): boolean {
    return this.authProvider.isRecruiter(user);
  }

  profilePicture(user): string {
    return `assets/imgs/users/${user.gender}.svg`;
  }

  hasAppointments() {
    return false;
  }

  updateAppointment(appointment) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.updateItem(COLLECTION.appointments, appointment, appointment.id).then(() => {
      this.hired = false;
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Appointment completed successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
    });
  }

  makeAppointment() {
    this.appointment.status = STATUS.complete;
    this.appointment.dateCompleted = this.dataProvider.getDateTime();
    this.updateAppointment(this.appointment);
  }

  createAppointment() {
    if (this.appointment && this.appointment.id) {
      this.appointment.status = STATUS.inProgress;
      this.appointment.dateCreated = this.dataProvider.getDateTime();
      this.appointment.dateCompleted = '';
      this.updateAppointment(this.appointment);
    } else {
      this.feedbackProvider.presentLoading();
      this.appointment = {
        uid: this.user.id,
        rid: this.profile.uid,
        status: STATUS.inProgress,
        dateCreated: this.dataProvider.getDateTime(),
        dateCompleted: ''
      }

      this.dataProvider.addNewItem(COLLECTION.appointments, this.appointment).then(() => {
        this.hired = true;
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast('Appointment made successfully');
      }).catch(err => {
        console.log(err);
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
      });
    }
  }


  completeAppointmentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to complete the appointment',
      buttons: [
        {
          text: 'Complete appointment',
          role: 'destructive',
          handler: () => {
            this.makeAppointment();
          }
        },
        {
          text: "Don't complete",
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }


}
