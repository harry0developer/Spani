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

  signInWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmailAndPassword(user: User) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(res => {
      user.uid = res.user.uid;
      this.storeUser(user);
      this.addUserToDatabase(user);
    });
  }

  addUserToDatabase(user: User) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      gender: user.gender,
      firstname: user.firstname,
      lastname: user.lastname,
      date: this.dataProvider.getDateTime(),
      type: user.type,
      location: null,
      phone: null,
      settings: { hide_dob: false, hide_phone: false },
    };
    return this.angularFireStore.collection('users').doc(user.uid).set(userData);
  }

  sendVerificationMail() {
    return this.angularFireAuth.auth.currentUser.sendEmailVerification();
  }

  forgotPassword(passwordResetEmail) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  logout() {
    return this.angularFireAuth.auth.signOut();
  }

  storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  signOut() {
    localStorage.removeItem('user');
    return this.angularFireAuth.auth.signOut();
  }

  isRecruiter(user): boolean {
    return user && user.type === USER_TYPE.recruiter;
  }

}
