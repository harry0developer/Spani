import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { COLLECTION, USER_TYPE } from '../../utils/const';
import { Rating } from '../../models/rating';

@Injectable()
export class DataProvider {
  KM: number = 1.60934;

  constructor(
    public angularFireStore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    public http: HttpClient,
  ) { }

  getCountries() {
    return this.http.get('assets/countries.json');
  }
  getAllFromCollection(collectionName: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentFromCollection(collectionName: string, docId: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName).doc(docId).get();
  }

  getCollectionById(collectionName: string, uid: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentFromCollectionById(collectionName, id) {
    return this.angularFireStore.collection<any>(collectionName).doc(id).valueChanges();
  }

  getCollectionByKeyValuePair(collectionName: string, key: string, value: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName, ref => ref.where(key, '==', value)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  // ========== master add document array ==============

  addUserActionToJobCollection(collection: string, newJob: any) {
    const key = new Date().getTime().toString();
    this.getDocumentFromCollectionById(collection, newJob.jid).subscribe(jobs => {
      if (!!jobs) { //Job is root document eg /viewed-jobs/jobid
        const jobsArray = this.getArrayFromObjectList(jobs);
        if (!this.isUserInJobDocumentArray(jobsArray, newJob)) { // add job to existing database jobs
          const newJobs = { ...jobs, [key]: newJob };
          this.updateCollection(collection, newJobs, newJob.jid);
        } else { //check if user has 
          console.log('do nothing');
        }
      } else { //Job is NOT root document eg /viewed-jobs/otherjobIdNotThisOne
        const newJobs = { [key]: newJob };
        this.updateCollection(collection, newJobs, newJob.jid);
      }

    });
  }


  getArrayFromObjectList(obj): any[] {
    return Object.keys(obj).map((k) => obj[k]);
  }

  isUserInJobDocumentArray(jobs: any[], job): any[] {
    return jobs.find(res => {
      return res.uid === job.uid && res.jid === job.jid;
    });
  }

  updateCollection(collection, newJobs, id) {
    this.addNewItemWithId(collection, newJobs, id).then(() => {
      console.log('item added');
    }).catch(err => {
      console.log(err);
    })
  }

  // ========== master add document array ==============

  getItemById(collectionName: string, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).valueChanges();
  }

  updateItem(collectionName: string, data: any, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).set(data, { merge: true });
  }

  addNewItemWithId(collectionName: string, data: any, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).set(data);
  }

  addNewItem(collectionName: string, data: any) {
    return this.angularFireStore.collection(collectionName).add(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).delete();
  }

  findItemById(collectionName: string, id: string) {
    return this.getItemById(collectionName, id);
  }

  getUserById(id): Observable<User> {
    return this.getItemById(COLLECTION.users, id);
  }

  getUserByIdPromise(id) {
    return this.getItemById(COLLECTION.users, id).toPromise();
  }

  getChats(rootCollection: string, receiverUid: string, senderUid: string) {
    return this.angularFireStore.collection(rootCollection).doc(receiverUid).collection(senderUid, ref => ref.orderBy('date')).valueChanges();
  }

  getMyChats(rootCollection: string, senderUid: string) {
    return this.angularFireStore.collection(rootCollection).doc(senderUid).snapshotChanges();
  }


  addNewMessage(rootCollection: string, receiverUid: string, senderUid: string, messageData: Message) {
    return this.angularFireStore.collection(rootCollection).doc(receiverUid).collection(senderUid).add(messageData);
  }


  getProfilePicture(profile): string {
    return `assets/imgs/users/${profile.gender}.svg`;
  }

  getDateTime(): string {
    return moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
  }

  getDateTimeMoment(dateTime): string {
    return moment(dateTime).fromNow();
  }

  generateId(length: number): string { //must be 15 + timestamp
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + this.getTimestampInMilliseconds();
  }

  getTimestampInMilliseconds(): string {
    return new Date().getTime().toString();
  }


  // ===== HELPERS ======

  cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\(/, '').replace(/\)/, '').replace(/\ /, '').replace(/\ /, '');
  }

  getKey(user: User): string {
    return user.type === USER_TYPE.candidate ? 'uid' : 'rid';
  }

  getUserRating(ratings: Rating[]): string {
    let myRating: number = 0.0;
    ratings.map(r => {
      myRating += r.rating;
    });
    const rating = myRating / ratings.length;
    return (Math.round(rating * 100) / 100).toFixed(1);
  }

  alreadyRated(allRatings, rating) {
    const res = allRatings.filter(r => r.uid === rating.uid && r.rid === rating.rid);
    return res.length > 0;
  }

  mapJobs(allJobs: any[], jobsToBeMapped: any[]): any[] {
    let mappedJobs = [];
    jobsToBeMapped.forEach(j => {

      allJobs.forEach(job => {
        if (job.jid === j.jid) {
          mappedJobs.push(Object.assign(job, { users: [...j.users] }));
        }
      });
    });
    return mappedJobs;
  }


  countJobOccurrence(array, id): any[] {
    return array.filter(j => j.jid === id);
  }

  removeDuplicates(array, key: string) {
    return array.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos;
    });
  }

  applyHaversine(jobs, lat, lng) {
    if (jobs && lat && lng) {
      let usersLocation = {
        lat: lat,
        lng: lng
      };
      jobs.map(job => {
        let placeLocation = {
          lat: job.location.geo.latitude,
          lng: job.location.geo.longitude
        };
        job.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'miles'
        ).toFixed(0);
      });
      return jobs;
    } else {
      return jobs;
    }
  }

  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d * this.KM; //convert miles to km
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}
