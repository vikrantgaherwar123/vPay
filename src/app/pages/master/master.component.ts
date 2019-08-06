import { Component, Renderer2, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { ILogin } from '../../interface/login';
import { DataStorage } from '../../core/dataStorage';
import { ErrorHandler } from '../../core/errorHandler';
import { Spinner } from '../../services/spinner';
import { Common } from '../../services/common';
import { MatDialog } from "@angular/material";
import { Otp } from '../../shared/component/otp/otp.component';
import { Toast } from '../../services/toast';

import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./master.component.css'],
})
export class MasterComponent implements OnInit {
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  tab5: any;
  menu: any;
  logInfo: ILogin;
  mobileNo: string = "";
  InstituteSubMaster: boolean = false;
  showInstiSubMenu: boolean = false;
  InstituteUserMaster: boolean = false;

  pageID: any = 21;
  pageTitle: any = 'Institute User Master';

  clientMstId: number;
  login_user_id: string;

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

  otpElement: any;
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;

  //dialog


  constructor(private dataStorage: DataStorage, private route: ActivatedRoute, private router: Router, private apiService: ApiService,
    private spinner: Spinner, private errorHandler: ErrorHandler, private renderer2: Renderer2, private toast: Toast, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) { }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;

    if (this.logInfo[0].CORPORATE_FLAG == 'C' && this.logInfo[0].ADMINUSER == 'Y' && this.logInfo[0].SUPERUSER == 'Y') {
      // if (this.bbpsFlag == "Y") {
        this.showInstiSubMenu= true;
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
    this.ChangeMenu("InstituteUserMaster");
  }

  ChangeMenu(menu) {
    this.clearPage();
    if (menu == "InstituteSubMaster") {
      this.tab = 'tab1';
      this.InstituteSubMaster = true;
    }
    else if (menu == "InstituteUserMaster") {
      this.tab = 'tab2';
      this.InstituteUserMaster = true;
    }
  }

  
  clearPage() {
    this.InstituteSubMaster = false;
    this.InstituteUserMaster = false;
  }

  pageHelp() {
    this.common.TermConditons({ Term_Cond_Type: this.pageID, loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }





}
