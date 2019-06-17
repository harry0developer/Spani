import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController, NavParams, ActionSheetController, Events, Slides } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { PlacesPage } from '../places/places';
import { COLLECTION, EVENTS, USER_TYPE } from '../../utils/const';
import { AuthProvider } from '../../providers/auth/auth';
import { JobsPage } from '../jobs/jobs';
import { DashboardPage } from '../dashboard/dashboard';
import { MultiLoginPage } from '../multi-login/multi-login';

@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {
  @ViewChild(Slides) slides: Slides;

  signupType: string = 'phoneNumber';
  data: User = {
    uid: '',
    email: '',
    password: '',
    type: '',
    firstname: '',
    lastname: '',
    gender: '',
    race: '',
    nationality: '',
    phonenumber: '',
    location: {
      address: '',
      geo: {
        lat: '',
        lng: ''
      }
    },
    dob: '',
    date: '',
    settings: null,
    skills: null,
  }
  pickedAddress: string;

  nationalities: any;
  countries: any;
  user: any;
  categories: any;
  mode: string = 'vertical';
  selectedIndex = 0;
  emailSignup: boolean = false;
  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    private ionEvents: Events,
    private dataProvider: DataProvider,
    private actionSheetCtrl: ActionSheetController,
    private feedbackProvider: FeedbackProvider,
    private authProvider: AuthProvider,
    private modalCtrl: ModalController,
    private navParams: NavParams) {
  }

  ionViewDidLoad() {
    const data = this.navParams.get('data');
    this.data.firstname = data.firstname;
    this.data.lastname = data.lastname;
    this.data.phonenumber = data.phonenumber;
    this.data.email = data.email;
    this.data.password = data.password;
    this.data.uid = data.uid;
    this.getCountries();
  }

  selectChange(e) {
    console.log(e);
  }

  goNext() {
    this.slides.slideNext(400);
  }

  goPrev() {
    this.slides.slidePrev(400);
  }

  getCountries() {
    this.dataProvider.getCountries().subscribe(res => {
      this.countries = res;
    });
  }

  getCategories() {
    // this.dataProvider.getCategories().then(res => {
    //   console.log(res);
    //   this.categories = res;
    // }).catch(err => {
    //   console.log(err);
    // })
  }


  completeEmailAndPasswordSignup() {
    this.feedbackProvider.presentLoading();
    this.data.date = this.dataProvider.getDateTime();
    this.authProvider.signUpWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.data.uid = res.user.uid;
      this.authProvider.addUserToDatabase(this.data).then(() => {
        this.feedbackProvider.dismissLoading();
        console.log('User added successfully');
        this.navigate(this.data);
      }).catch(err => {
        console.log(err);
        this.feedbackProvider.dismissLoading();
      });
    }, err => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Signup failed', 'An error has occured while signing you up, please try again');
    });
  }


  completeAndSignup() {
    this.feedbackProvider.presentLoading();
    this.data.date = this.dataProvider.getDateTime();
    this.dataProvider.addNewItemWithId(COLLECTION.users, this.data, this.data.uid).then(() => {
      this.feedbackProvider.dismissLoading();
      this.navigate(this.data);
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.presentErrorAlert('Signup failed', 'An error has occured while signing you up, please try again');
    });
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  navigate(user) {
    this.ionEvents.publish(EVENTS.loggedIn, user);
    this.authProvider.storeUser(user);
    this.navCtrl.setRoot(DashboardPage);
  }

  getUserType(type) {
    this.data.type = type;
    this.goNext();
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(PlacesPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.data.location.address = data.address;
        this.pickedAddress = data.address;
        this.data.location.geo = {
          lat: data.lat,
          lng: data.lng
        }
        console.log(this.data);

      }
    });
    modal.present();
  }

  cancelRegistration() {
    this.navCtrl.setRoot(MultiLoginPage);
  }
}