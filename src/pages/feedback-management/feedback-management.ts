import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-feedback-management',
  templateUrl: 'feedback-management.html',
})
export class FeedbackManagementPage {
  feedbacks: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afService: AngularFireService) {
      this.afService.getList('FeedbackOfItemFromUsers').subscribe((allItemsFB)=>{
        let allItemsFBack = allItemsFB;
        console.log(allItemsFBack);
        this.feedbacks = [];
        allItemsFBack.forEach(allItemFBack => {
          let itemID = allItemFBack.$key;
          let feedbacksOfItem = [];
          this.afService.getList('FeedbackOfItemFromUsers/'+itemID).subscribe((fbsOfItem)=>{
            // console.log(userFB);
            
            fbsOfItem.forEach(fbOfItem => {
              // console.log(fbOfItem);
              let userID = fbOfItem.$key;
              let feedbackOfItem = fbOfItem;
              let feedback = {
                userID: userID,
                feedbackOfItem: feedbackOfItem
              }
              feedbacksOfItem.push(feedback);
            });
            console.log(feedbacksOfItem)
          })
          let feedback = {
            itemID: itemID,
            feedback: feedbacksOfItem
          }
          this.feedbacks.push(feedback);
        });
        console.log(this.feedbacks);


        // console.log(this.feedbacks);
      })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackManagementPage');
  }

  go2ItemDetail(itemID){
    console.log(itemID);
    this.afService.getObject('soldItems/'+itemID).subscribe((soldItem)=>{
      console.log(soldItem);
      this.navCtrl.push('ShowItemDetailPage', { key: itemID, data: soldItem});
    })
  }

}
