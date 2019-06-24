import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, STATUS, USER_TYPE, } from '../../utils/const';
import { Appointment } from '../../models/appointment';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  profile: User;
  appointment: Appointment;
  appointmentsInProgress: Appointment[] = [];
  userRating: string;

  user: User;
  hired: boolean = false;
  skills: any[] = [];

  userKey: string = '';
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private actionSheetCtrl: ActionSheetController,
  ) { }


  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.profile = this.authProvider.getStoredUser();

    this.userKey = this.dataProvider.getKey(this.user);

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appointments, this.userKey, this.user.uid).subscribe(appointments => {
      this.getMyAppointment(appointments);
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, this.userKey, this.user.uid).subscribe(raters => {
      this.userRating = this.dataProvider.getUserRating(raters);
    });

  }

  getMyAppointment(appointments: Appointment[]): Appointment[] {
    let appontmentz: Appointment[] = [];
    appointments.map(a => {
      if (a.rid === this.profile.uid) {
        this.appointment = a;
      }
    });

    return appontmentz;
  }

  isUserInAppointment(): boolean {
    return this.appointment && this.appointment.status === STATUS.inProgress;
  }

  profilePicture(user): string {
    return `assets/imgs/users/${user.gender}.svg`;
  }

  completeAppointment() {
    this.feedbackProvider.presentLoading();
    this.appointment.status = STATUS.complete;
    this.appointment.dateCompleted = this.dataProvider.getDateTime();
    this.dataProvider.updateItem(COLLECTION.appointments, this.appointment, this.appointment.id).then(() => {
      this.hired = false;
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Appointment completed successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
    });
  }

  createAppointment() {
    this.feedbackProvider.presentLoading();
    console.log(this.appointment);

    if (!this.appointment) {
      const appointment = {
        uid: this.user.id,
        rid: this.profile.uid,
        status: STATUS.inProgress,
        dateCreated: this.dataProvider.getDateTime(),
        dateCompleted: ''
      }
      this.feedbackProvider.dismissLoading();
      this.createNewAppointment(appointment);
    } else {

      this.appointment.dateCompleted = '';
      this.appointment.dateCreated = this.dataProvider.getDateTime();
      this.appointment.status = STATUS.inProgress;
      console.log(this.appointment);
      this.feedbackProvider.dismissLoading();
      this.dataProvider.updateItem(COLLECTION.appointments, this.appointment, this.appointment.id);
    }
  }

  createNewAppointment(appointment: Appointment) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.addNewItem(COLLECTION.appointments, appointment).then(() => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Appointment made successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
    });
  }

  completeAppointmentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to complete the appointment',
      buttons: [
        {
          text: 'Complete appointment',
          role: 'destructive',
          handler: () => {
            this.completeAppointment();
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
