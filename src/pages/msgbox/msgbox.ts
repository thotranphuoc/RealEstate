import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iMessage } from '../../interfaces/message.interface';
import { AppService } from '../../services/app.service';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';

@IonicPage()
@Component({
  selector: 'page-msgbox',
  templateUrl: 'msgbox.html',
})
export class MsgboxPage {
  messages: any[] = [];
  ticketKeys: any[]=[];
  tickets: any[] = [];
  userID;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
    private afService: AngularFireService) {
      this.userID = this.afService.getAuth().auth.currentUser.uid;
      // this.afService.getList('UserTicket/'+this.userID)
      // .subscribe((list: any[])=>{
      //   // console.log(list);
      //   let array = list;
      //   this.ticketKeys = [];
      //   array.forEach(element => {
      //     this.ticketKeys.push(element.$key)
      //   });
      //   console.log(this.ticketKeys);
      //   this.tickets =[];
      //   this.ticketKeys.forEach(ticketKey=>{
      //     this.afService.getObject('Ticket/'+ticketKey)
      //     .subscribe((ticket)=>{
      //       this.tickets.push(ticket);
      //     })
      //   })
      //   console.log(this.tickets);
      // })

      
      // get ticketKeys
      this.ticketKeys =[];
      this.dbService.getListReturnPromise_ArrayKeyObject('UserTicket/'+this.userID)
      .then((keys: any[])=>{
        this.ticketKeys = keys;
        console.log(this.ticketKeys)
      })
      // get tickets;
      .then(()=>{
        this.tickets = [];
        this.ticketKeys.forEach(key=>{
          this.dbService.getOneItemReturnPromise('Ticket/'+key)
          .then((ticket)=>{
            console.log(ticket.val());
            console.log(ticket.key);
            this.tickets.push({key: ticket.key,data: ticket.val()});
          })
        })
        console.log(this.tickets);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MsgboxPage');
  }

  go2Support(ticket, key){
    console.log(ticket, key);
    this.navCtrl.push('SupportPage', {action: 'user-view', data: ticket, key: key});
    // console.log(key);
    // this.afService.getObject('Ticket/'+key).subscribe((data)=>{
    //   console.log(data);
    //   this.navCtrl.push('SupportPage', {action: 'user-view', data: ticket});
    // })
  }

}
