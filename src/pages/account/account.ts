import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  action: string = 'sign-in';
  signIn: { email: string, password: string } = { email: '', password: '' };
  signUp: { email: string, password1: string, password2: string } = { email: '', password1: '', password2: '' };
  resetAccount: { email: string } = { email: '' };
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthService,
    private appService: AppService ) {
      let Act = this.navParams.get('action');
      if(typeof(Act) !='undefined'){
        this.action = Act ;
      }
      console.log(this.action);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  onSignIn(form){
    console.log(form.value);
    this.authService.signIn(this.signIn.email, this.signIn.password)
    .then(()=>{
      console.log('Login success');
      this.navCtrl.setRoot('MapPage');
    })
    .catch((err)=>{
      console.log('Error when loggin');
    })
  }

  onSignUp(form){
    console.log(form.value);
    this.authService.signUp(this.signUp.email, this.signUp.password1)
    .then(()=>{
      console.log('account registered successfully');
      this.appService.alertMsg('Success', 'account created successfully');
      this.navCtrl.setRoot('MapPage');
    })
    .catch((err)=>{
      console.log('account registered failed');
      this.appService.alertMsg('Fail', 'account created fail');
    })
  }

  onResetAccount(form) {
    // this.btnReset = false;
    console.log(form.value)
    this.authService.resetAccount(this.resetAccount.email)
    .then((data) => {
      // this.btnReset = true;
      this.authService.isSigned = false;
      // this.isSigned = this.authService.isSigned;
      this.appService.alertMsg('Success', 'Please check email and reset your account: ' + this.resetAccount.email);
      this.navCtrl.push('MapPage');
    })
    .catch((err)=>{
      console.log('account registered failed');
      this.appService.alertMsg('Fail', 'account created fail');
    })
  }

  go2SignUp(){
    this.action = 'sign-up';
  }



}
