import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { USER_TYPE } from '../../utils/const';
import { User } from '../../models/user';
import { DataProvider } from '../data/data';

@Injectable()
export class AuthProvider {

  constructor(
    public angularFireAuth: AngularFireAuth,
    public angularFireStore: AngularFirestore,
    public dataProvider: DataProvider,
  ) { }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  signInWithTwitter() {
    return this.authLogin(new auth.TwitterAuthProvider());
  }

  signInWithFacebook() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  authLogin(provider) {
    return this.angularFireAuth.auth.signInWithPopup(provider);
  }

  signInWithPhoneNumber(phoneNumber: string, verifier: auth.ApplicationVerifier) {
    return this.angularFireAuth.auth.signInWithPhoneNumber(phoneNumber, verifier);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  addUserToDatabase(user: User) {
    return this.angularFireStore.collection('users').doc(user.uid).set(user);
  }

  sendVerificationMail() {
    return this.angularFireAuth.auth.currentUser.sendEmailVerification();
  }

  forgotPassword(email: string) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  logout() {
    this.clearStoredUser();
    return this.angularFireAuth.auth.signOut();
  }

  storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser(): User {
    const user = localStorage.getItem('user');
    return user !== 'undefined' ? JSON.parse(user) : null;
  }

  clearStoredUser() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  signOut() {
    localStorage.removeItem('user');
    return this.angularFireAuth.auth.signOut();
  }


  // firebaseRecaptchaVerifier(){
  //   let applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  //     'size': 'invisible',
  //     'callback': function (response) {
  //       // reCAPTCHA solved - will proceed with submit function
  //       console.log(response);
  //     },
  //     'expired-callback': function () {
  //       // Reset reCAPTCHA?
  //     }
  //   });
  // }

  // phoneAuth() {

  //   const provider = new firebase.auth.PhoneAuthProvider();
  //   provider.verifyPhoneNumber('+27829390061', applicationVerifier).then(function (verificationId) {
  //     var verificationCode = window.prompt('Please enter the verification ' + 'code that was sent to your mobile device.');
  //     return firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
  //   }).then(function (phoneCredential) {
  //     console.log(phoneCredential);
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }


}
