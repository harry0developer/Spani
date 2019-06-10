import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestUiPage } from './test-ui';

@NgModule({
  declarations: [
    TestUiPage,
  ],
  imports: [
    IonicPageModule.forChild(TestUiPage),
  ],
})
export class TestUiPageModule {}
