import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Appointment } from '../../models/appointment';
import { DataProvider } from '../../providers/data/data';
import { UserDetailsPage } from '../user-details/user-details';
import { Job } from '../../models/job';
import { STATUS, COLLECTION } from '../../utils/const';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
  animations: [bounceIn]
})
export class AppointmentsPage {
  appointment_type: string = 'inProgress';
  profile: any;
  appointments: Appointment[] = []
  inProgressAppointments: User[] = [];
  completedAppointments: User[] = [];
  users: User[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private viewCtrl: ViewController,
  ) { }

  ionViewDidLoad() {
    this.feedbackProvider.presentLoading();
    this.profile = this.authProvider.getStoredUser();
    this.appointments = this.navParams.get('appointments');
    this.dataProvider.getAllFromCollection(COLLECTION.users).subscribe(users => {
      this.feedbackProvider.dismissLoading();
      this.users = users;
      this.appointments.map(app => {
        this.users.map(u => {
          if (app.uid === u.uid) {
            if (app.status === STATUS.inProgress) {
              this.inProgressAppointments.push(Object.assign(u, { appointment: app }))
            } else {
              this.completedAppointments.push(Object.assign(u, { appointment: app }));
            }
          }
        });
      });
      console.log(this.completedAppointments);

    }, err => {
      this.feedbackProvider.dismissLoading();
    });


  }

  profilePicture(user): string {
    return `assets/imgs/users/${user.gender}.svg`;
  }

  getDateScheduled(date: string) {
    return this.dataProvider.getDateTimeMoment(date);
  }

  getDateCompleted(date: string) {
    return this.dataProvider.getDateTimeMoment(date);
  }

  viewUserDetails(user: User) {
    console.log(user);

    this.navCtrl.push(UserDetailsPage, { user });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
