import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Appointment } from '../../models/appointment';
import { DataProvider } from '../../providers/data/data';
import { UserDetailsPage } from '../user-details/user-details';

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
  inProgressAppointments: User[];
  completedAppointments: User[];


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private viewCtrl: ViewController,
  ) { }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
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
    this.navCtrl.push(UserDetailsPage, { user });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
