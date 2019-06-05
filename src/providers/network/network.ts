import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';
import { NETWORK } from '../../utils/const';

@Injectable()
export class NetworkProvider {

  constructor(public network: Network, private ionEvents: Events) {
    console.log('Hello NetworkProvider Provider');
  }

  isDisconnected() {
    this.network.onDisconnect().subscribe(() => {
      this.ionEvents.publish(NETWORK.error);
      // this.feedbackProvider.presentModal(ErrorPage, { type: ERRORS.connection });
    });
  }

  isConnected() {
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        console.log('connected');
        this.ionEvents.publish(NETWORK.connected);
      }, 3000);
    });
  }


}
