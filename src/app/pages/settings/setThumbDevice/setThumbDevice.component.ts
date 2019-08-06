import { Component, OnInit } from '@angular/core';
//import * as $ from 'jquery';
import { Router } from '@angular/router';

import { ICore } from '../../../interface/core';
import { ILogin } from '../../../interface/login';
import { Common } from "../../../services/common";
import { ApiService } from '../../../core/api.service';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { Toast } from '../../../services/toast';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'vgipl-setThumbDevice',
  templateUrl: './setThumbDevice.component.html',
  providers: [ApiService, Spinner,Common]
})
export class SetThumbDeviceComponent implements OnInit {
  defaultChek: boolean = false;
  logInfo: ILogin;
  model: any;
  loginInfo: any;
  thumbData: any;
  INSTI_SUB_MST_ID: any;
  CLIENT_MST_ID: any;
  CORPORATE_FLAG: any = 'I';
  makeby: any;
  termCondContent: string;
  serialnumber: any;
  devicedetail: any;
  Thumb_Mst_Id: any = '';
  Thumb_Device_No: any = '';
  Thumb_Device_Dett: any = '';
  ThumbDevice_List: any;
  companyName: any;
  //Thumb_Device_Dett:any;
  CUST_THUMB_DET_ID: any;
  titleThumb: any;
  addNewTab: boolean = false;
  addNewDevBtn: boolean = false;
  disDevTab: boolean = true;
  editDevBtn: boolean = false;
  msgType: string = '';
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: this.msgType,
    closeOther: false,
    msg: ''
  }

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

  constructor(private apiService: ApiService, private common: Common, private dialog: MatDialog, private router: Router, private dataStorage: DataStorage,
    private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner) {
    // this.loginClass = "btn-login1";

    this.DeviceData('S', 'L');
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    $('#vpayBanner').hide();
    //$('#txtMobileNo')[0].focus();

  }
  selectScanner(item) {
    this.companyName = item.COMPANY_NAME;
    this.Thumb_Mst_Id = item.THUMB_MST_ID
  }

  AddNewThumbDevice() {
    this.addNewTab = true;
    this.disDevTab = false;
    this.editDevBtn = false;
    this.addNewDevBtn = true;
    this.titleThumb = "Set New Finger Print Device";
  }

  EditThumbDevice(item) {
    this.addNewTab = true;
    this.disDevTab = false;
    this.editDevBtn = true;
    this.addNewDevBtn = false;
    this.titleThumb = "Update Thumb Device";
    this.companyName = item.COMPANY_NAME;
    this.Thumb_Mst_Id = item.THUMB_MST_ID;
    this.Thumb_Device_No = item.THUMB_DEVICE_NO;
    this.Thumb_Device_Dett = item.THUMB_DEVICE_DET;
    this.CUST_THUMB_DET_ID = item.CUST_THUMB_DET_ID;
    this.defaultChek = item.DEFAULT_FLAG == 'Y' ? true : false;
  }

  DeleteThumbDevice(item) {
    this.companyName = item.COMPANY_NAME;
    this.Thumb_Device_No = item.THUMB_DEVICE_NO == null ? '' : item.THUMB_DEVICE_NO;
    this.CUST_THUMB_DET_ID = item.CUST_THUMB_DET_ID;
    if (!confirm('Do you want to remove this Device ' + this.companyName + '-' + this.Thumb_Device_No)) {
      return false;
    }
    else {
      this.DeviceData('D', 'R');
    }
  }

  DeviceData(pflag, flag) {
    var ThumbMstId; var ThumbDeviceNo;
    var ThumbDeviceDet; var CUSTTHUMBDETID;
    var Default_Flag;
    // N == New, U == Update ,D==Delete
    if (pflag == 'N' && flag == 'A') {
      if (this.Thumb_Mst_Id == '' || this.Thumb_Mst_Id == null) {
        // alert('Select Finger Print Device');
        this.message = "Select Finger Print Device.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.Thumb_Device_No == '') {
        // alert('Enter Finger Print Device Number');
        this.message = "Enter Finger Print Device Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      ThumbMstId = this.Thumb_Mst_Id;
      ThumbDeviceNo = this.Thumb_Device_No.toUpperCase();
      ThumbDeviceDet = this.Thumb_Device_Dett;
      CUSTTHUMBDETID = 0;
      Default_Flag = this.defaultChek
    }
    else if (pflag == 'U' && flag == 'E') {
      if (this.Thumb_Mst_Id == '' || this.Thumb_Mst_Id == null) {
        // alert('Select Finger Print Device');
        this.message = "Select Finger Print Device.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.Thumb_Device_No == '') {
        // alert('Enter Finger Print Device Number');
        this.message = "Enter Finger Print Device Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      ThumbMstId = this.Thumb_Mst_Id;
      ThumbDeviceNo = this.Thumb_Device_No == null ? '' : this.Thumb_Device_No.toUpperCase();
      ThumbDeviceDet = this.Thumb_Device_Dett == null ? '' : this.Thumb_Device_Dett;
      CUSTTHUMBDETID = this.CUST_THUMB_DET_ID == null ? '' : this.CUST_THUMB_DET_ID;
      Default_Flag = this.defaultChek
    }
    else if (pflag == 'D' && flag == 'R') {
      ThumbMstId = this.Thumb_Mst_Id;
      ThumbDeviceNo = this.Thumb_Device_No == null ? '' : this.Thumb_Device_No.toUpperCase();
      ThumbDeviceDet = this.Thumb_Device_Dett == null ? '' : this.Thumb_Device_Dett;
      CUSTTHUMBDETID = this.CUST_THUMB_DET_ID == null ? '' : this.CUST_THUMB_DET_ID;
    }

    this.spinner.show();
    var paramObj = {
      Client_Mst_ID: this.dataStorage.logInfo[0].CLIENT_MST_ID,
      // Default_Flag: Default_Flag,
      Default_Flag: this.defaultChek == true ? 'Y' : 'N',
      Client_Mst_Id: this.CLIENT_MST_ID,
      request_from: 'WB',
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      Flag: pflag,
      Thumb_Mst_Id: this.Thumb_Mst_Id,
      Thumb_Device_No: this.Thumb_Device_No.toUpperCase(),
      Thumb_Device_Det: this.Thumb_Device_Dett,
      login_user_id: this.dataStorage.logInfo[0].LOGIN_USER_ID,
      Insti_Sub_Mst_Id: this.dataStorage.logInfo[0].INSTI_SUB_MST_ID,
      CORPORATE_FLAG: this.dataStorage.logInfo[0].CORPORATE_FLAG,
      Corporate_Flag: this.dataStorage.logInfo[0].CORPORATE_FLAG,
      Cust_Thumb_Det_Id: CUSTTHUMBDETID
    }
    this.apiService.sendToServer<ICore>('/api/virtualpay/ThumbDeviceUpdate', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (pflag == 'S') {
          //bind data to select option
          this.thumbData = data.cursor1;
          if (data.cursor2.length > 0) {
            this.ThumbDevice_List = data.cursor2;
          }

        }
        else {
          //save record message
          if (pflag == 'N') {
            // alert('Finger Print  device Added Successfully');
            this.message = "Finger Print  device Added Successfully.";
            MessageBox.show(this.dialog, this.message, "");
          }
          else if (pflag == 'U') {
            // alert('Finger Print device Details updated Successfully');
            this.message = "Finger Print device Details updated Successfully.";
            MessageBox.show(this.dialog, this.message, "");
          }
          else if (pflag == 'D') {
            // alert('Finger Print device Remove Successfully');
            this.message = "Finger Print device Remove Successfully.";
            MessageBox.show(this.dialog, this.message, "");
          }

          // this.navController.setRoot(WelcomePage);
          this.clear();
          this.cancel();
          this.DeviceData('S', 'L');
        }
        
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


  clear() {
    this.Thumb_Mst_Id = '';
    this.Thumb_Device_No = '';
    this.companyName = '';
    this.Thumb_Device_Dett = '';

  }

  cancel() {
    this.clear();
    this.disDevTab = true;
    this.addNewTab = false;
  }
  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "20", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }


}
