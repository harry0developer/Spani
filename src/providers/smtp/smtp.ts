import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';


@Injectable()
export class SmtpProvider {

  constructor(public http: HttpClient) {
    console.log('Hello SmtpProvider Provider');
  }


  sendEmail(email: string, subject: string, msg: string) {
    let url = `https://us-central1-my-spani.cloudfunctions.net/httpEmail`;
    let params: URLSearchParams = new URLSearchParams();
    // Project Console: https://console.firebase.google.com/project/my-spani/overview

    const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    params.set('to', email);
    params.set('from', 'support@spani.co.za');
    params.set('subject', subject);
    params.set('content', msg);

    return this.http.post(url, params, headers).toPromise();
  }

}
