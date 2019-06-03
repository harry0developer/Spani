import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController, NavParams, ActionSheetController, Events, Slides } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { PlacesPage } from '../places/places';

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
    userType: '',
    firstname: '',
    lastname: '',
    gender: '',
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
    dateCreated: '',
    settings: null
  }
  pickedAddress: string;

  nationalities: any;
  countries: any;
  user: any;
  categories: any;
  mode: string = 'vertical';
  selectedIndex = 0;
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController, public ionEvents: Events, public dataProvider: DataProvider,
    public actionSheetCtrl: ActionSheetController, private feedbackProvider: FeedbackProvider,
    public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // this.feedbackProvider.presentAlert("Welcome", "Complete your details, then you are good to go.");
    // const data = this.navParams.get("data");
    // this.data.email = data.email;
    // this.data.password = data.password;
    // this.data.firstname = data.firstname;
    // this.data.lastname = data.lastname;

    this.getCountries();
    this.getCategories();

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


  signup() {
    // this.feedbackProvider.presentLoading("Please wait...");
    // let res;
    // this.data.last_login = this.dataProvider.getDate();
    // this.data.nationality = this.data.nationality.trim();
    // this.data.status = "Active";
    // this.data.date_created = this.dataProvider.getDate();
    // this.data.date_updated = this.dataProvider.getDate();
    // this.data.title = this.data.type;
    // console.log("Sending data ", this.data);

    // this.dataProvider.postDataToDB(this.data, "signup").then((result) => {
    //   res = result;
    //   this.feedbackProvider.dismissLoading();
    //   if (res && res.error) {
    //     console.log(res.error);
    //     this.feedbackProvider.presentErrorAlert("Signup Failed");
    //   } else {
    //     this.ionEvents.publish(this.dataProvider.USER_PROFILE_UPDATED, res.data);
    //     this.init(res.data);
    //   }
    // }).catch(err => {
    //   console.log(err);
    //   this.feedbackProvider.dismissLoading();
    // })
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  init(user) {
    // this.ionEvents.publish(this.dataProvider.USER_LOGGED_IN, user);
    // this.dataProvider.initializeData();
    // if (user.type.toLowerCase() === "recruiter") {
    //   this.navCtrl.setRoot(DashboardPage);
    // }
    // else {
    //   this.navCtrl.setRoot(JobsPage);
    // }
  }



  getUserType(type) {
    // this.data.type = type;
    this.goNext();
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(PlacesPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.data.location.address = data.address;
        this.data.location.geo = {
          lat: data.lat,
          lng: data.lng
        }
        console.log(this.data);

      }
    });
    modal.present();
  }
}