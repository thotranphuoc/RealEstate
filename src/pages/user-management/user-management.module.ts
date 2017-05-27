import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserManagementPage } from './user-management';

@NgModule({
  declarations: [
    UserManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(UserManagementPage),
  ],
  exports: [
    UserManagementPage
  ]
})
export class UserManagementPageModule {}
