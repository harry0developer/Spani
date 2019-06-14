import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { UserDetailsPage } from '../user-details/user-details';
import { COLLECTION } from '../../utils/const';
import { Rating } from '../../models/rating';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { bounceIn } from '../../utils/animations';

@IonicPage()
@Component({
  selector: 'page-raters',
  templateUrl: 'raters.html',
  animations: [bounceIn]
})
export class RatersPage {
  usersIRated: User[] = [];
  usersRatedMe: User[] = [];
  users: User[] = [];
  profile: User;
  ratings: string = 'ratedMe';

  RATED: 'rated';
  RATER: 'rater';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public viewCtrl: ViewController,
    public feedbackProvider: FeedbackProvider,
  ) {
  }

  ionViewDidLoad() {
    this.feedbackProvider.presentLoading();
    this.profile = this.authProvider.getStoredUser();
    this.users = this.navParams.get('users');
    this.dataProvider.getAllFromCollection(COLLECTION.users).subscribe(users => {
      this.feedbackProvider.dismissLoading();
      this.users = users;
      this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'uid', this.profile.uid).subscribe(ratedMe => {
        this.usersRatedMe = this.mapUsersRatedMe(users, ratedMe);
      });
      this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'rid', this.profile.uid).subscribe(iRated => {
        this.usersIRated = this.mapUsersIRated(users, iRated);
      });
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  getUserDetails(user) {
    this.navCtrl.push(UserDetailsPage, { user, page: 'Ratings' })
  }

  getDateRated(date): string {
    return this.dataProvider.getDateTimeMoment(date);
  }

  profilePicture(profile): string {
    return this.dataProvider.getProfilePicture(profile);
  }

  mapUsersRatedMe(users: User[], raters: Rating[]): User[] {
    let mappedRaters = [];
    users.map(user => {
      raters.map(rater => {
        if (user.uid === rater.rid) {
          mappedRaters.push(user);
        }
      });
    })
    return mappedRaters;
  }


  mapUsersIRated(users: User[], raters: Rating[]): User[] {
    let mappedRaters = [];
    users.map(user => {
      raters.map(rater => {
        if (user.uid === rater.uid) {
          mappedRaters.push(user);
        }
      });
    })
    return mappedRaters;
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
