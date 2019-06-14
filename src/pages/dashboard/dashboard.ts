import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AppointmentsPage } from '../appointments/appointments';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Job, AppliedJob, SharedJob, ViewedJob } from '../../models/job';
import { COLLECTION, STATUS, JOBS_TYPE, USER_TYPE } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { Message } from '../../models/message';
import { ProfilePage } from '../profile/profile';
import { JobsListPage } from '../jobs-list/jobs-list';
import { Rating } from '../../models/rating';
import { RatersPage } from '../raters/raters';

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

  duplicateAppliedJobs: AppliedJob[] = [];
  duplicateSharedJobs: SharedJob[] = [];
  duplicateViewedJobs: ViewedJob[] = [];

  myRating: string;
  allRatings: Rating[] = [];
  usersIRated: Rating[] = [];
  usersRatedMe: Rating[] = [];
  appointments: Appointment[] = [];
  chats: Message[] = [];

  jobs: Job[] = [];
  users: User[] = [];

  userKey: string = '';
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
    this.userKey = this.dataProvider.getKey(this.profile);
    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
      this.jobs = jobs;
    });

    this.dataProvider.getAllFromCollection(COLLECTION.users).subscribe(users => {
      this.users = users;
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.jobs, 'uid', this.profile.uid).subscribe(jobs => {
      this.postedJobs = jobs;
    });

    this.dataProvider.getAllFromCollection(COLLECTION.appliedJobs).subscribe(jobs => {
      this.duplicateAppliedJobs = this.getMyJobs(jobs);
      this.appliedJobs = this.dataProvider.removeDuplicates(this.duplicateAppliedJobs, 'uid');
    });

    this.dataProvider.getAllFromCollection(COLLECTION.viewedJobs).subscribe(jobs => {
      this.duplicateViewedJobs = this.getMyJobs(jobs);
      this.viewedJobs = this.dataProvider.removeDuplicates(this.duplicateViewedJobs, 'uid');
    });

    this.dataProvider.getAllFromCollection(COLLECTION.sharedJobs).subscribe(jobs => {
      this.duplicateSharedJobs = this.getMyJobs(jobs);
      this.sharedJobs = this.dataProvider.removeDuplicates(this.duplicateSharedJobs, 'uid');
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'rid', this.profile.uid).subscribe(usersIRated => {
      this.usersIRated = usersIRated;
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'uid', this.profile.uid).subscribe(usersRatedMe => {
      this.usersRatedMe = usersRatedMe;
      this.myRating = this.dataProvider.getUserRating(this.usersRatedMe)
    });

    this.dataProvider.getAllFromCollection(COLLECTION.ratings).subscribe(ratings => {
      this.allRatings = ratings;
    });

    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appointments, this.userKey, this.profile.uid).subscribe(appointments => {
      this.appointments = appointments;
    });

  }

  countIratedAndRatedMe(): number {
    return this.usersIRated.length + this.usersRatedMe.length || 0;
  }

  getMyJobs(jobs) {
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

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }

  updateSkills() {
    const skills = [
      {
        name: 'Cooking, Laundry and Cleaning',
        category: 'Cleaning',
        experience: '1-2 years'
      },
      {
        name: 'Baby Sitting',
        category: 'Nanny',
        experience: '2-3 years'
      }
    ];
    this.users[9].skills = skills;
    this.dataProvider.updateItem(COLLECTION.users, this.users[9], this.users[9].uid).then(() => {
      console.log('User updated');
    }).catch(err => {
      console.log(err);
    })
  }
  rateUser() {
    const rate: Rating = {
      rating: 3.5,
      uid: 'yuoVVtSUNHSo5hgJqCe1Ufz99JT2',
      rid: '7ibVJ1zwZbhj8K3y6jIqBgxTFEm1', //yuoVVtSUNHSo5hgJqCe1Ufz99JT2
      date: this.dataProvider.getDateTime()
    };

    if (!this.dataProvider.alreadyRated(this.allRatings, rate)) {
      this.dataProvider.addNewItem(COLLECTION.ratings, rate);
    } else {
      console.log('already rated');

    }
  }

  addSharedJobs() {
    const job = {
      jid: 'wQPrEsBTWvPr7ji1559071534354',
      uid: 'bxvezgEa2OcitrM8r5zjshNpnkb2',//'bxvezgEa2OcitrM8r5zjshNpnkb2', 
      rid: 'yuoVVtSUNHSo5hgJqCe1Ufz99JT2',
      date: this.dataProvider.getDateTime()
    };
    this.dataProvider.addUserActionToJobCollection(COLLECTION.sharedJobs, job);
  }

  addAppointment() {
    const app: Appointment = {
      uid: 'ZTrFYN4arQao1yuAW7SmNDd21f93',
      rid: 'yuoVVtSUNHSo5hgJqCe1Ufz99JT2',
      status: STATUS.complete,
      dateCreated: this.dataProvider.getDateTime(),
      dateCompleted: '',
    }
    this.dataProvider.addNewItem(COLLECTION.appointments, app).then(() => {
      console.log('Appointment made');
    }).catch(err => {
      console.log;

    })
  }

  viewPostedJobs() {
    this.feedbackProvider.presentModal(JobsListPage, { jobs: this.postedJobs, allJobs: this.postedJobs, tag: JOBS_TYPE.posted });
  }

  viewAppliedJobs() {
    this.feedbackProvider.presentModal(JobsListPage, { jobs: this.appliedJobs, allJobs: this.duplicateAppliedJobs, tag: JOBS_TYPE.applied });
  }

  viewSharedJobs() {
    this.feedbackProvider.presentModal(JobsListPage, { jobs: this.viewedJobs, allJobs: this.duplicateViewedJobs, tag: JOBS_TYPE.shared });
  }

  viewViewedJobs() {
    this.feedbackProvider.presentModal(JobsListPage, { jobs: this.viewedJobs, allJobs: this.duplicateViewedJobs, tag: JOBS_TYPE.viewed });
  }

  viewRaters() {
    this.feedbackProvider.presentModal(RatersPage);
  }

  viewAppointments() {
    this.feedbackProvider.presentModal(AppointmentsPage, { appointments: this.appointments });
  }

  getItemById(jid): any {
    this.jobs.find(j => {
      return j.jid === jid;
    });
  }

  viewProfile() {
    this.navCtrl.push(ProfilePage);
  }
}
