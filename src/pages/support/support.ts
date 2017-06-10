import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iSupport } from '../../interfaces/support.interface';
import { iMessage } from '../../interfaces/message.interface';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  userID;
  problemType: string;
  // problem: iSupport = { type: null, title: null, content: null, userID: null, date: null, state: null };
  action: string = 'new-support';

  message: iMessage = {
    date: null,
    userID: null,
    content: null,
    pre_state: null,
    state: null,
    type: null,
    title: null
  }
  ticket = this.message;
  suggestion = this.message;
  problem = this.message;
  messageCheck: boolean = false;
  newMessage = null;
  msg: any[] = [];
  ticketMessages: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService) {
    this.userID = this.afService.getAuth().auth.currentUser.uid;
    // action: add-new or update-item
    let Act = this.navParams.get('action');
    let data = this.navParams.get('data');
    if (typeof (Act) != 'undefined') {
      this.action = Act;
      if(this.action=='admin-view'){
        if(data.type=='SUGGESTION'){
          this.action = 'admin-view-suggest';
        }else{
          this.action = 'admin-view-support';
        }
      }
      if(this.action=='user-view'){
        if(data.type=='SUGGESTION'){
          this.action = 'user-view-suggest';
        }else{
          this.action = 'user-view-support';
        }
      }
      console.log(this.action);
    }

    switch (this.action) {
      case 'new-suggest':
        this.newSuggest();
        break;
      case 'admin-view-suggest':
        this.adminViewSuggest();
        break;
      case 'user-view-suggest':
        this.userViewSuggest();
        break;
      case 'admin-view-support':
        this.adminViewSupport();
        break;
      case 'user-view-support':
        this.userViewSupport();
        break;
      default:
        break;
    }
  }

  adminViewSuggest(){
    console.log(this.action, 'admin-view-suggest');
    console.log(this.suggestion);
    this.suggestion = this.navParams.get('data');
    console.log(this.suggestion);

    let key = this.navParams.get('key');
    this.retrieveTicketMsg(key);
  }

  userViewSuggest(){
    console.log(this.action, 'user-view-suggest');
    console.log(this.suggestion);
    this.suggestion = this.navParams.get('data');
    console.log(this.suggestion);

    let key = this.navParams.get('key');
    this.retrieveTicketMsg(key);
  }

  newSuggest(){
    console.log(this.action, 'new-suggest');
  }

  adminViewSupport() {
    console.log(this.action, 'admin-view-support');
    this.problem = this.navParams.get('data');
    console.log(this.problem);

    let key = this.navParams.get('key');
    this.retrieveTicketMsg(key);
  }

  userViewSupport() {
    console.log(this.action, 'user-view-support');
    this.problem = this.navParams.get('data');
    console.log(this.problem);

    let key = this.navParams.get('key');
    this.retrieveTicketMsg(key);
  }

  retrieveTicketMsg(key){
    // solution1: observable
    // this.afService.getList('Messages/' + key).subscribe(list => {
    //   this.ticketMessages = list;
    //   console.log(this.ticketMessages);
    // })

    // solution2: promise
    this.dbService.getListReturnPromise_ArrayDataObject('Messages/' + key)
    .then((list: any[])=>{
      this.ticketMessages = list;
      console.log(this.ticketMessages);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }

  selectProblemType(problemType) {
    if (this.problemType == problemType) {
      this.problemType = null;
    } else {
      this.problemType = problemType;
    }

    console.log(this.problemType);
  }

  sendSupport(type){
    console.log(this.problem);
    this.problem.date =  this.appService.getCurrentDataAndTime();
    this.problem.pre_state = 'N/A';
    this.problem.state = 'OPENING';
    this.problem.type = 'SUPPORT_'+type;
    this.problem.userID = this.userID;
    console.log(this.problem);
    this.sendTicket(this.problem);
  }

  sendSuggestion(){
    console.log(this.suggestion);
    this.suggestion.date =  this.appService.getCurrentDataAndTime();
    this.suggestion.pre_state = 'N/A';
    this.suggestion.state = 'OPENING';
    this.suggestion.type = 'SUGGESTION';
    this.suggestion.userID = this.userID;
    console.log(this.suggestion);
    this.sendTicket(this.suggestion);
  }


  sendTicket( ticket) {
    console.log(ticket);
    this.afService.addItem2List('Ticket',ticket)
      .then((res) => {
        this.afService.updateItemInList('UserTicket/' + this.userID, res.key, { date: ticket.date })
          .then((res) => {
            console.log('update successful');
            this.appService.toastMsg('Your request was sent successfull to out team. We will feedback soon', 10000);
            this.navCtrl.setRoot('MapPage');
          })
      })
  }


  setState(userID, ticketID,pre_state, state) {
    console.log(userID, ticketID, pre_state, state);
    if (state == 'DELETE') {
      this.afService.deleteItemFromList('Ticket', ticketID);
      this.afService.deleteItemFromList('UserTicket/' + userID, ticketID);
      console.log('delete done!');
      this.navCtrl.pop();
    } else {
      console.log(this.message);
      this.message.state = state;
      this.message.date = this.appService.getCurrentDataAndTime();
      this.message.pre_state = pre_state;
      this.message.userID = userID;
      this.message.content = this.newMessage;
      this.message.type = 'RESPONSE'

      this.addMessage(ticketID, this.message, userID);

      // update pre_state & state of ticket
      this.afService.updateObjectData('Ticket/' + ticketID, { state: state, pre_state: pre_state })
        .then(() => {
          console.log('update done!');
          this.navCtrl.pop();
        })
        .catch((err)=>{
          console.log(err);
        })
    }
  }

  addMessage(ticketID, message, userID) {
    // get current messages of ticket
    this.msg = [];

    // this.dbService.getListReturnPromise_ArrayWithKey_DataObject('Messages/'+ ticketID)
    // .then((list)=>{
    //   console.log(list);
    // })
    // .catch(err=>{console.log(err)})

    this.dbService.getListReturnPromise_ArrayDataObject('Messages/' + ticketID)
      .then((list: any[]) => {
        console.log(list);
        this.msg = list;
        console.log(this.msg)
        this.msg.push(message);

        this.afService.setObjectData('Messages/' + ticketID, this.msg)
          .then(() => {
            console.log('success')
          })
          .catch((err) => { console.log(err) })

      })
      .catch(err => { console.log(err) })

    // this.dbService.getListReturnPromise_ArrayKeyObject('Messages/'+ ticketID)
    // .then((list)=>{
    //   console.log(list);
    // })
    // .catch(err=>{console.log(err)})
  }

  doMessageCheck() {
    this.messageCheck = !this.messageCheck;
  }

  sendMessage(ticketID: string, message: iMessage, userID: string) {
    console.log(ticketID, message, userID);
    // get current messages of this ticket;
    this.msg = [];
    this.afService.getObject('Messages/' + ticketID)
      .subscribe((messages: iMessage[]) => {
        // console.log(messages);
        this.msg.push(messages);
        console.log(this.msg);
      })
    this.msg.push(message);
    console.log(this.msg);
    this.afService.setObjectData('Messages/' + ticketID, this.msg)
      .then(() => {
        console.log('success')
      })
      .catch((err) => { console.log(err) })
  }

}


/*
input:
this.navCtrl.push('SupportPage', {action: 'view-support', data: support});
*/