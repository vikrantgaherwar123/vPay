import { Component, Renderer2, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { ILogin } from '../../interface/login';
import { DataStorage } from '../../core/dataStorage';
import { ErrorHandler } from '../../core/errorHandler';
import { Spinner } from '../../services/spinner';
import { ICore } from '../../interface/core';
import { Common } from '../../services/common';
import { MatDialog } from "@angular/material";
import { Otp } from '../../shared/component/otp/otp.component';
import { IOtp } from '../../interface/otp';
import { Toast } from '../../services/toast';

import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-StatementOfTransaction',
  templateUrl: './StatementOfTransaction.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./StatementOfTransaction.scss'],
})
export class StatementOfTransactionComponent implements OnInit {
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  tab5: any;
  menu: any;
  ClientWiseStatement: boolean = false;
  InstituteWiseStatement: boolean = false;
  SubInstituteWiseStatement: boolean = false;
  showInstiMenu: boolean = false;
  logInfo: ILogin;
  mobileNo: string = "";

  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  pageID: any = 21;
  pageTitle: any = 'Change Password';

  termCondContent: string;
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
  sessionId: any;

  constructor(private dataStorage: DataStorage, private route: ActivatedRoute, private router: Router, private apiService: ApiService,
    private spinner: Spinner, private errorHandler: ErrorHandler, private renderer2: Renderer2, private toast: Toast, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) { }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.sessionId = this.logInfo.sessionId;
    this.ChangeMenu("ClientWiseStatement");
    if (this.logInfo[0].CORPORATE_FLAG == 'C' && this.logInfo[0].ADMINUSER == 'Y' && this.logInfo[0].SUPERUSER == 'Y') {
      // if (this.bbpsFlag == "Y") {
        this.showInstiMenu= true;
      // }
      // else {
     
      // }
 
    }
    else if (this.logInfo[0].CORPORATE_FLAG == 'C' && this.logInfo[0].SUPERUSER == 'Y') {
      // if (this.bbpsFlag == "Y") {
      
      // }
      // else {
      
      // }
    }
    else {
      // if (this.bbpsFlag == "Y") {
      
      // }
      // else {      
      // }
    
    }
  }

  ChangeMenu(menu) {
    this.clearPage();
    if (menu == "ClientWiseStatement") {
      this.tab = 'tab1';
      this.ClientWiseStatement = true;
      this.pageTitle = "ClientWise Statement";
      this.pageID = 21;
    }
    else if (menu == "InstituteWiseStatement") {
      this.tab = 'tab2';
      this.InstituteWiseStatement = true;
      this.pageTitle = "InstituteWise Statement";
      this.pageID = 20;
    }
    else if (menu == "SubInstituteWiseStatement") {
      this.tab = 'tab3';
      this.SubInstituteWiseStatement = true;
      this.pageTitle = "Sub InstituteWise Statement";
      this.pageID = 20;
    }
  }


  clearPage() {
    this.ClientWiseStatement = false;
    this.InstituteWiseStatement = false;
    this.SubInstituteWiseStatement = false;
  }

  pageHelp() {
    this.common.TermConditons({ Term_Cond_Type: this.pageID, loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }





}
