import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-test-ui',
  templateUrl: 'test-ui.html',
})
export class TestUiPage {
  skills: any[] = [];
  profile: User;
  myRating: any;
  jobs: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.myRating = 4.3
    this.profile = {
      uid: 'adasdasd',
      email: 'test@test.com',
      firstname: 'Rick',
      lastname: 'Ross',
      dob: '1991/01/01',
      gender: 'male',
      race: 'Black',
      phone: '082 129 2333',
      location: {
        address: '123 somewher place nice',
        geo: {
          lat: 19.777,
          lng: -28.892
        }
      },
      dateCreated: '2019/06/10 16:55:22',
      settings: {
        hide_dob: false,
        hide_email: false,
        hide_phone: false,
      }
    }
    this.skills = ['plumbing', 'cutting', 'welding', 'painting']

    this.jobs = [
      {
        category: 'Electricity',
        name: 'Heavy Current',
        experience: '2-4 years'
      },
      {
        category: 'Painting',
        name: 'Painting',
        experience: '1-2 years'
      },
    ];
  }

  profilePicture() {
    return 'assets/imgs/users/male.svg'
  }

}
