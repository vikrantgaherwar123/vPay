import { Component, OnInit } from '@angular/core';
//import * as $ from 'jquery';
import { Router } from '@angular/router';
import { DataStorage } from "../../../core/dataStorage";
import { Common } from '../../../services/common';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'vgipl-ourTeam',
  templateUrl: './ourTeam.component.html',
  styleUrls: ['./ourTeam.component.css'],
  providers: [Common, Spinner]
})
export class OurTeamComponent implements OnInit {
  Items: Array<any>;
  public QRDisp: any = 'None';
  public chkTerm: any = true;
  public PPhone: any;
  public CPhone: any;
  public SPhone: any;
  public PEMail: any;
  public CEMail: any;
  public SEMail: any;
  INSTI_SUB_MST_ID: any;
  CLIENT_MST_ID: any;
  public CORPORATE_FLAG: any = 'I';

  //dialog
  title;
  message;
  information;
  button;
  style;
  allow_outside_click;
  width;
  buttons = [
    { value: MessageBoxButton.Ok, display: "Ok" },
    { value: MessageBoxButton.OkCancel, display: "Ok/Cancel" },
    { value: MessageBoxButton.YesNo, display: "Yes/No" },
    { value: MessageBoxButton.AcceptReject, display: "Accept/Reject" }
  ];
  style_full = MessageBoxStyle.Full;
  style_simple = MessageBoxStyle.Simple;
  subscriber: Subscription;

  constructor(private router: Router, private dialog: MatDialog, private dataStorage: DataStorage,
    private spinner: Spinner,private errorHandler: ErrorHandler, private common: Common) { }


  ngOnInit() {
    this.GetTC();
    $('#vpayBanner').hide();
    //$('#txtMobileNo')[0].focus();
  }
  GetTC() {
    this.spinner.show();
    var paramObj = {
      client_mst_id: 0,//this.logInfo[0].CLIENT_MST_ID,
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: 0
    }
    this.common.getContactUs(paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.Items = data.cursor1[0].ADDRESS_1.split('|');
        this.PPhone = data.cursor1[0].PHONE_1;
        this.CPhone = data.cursor1[1].PHONE_1;
        this.SPhone = data.cursor1[2].PHONE_1;
        this.PEMail = data.cursor1[0].EMAILID_1;
        this.CEMail = data.cursor1[1].EMAILID_1;
        this.SEMail = data.cursor1[2].EMAILID_1;
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  gotoHome() {
    this.router.navigate(['']);
  }
  gotoLogin() {
    //this.dataStorage.loginUserType = flag;
    this.router.navigate(['/authentication/login']);
  }
  gotoSignUp(flag: string) {
    this.dataStorage.loginUserType = flag;
    this.router.navigate(['/authentication/signup'], { queryParams: { signUpUserType: flag } });
  }
  gotoAbout() {
    this.router.navigate(['/about']);
  }
  gotoHowToUse() {
    this.router.navigate(['/howItWorks']);
  }
  gotoOurTeam() {
    this.router.navigate(['/ourTeam']);
  }
  gotoWhyUs() {
    this.router.navigate(['/whyUs']);
  }


}
