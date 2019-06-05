import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobsListPage } from './jobs-list';

@NgModule({
  declarations: [
    JobsListPage,
  ],
  imports: [
    IonicPageModule.forChild(JobsListPage),
  ],
})
export class JobsListPageModule {}
