import { Component, Renderer2, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ILogin } from '../../interface/login';
import { DataStorage } from '../../core/dataStorage';
// import { Common } from '../../services/common';
import {Spinner} from '../../services/spinner';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  providers: [DecimalPipe, Spinner],
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  tab5: any;
  fundTransfer: boolean = false;
  setBankDetails: boolean = false;
  closeAccount: boolean = false;
  changePassword: boolean = true;
  setThumbDevice: boolean = false;
  profile: boolean = false;
  menu: any;
  logInfo: ILogin;
  clientMstId: number;
  pageID: any = 21;
  pageTitle: any = 'Change Password';

  termCondContent: string;

  constructor(private dataStorage: DataStorage, private route: ActivatedRoute, public spinner : Spinner,
    // private common: Common
    ) { }

  ngOnInit() {
    this.spinner.hide();
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    if (this.route.queryParams["_value"].ID != null) {
      this.ChangeMenu('SetBankDetails');
    }
  }

  ChangeMenu(menu) {
    this.clearPage();
    if (menu == "ChangePassword") {
      this.tab = 'tab1';
      this.changePassword = true;
      this.pageTitle = "Change Password";
      this.pageID = 21;
    }
    else if (menu == "SetFingerPrintDevice") {
      this.tab = 'tab2';
      this.setThumbDevice = true;
      this.pageTitle = "Set Finger Print Device";
      this.pageID = 20;
    }
    else if (menu == "fundTransfer") {
      this.tab = 'tab3';
      this.fundTransfer = true;
      this.pageTitle = "Set Finger Print Device";
      this.pageID = 20;
    }
    else if (menu == "Profile") {
      this.tab = 'tab4';
      this.profile = true;
      this.pageTitle = "Profile";
      this.pageID = 20;
    }
    else if (menu == "CloseAccount") {
      this.tab = 'tab5';
      this.closeAccount = true;
      this.pageID = 14;
      this.pageTitle = "Close Account";

    }
    else if (menu == "SetBankDetails") {
      this.tab = 'tab6';
      this.pageTitle = "Set Bank Details";
      this.pageID = 19;
      this.setBankDetails = true;
    }
  }

  clearPage() {
    this.changePassword = false;
    this.setThumbDevice = false;
    this.profile = false;
    this.closeAccount = false;
    this.setBankDetails = false;
    this.fundTransfer = false;
  }

  // pageHelp() {
  //   this.common.TermConditons({ Term_Cond_Type: this.pageID, loginFlag: 'A' }, this).subscribe(data => {
  //     if (data.code == 1) {
  //       this.termCondContent = data.cursor1;
  //     }
  //   });
  // }





}
