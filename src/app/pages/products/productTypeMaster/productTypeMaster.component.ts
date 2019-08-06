import { Component, OnInit, AfterViewInit, DoCheck, Renderer2, ViewChild } from '@angular/core';

import { ApiService } from '../../../core/api.service';
import { ICore } from '../../../interface/core';
import { IPurchaseItem } from '../../../interface/saleItem';
import { ILogin } from '../../../interface/login';
import { ErrorHandler } from '../../../core/errorHandler';
import { DataStorage } from '../../../core/dataStorage';
import * as $ from 'jquery';
import { Toast } from '../../../services/toast';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { Common } from '../../../services/common';
import { Spinner } from '../../../services/spinner';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-productTypeMaster',
  templateUrl: './productTypeMaster.component.html',
  styleUrls: ['./productTypeMaster.component.scss'],
  providers: [ApiService, Spinner, Common]
})

export class ProductTypeMasterComponent implements OnInit {
  @ViewChild(AdminComponent) AdminComponent: AdminComponent;
  @ViewChild(dtp) dtp: dtp;
  logInfo: ILogin;
  DisplayMsg: string = '';
  msgshowhide: string = '';
  applicableDate: string = '';
  proCode: string = '';
  proCodeType: string = '';
  proCodeTypeDesc: string = '';
  PRODUCT_TYPE_CODE: string = '';
  titleProdType: string = '';
  productTypeDataArray: any;
  showAdd: string = 'col-md-4 show';
  showModify: string = 'hide col-md-4';
  PRO_TYPE_MST_ID: number = 0;
  showSubmitBtn: boolean = true;
  showUpdateBtn: boolean = false;
  showDeleteBtn: boolean = false;
  saveMode: string = 'A';  //A--add, M- modify, D- delete

  //dialog
  // title;
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

  constructor(private apiService: ApiService, private dialog: MatDialog, private dataStorage: DataStorage, private renderer2: Renderer2,
    private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, private common: Common) {

  }
  ngAfterViewInit() {
    //this.menuHide.hideMenu=true;
    //this.menuHide.toggleOpened();
  }
  ngDoCheck() {
    //this.AdminComponent.toggleOpened();
  }
  ngOnInit() {
    //this.AdminComponent.hideMenu=true;

    this.logInfo = this.dataStorage.logInfo;
    this.AddProd();

    // this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    // this.DeviceData();
    // this.showCollA = true;
    // this.aadharRemarks = this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME;
    // const txtAadhar1 = this.renderer2.selectRootElement('#txtAadhar1');
    // setTimeout(() => txtAadhar1.focus(), 0);
    // this.GetAADHARBANK();
  }


  DateTimeCtrl = function (Val1, Val2) {
    this.Call_MsgDiv('HIDE', '');
    this.SetControlValue = Val2;
    this.objdttm = {
      setoncontrol: Val2,
      mtype: Val1 == 'D' ? 'SET DATE' : 'SET TIME',
      ctrl: 'DTTMPC',
    }
    this.dtp.toggleDTTMcontrol(this.objdttm, this);
  }
  Call_MsgDiv(ShowHide, Msg) {
    if (ShowHide == 'SHOW')
      this.msgshowhide = '_show';
    if (ShowHide == 'HIDE')
      this.msgshowhide = '_hide';

    this.DisplayMsg = Msg;
  }

  CallBack = function (obj) {
    if (obj != null) {
      if (obj.SetControlValue == 'applicableDate')
        this.applicableDate = obj.mydate;
      // if (obj.SetControlValue == 'gstRegDate')
      //   this.gstRegDate = obj.mydate;
      // if (obj.SetControlValue == 'activestatusdate')
      //   this.activestatusdate = obj.mydate;
    }
  }
  validation() {
    if (this.PRODUCT_TYPE_CODE.trim().length === 0) {
      alert('Please Enter Product Type Code');
      if (this.saveMode === 'N') {
        const txtproductCode = this.renderer2.selectRootElement('#txtproductCode');
        setTimeout(() => txtproductCode.focus(), 0);
      }
      else {
        const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
        setTimeout(() => txtMproductCode.focus(), 0);
      }
      return false;
    }
    else if (this.applicableDate.trim().length === 0) {
      alert('Please Enter Applicable Date.');
      const txtApplicableDate = this.renderer2.selectRootElement('#txtApplicableDate');
      setTimeout(() => txtApplicableDate.focus(), 0);
      return false;
    }
    else if (this.proCodeType.trim().length === 0) {
      alert('Please Enter Product Type Name.');
      const txtProCodeType = this.renderer2.selectRootElement('#txtProCodeType');
      setTimeout(() => txtProCodeType.focus(), 0);
      return false;
    }
    return true;
  }
  submit() {
    if (!this.validation())
      return false;
    let dataObj: IProductTypeMaster = {
      "_id": 0,
      "CLIENT_MST_ID": parseInt(this.logInfo[0].CLIENT_MST_ID),
      "APPLICABLE_DATE": this.applicableDate,
      "PRODUCT_TYPE_CODE": this.PRODUCT_TYPE_CODE,
      "PRODUCT_TYPE_NAME": this.proCodeType,
      "PRODUCT_TYPE_DESC": this.proCodeTypeDesc,
      "ACTIVE_FLAG": "Y",
      "DELETE_FLAG": "N"
    }
    let pageObj = this;
    if (this.saveMode == 'M' || this.saveMode == 'D') {
      if (this.saveMode == 'D') {
        if (!confirm("You want to delete this record?"))
          return false;
        else {
          dataObj.ACTIVE_FLAG = 'N';
          dataObj.DELETE_FLAG = 'Y';
        }
      }
      dataObj._id = this.PRO_TYPE_MST_ID;
      this.spinner.show();
      this.apiService.sendToServer<ICore>('/api/product/updateProductType', { data: dataObj }, this).subscribe(data => {
        if (data && data.msg === 'Success') {
          if (pageObj.saveMode == 'M') {
            this.message = "Record Modified.";
            MessageBox.show(this.dialog, this.message, "");
          }
          else {
            this.message = "Record Deleted.";
            MessageBox.show(this.dialog, this.message, "");
          }
          pageObj.clear();
          const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
          setTimeout(() => txtMproductCode.focus(), 0);
        }
        else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
        }
        pageObj.spinner.hide();
      }, err => {
        pageObj.spinner.hide();
        pageObj.errorHandler.handlePageError(err);
      });
    }
    else {
      pageObj.spinner.show();
      this.apiService.sendToServer<ICore>('/api/product/insertProductType', { data: dataObj }, this).subscribe(data => {
        if (data && data.msg === 'Success') {
          alert("Record saved successfully.");
          pageObj.clear();
        }
        else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
        }
        pageObj.spinner.hide();
      }, err => {
        pageObj.spinner.hide();
        pageObj.errorHandler.handlePageError(err);
      });
    }
  }

  getProductType() {
    let pageObj = this;
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/product/getProductType', { data: { CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }, this).subscribe(data => {
      if (data && data.msg === 'Success') {
        this.productTypeDataArray = data.result;
      } else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
      this.spinner.hide();
    }, err => {
      pageObj.spinner.hide();
      pageObj.errorHandler.handlePageError(err);
    });
  }

  clear() {
    this.applicableDate = '';
    this.PRODUCT_TYPE_CODE = '';
    this.proCodeTypeDesc = '';
    this.proCodeType = '';
    const txtproductCode = this.renderer2.selectRootElement('#txtproductCode');
    setTimeout(() => txtproductCode.focus(), 0);
  }


  EditProd() {
    this.clear();
    this.showDeleteBtn = false;
    this.showSubmitBtn = false;
    this.showUpdateBtn = true;
    this.showModify = 'show col-md-4';
    this.showAdd = 'col-md-4 hide ';
    this.saveMode = 'M';
    this.titleProdType = 'Edit Product Type';
    $('.disabledbutton').prop("disabled", false);
    this.getProductType();
    const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
    setTimeout(() => txtMproductCode.focus(), 0);

  }
  getValue(obj) {
    this.PRODUCT_TYPE_CODE = obj.PRODUCT_TYPE_CODE;
    this.applicableDate = obj.APPLICABLE_DATE;
    this.proCodeType = obj.PRODUCT_TYPE_NAME;
    this.proCodeTypeDesc = obj.PRODUCT_TYPE_DESC;
    this.PRO_TYPE_MST_ID = obj._id;
  }
  DelProd() {
    this.clear();
    this.showDeleteBtn = true;
    this.showSubmitBtn = false;
    this.showUpdateBtn = false;
    this.showModify = 'show col-md-4';
    this.showAdd = 'col-md-4 hide';
    this.saveMode = 'D';
    this.titleProdType = 'Delete Product Type';
    $('.disabledbutton').prop("disabled", true);
    const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
    setTimeout(() => txtMproductCode.focus(), 0);
  }

  AddProd() {
    this.clear();
    this.showDeleteBtn = false;
    this.showSubmitBtn = true;
    this.showUpdateBtn = false;
    this.showAdd = 'col-md-4 show';
    this.showModify = 'hide col-md-4';
    this.saveMode = 'N';
    this.titleProdType = 'Add Product Type';
    $('.disabledbutton').prop("disabled", false);
    $(document).ready(function () {
      $('.prodMenuBtn').click(function () {
        $('.prodMenuBtn').removeClass("active");
        $(this).addClass("active");
      });
    });


  }






}
interface IProductTypeMaster {
  _id: number;
  CLIENT_MST_ID: number;
  APPLICABLE_DATE: string;
  PRODUCT_TYPE_CODE: string;
  PRODUCT_TYPE_NAME: string;
  PRODUCT_TYPE_DESC: string;
  ACTIVE_FLAG: string;
  DELETE_FLAG: string;
}