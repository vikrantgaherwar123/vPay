import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { ICore } from '../../../interface/core';
import { ILogin } from '../../../interface/login';
import { ErrorHandler } from '../../../core/errorHandler';
import { DataStorage } from '../../../core/dataStorage';
import * as $ from 'jquery';
import { Toast } from '../../../services/toast';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { Common } from '../../../services/common';
import { Spinner } from '../../../services/spinner';
// import { InputTypeDirective } from '../../../shared/directive/inputType/input-type.directive';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { ProductService } from '../product.service';

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-productMaster',
  templateUrl: './productMaster.component.html',
  styleUrls: ['./productMaster.component.scss'],
  providers: [ApiService, Spinner, Common, ProductService]
})

export class ProductMasterComponent implements OnInit {
  @ViewChild(AdminComponent) AdminComponent: AdminComponent;
  @ViewChild(dtp) dtp: dtp;
  logInfo: ILogin;
  DisplayMsg: string = '';
  msgshowhide: string = '';
  saveMode: string = '';
  PRODUCT_TYPE_NAME: string = '';

  PRO_TYPE_MST_ID: number = 0;
  PRO_MST_ID: number = 0;
  productTypeDataArray: any;
  productListDataArray: any;
  appDate: string = '';
  productCode: string = '';
  productName: string = '';
  proCodeDesc: string = '';
  productUnit: string = '';
  productQuantity: number = 0;
  productRate: number = 0;
  taxPercent: number = 0;
  hsnCode: string = '';
  showProdCode: string = 'col-md-4 show';
  showMProductCode: string = 'col-md-4 hide';
  title: string = '';
  imgSize: number = 30; //in kb
  productImage: string = "/assets/images/image.png";
  imageSize: string = " Size of file should be between 5kb–30kb";
  // productImage: any;
  Math: any;
  ItemsAll: any;
  Items: any;

  showSubmitBtn: boolean = true;
  showUpdateBtn: boolean = false;
  showDeleteBtn: boolean = false;

  //dialog
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
    private productService: ProductService, private elementRef: ElementRef, private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, private common: Common) {

  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    let pageObj = this;
    pageObj.spinner.show();
    this.productService.getProductType({ data: { CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }).subscribe(data => {
      if (data && data.msg === 'Success') {
        pageObj.productTypeDataArray = data.result;
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
    this.AddProd();
    $(document).ready(function () {
      $('.prodMenuBtn').click(function () {
        $('.prodMenuBtn').removeClass("active");
        $(this).addClass("active");
      });
    });
  }
  /**
   * 
   * @param obj 
   */
  getValue(obj) {
    this.PRODUCT_TYPE_NAME = obj.PRODUCT_TYPE_NAME;
    this.PRO_TYPE_MST_ID = obj._id;
    this.productListDataArray = null;
    this.getProdMastHelp();
    if (this.saveMode == 'M' || this.saveMode == 'D') {
      const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
      setTimeout(() => txtMproductCode.focus(), 0);
    } else {
      const txtProductCode = this.renderer2.selectRootElement('#txtProductCode');
      setTimeout(() => txtProductCode.focus(), 0);
    }
    return false;
  }
  onChangeSetProdType() {
    let pageObj = this;
    pageObj.clear();
    this.productListDataArray = null;
    let selectedProdType = this.productTypeDataArray.filter(a => a.PRODUCT_TYPE_NAME.trim().toLowerCase() == pageObj.PRODUCT_TYPE_NAME.trim().toLowerCase());
    if (!selectedProdType || (selectedProdType && selectedProdType.length == 0)) {
      this.message = "Please select Product Type.";
      MessageBox.show(this.dialog, this.message, "");
      pageObj.PRODUCT_TYPE_NAME = '';
      pageObj.PRO_TYPE_MST_ID = 0;
      const txtProdType = this.renderer2.selectRootElement('#txtProdType');
      setTimeout(() => txtProdType.focus(), 0);
      return false;
    }
    pageObj.PRO_TYPE_MST_ID = selectedProdType[0]._id;
    this.getProdMastHelp();
    if (this.saveMode == 'M' || this.saveMode == 'D') {
      const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
      setTimeout(() => txtMproductCode.focus(), 0);
    } else {
      const txtProductCode = this.renderer2.selectRootElement('#txtProductCode');
      setTimeout(() => txtProductCode.focus(), 0);
    }
    return false;
  }
  onChangeProdCode() {
    let pageObj = this;
    let selectedProd = this.productListDataArray.filter(a => a.PRODUCT_CODE.trim().toLowerCase() == pageObj.productCode.trim().toLowerCase());
    let tmp = this.productCode;
    pageObj.clear();
    if (!selectedProd || selectedProd.length == 0) {
      pageObj.PRO_MST_ID = 0;
      if (this.saveMode == 'M' || this.saveMode == 'D') {
        this.message = "Please Enter Product Code.";
        MessageBox.show(this.dialog, this.message, "");
        pageObj.productCode = '';
        const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
        setTimeout(() => txtMproductCode.focus(), 0);
        return false;
      } else {
        this.productCode = tmp;
        const txtAppDate = this.renderer2.selectRootElement('#txtAppDate');
        setTimeout(() => txtAppDate.focus(), 0);
        return false;
      }
    }
    else {
      if (this.saveMode == 'M' || this.saveMode == 'D') {
        pageObj.productCode = selectedProd[0].PRODUCT_CODE;
        pageObj.PRO_MST_ID = selectedProd[0]._id;
        this.getProdMaster();
      } else {
        this.message = "This Product Code is existing. Please Enter different Code.";
        MessageBox.show(this.dialog, this.message, "");
        pageObj.productCode = '';
        pageObj.PRO_MST_ID = 0;
        const txtMproductCode = this.renderer2.selectRootElement('#txtProductCode');
        setTimeout(() => txtMproductCode.focus(), 0);
        return false;
      }
    }
  }

  getProdMaster() {
    let pageObj = this;
    pageObj.spinner.show();
    this.productService.getProductMaster({ singleRecord: true, data: { _id: pageObj.PRO_MST_ID, PRO_TYPE_MST_ID: pageObj.PRO_TYPE_MST_ID, CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }).subscribe(data => {
      if (data && data.msg === 'Success') {
        this.appDate = data.result[0].APPLICABLE_DATE;
        this.productName = data.result[0].PRODUCT_NAME;
        this.proCodeDesc = data.result[0].PRODUCT_DESCRIPTION;
        this.productUnit = data.result[0].PRO_UNIT_MST_ID;
        this.productQuantity = data.result[0].PRO_QUANTITY;
        this.productRate = data.result[0].PRO_RATE;
        this.taxPercent = data.result[0].TAX_PERCENT;
        this.hsnCode = data.result[0].HSN_CODE;
        this.productImage = 'assets/images/product/' + data.result[0].PRODUCT_IMAGE;
        //this.prodImg = "/assets/images/image.png";
        const txtAppDate = this.renderer2.selectRootElement('#txtAppDate');
        setTimeout(() => txtAppDate.focus(), 0);
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

  getProdMastHelp() {
    let pageObj = this;
    pageObj.spinner.show();
    this.apiService.sendToServer<ICore>('/api/product/getProductMasterHelp', { data: { PRO_TYPE_MST_ID: this.PRO_TYPE_MST_ID, CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }, this).subscribe(data => {
      pageObj.spinner.hide();
      if (data && data.msg === 'Success') {
        this.productListDataArray = data.result;
        this.ItemsAll = data.result;
        this.Items = data.result;
      } else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      pageObj.spinner.hide();
      pageObj.errorHandler.handlePageError(err);
    });
  }

  getProdValue(obj) {
    this.clear();
    this.productCode = obj.PRODUCT_CODE;
    this.PRO_MST_ID = obj._id;
    this.getProdMaster();
    //this.PRO_TYPE_MST_ID = 0;
  }
  /**
   *  Image array to base64 string
   */
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    var imageArray = window.btoa(binary);
    return 'data:image/png;base64,' + imageArray;

  }
  /**
   * returns bytes in kb
   */
  bytesToSize(bytes) {

    this.Math = Math;
    let sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 0;
    var i = parseInt(this.Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }
  /**
   * Select Product Image file
   */
  fileSelected(fileInput: any, obj, elmFlag) {
    let dataURL = '';
    let self = this;
    let imgElm = obj.elementRef.nativeElement.querySelector('#imgId' + elmFlag);
    let imgId = imgElm.id;
    let tmpImgSize = obj.bytesToSize(fileInput.currentTarget.files[0].size);
    if (tmpImgSize.indexOf('MB') > -1 || parseFloat(tmpImgSize) > this.imgSize) {

      imgElm.src = "assets/images/image.png";
      this.imageSize = 'Your file size must less than 30kb';
      return false;
    }

    let reader = new FileReader();
    let canvas = document.createElement("canvas");
    let canvasContext = canvas.getContext("2d");
    this.imageSize = 'File Uploaded Successfully.';
    this.productImage = null;

    imgElm.onload = function () {
      //Set canvas size is same as the picture
      canvas.width = 250;
      canvas.height = 200;
      // draw image into canvas element
      canvasContext.drawImage(imgElm, 0, 0, canvas.width, canvas.height);
      // get canvas contents as a data URL (returns png format by default)
      dataURL = canvas.toDataURL();
      self.productImage = dataURL;
    }

    reader.onload = function (e: any) {
      imgElm.src = e.target.result;
    }
    reader.readAsDataURL(fileInput.target.files[0]);
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
      if (obj.SetControlValue == 'appDate')
        this.appDate = obj.mydate;
      // if (obj.SetControlValue == 'gstRegDate')
      //   this.gstRegDate = obj.mydate;
      // if (obj.SetControlValue == 'activestatusdate')
      //   this.activestatusdate = obj.mydate;
    }
  }

  validation() {
    if (this.PRODUCT_TYPE_NAME.trim().length === 0) {
      this.message = "Please select Product Type Name.";
      MessageBox.show(this.dialog, this.message, "");
      const txtProductCode = this.renderer2.selectRootElement('#txtProductCode');
      setTimeout(() => txtProductCode.focus(), 0);
      return false;
    }
    else if (this.productCode.trim().length === 0) {
      this.message = "Please Enter Product Code.";
      MessageBox.show(this.dialog, this.message, "");
      if (this.saveMode === 'N') {
        const txtProductCode = this.renderer2.selectRootElement('#txtProductCode');
        setTimeout(() => txtProductCode.focus(), 0);
      }
      else {
        const txtMproductCode = this.renderer2.selectRootElement('#txtMproductCode');
        setTimeout(() => txtMproductCode.focus(), 0);
      }
      return false;
    }
    else if (this.appDate.trim().length === 0) {
      this.message = "Please Enter Applicable Date.";
      MessageBox.show(this.dialog, this.message, "");
      const txtAppDate = this.renderer2.selectRootElement('#txtAppDate');
      setTimeout(() => txtAppDate.focus(), 0);
      return false;
    }
    else if (this.productName.trim().length === 0) {
      this.message = "Please Enter Product Name.";
      MessageBox.show(this.dialog, this.message, "");
      const txtProductName = this.renderer2.selectRootElement('#txtProductName');
      setTimeout(() => txtProductName.focus(), 0);
      return false;
    }
    else if (this.productUnit.trim().length === 0) {
      this.message = "Please Enter Product Name.";
      MessageBox.show(this.dialog, this.message, "");
      const txtProductUnit = this.renderer2.selectRootElement('#txtProductUnit');
      setTimeout(() => txtProductUnit.focus(), 0);
      return false;
    }
    else if (this.productRate.toString().trim().length === 0) {
      this.message = "Please Enter Product Name.";
      MessageBox.show(this.dialog, this.message, "");
      const txtProductRate = this.renderer2.selectRootElement('#txtProductRate');
      setTimeout(() => txtProductRate.focus(), 0);
      return false;
    }
    else if (this.productQuantity.toString().trim().length === 0) {
      this.message = "Please Enter Product Quantity.";
      MessageBox.show(this.dialog, this.message, "");
      const txtProductQuantity = this.renderer2.selectRootElement('#txtProductQuantity');
      setTimeout(() => txtProductQuantity.focus(), 0);
      return false;
    }
    else if (this.taxPercent.toString().trim().length === 0) {
      this.message = "Please Enter Tax Percent.";
      MessageBox.show(this.dialog, this.message, "");
      const txtTaxPercent = this.renderer2.selectRootElement('#txtTaxPercent');
      setTimeout(() => txtTaxPercent.focus(), 0);
      return false;
    }
    return true;
  }
  /**
   * submit modify delete
   */
  submit() {
    if (!this.validation())
      return false;
    //image for upload----------
    let fileProductImage: HTMLInputElement = this.elementRef.nativeElement.querySelector('#fileProductImage');
    let prodImageId = this.productCode + '_' + this.logInfo[0].CLIENT_MST_ID + '.png';
    const formData: any = new FormData();
    formData.append(prodImageId, fileProductImage.files.item(0));
    //---------------------------
    let sendData = {
      "_id": 0,
      "PRO_TYPE_MST_ID": this.PRO_TYPE_MST_ID,
      "CLIENT_MST_ID": this.logInfo[0].CLIENT_MST_ID,
      "CORPORATE_FLAG": this.logInfo[0].CORPORATE_FLAG,
      "PRODUCT_CODE": this.productCode,
      "PRODUCT_NAME": this.productName,
      "PRODUCT_DESCRIPTION": this.proCodeDesc,
      "PRO_UNIT_MST_ID": this.productUnit,
      "HSN_CODE": this.hsnCode,
      "PRODUCT_IMAGE": prodImageId,
      //"PRODUCT_IMAGE": this.productImage,
      "PRO_QUANTITY": this.productQuantity,
      "PRO_RATE": this.productRate,
      "TAX_PERCENT": this.taxPercent,
      "ACTIVE_FLAG": "Y",
      "DELETE_FLAG": "N",
      "APPLICABLE_DATE": this.appDate
    }
    let pageObj = this;
    if (this.saveMode == 'M' || this.saveMode == 'N') {
      pageObj.spinner.show();
      this.apiService.uploadToServer<ICore>('/api/product/uploadProductImage', formData, this).subscribe(
        data => {
          pageObj.spinner.hide();
          if (data && data.msg === 'Success') {
            //call next function
            this.saveProductData(sendData, pageObj);
          }
        });
    } else {
      this.saveProductData(sendData, pageObj);
    }
  }

  /**
   * saveProductData
   * @param sendData 
   * @param pageObj 
   */
  saveProductData(sendData, pageObj) {
    if (pageObj.saveMode == 'M' || pageObj.saveMode == 'D') {
      if (pageObj.saveMode == 'D') {
        if (!confirm("You want to delete this record?"))
          return false;
        else {
          sendData.ACTIVE_FLAG = 'N';
          sendData.DELETE_FLAG = 'Y';
        }
      }
      pageObj.spinner.show();
      sendData._id = pageObj.PRO_MST_ID;
      this.apiService.sendToServer<ICore>('/api/product/updateProductMaster', { data: sendData }, pageObj).subscribe(data => {
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
          pageObj.PRODUCT_TYPE_NAME = '';
          pageObj.PRO_TYPE_MST_ID = 0;
          const txtProdType = this.renderer2.selectRootElement('#txtProdType');
          setTimeout(() => txtProdType.focus(), 0);
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
    } else {
      //save product data
      pageObj.spinner.show();
      this.apiService.sendToServer<ICore>('/api/product/insertProductMaster', { data: sendData }, this).subscribe(data => {
        if (data && data.msg === 'Success') {
          this.message = "Product Save Successfully.";
          MessageBox.show(this.dialog, this.message, "");
          pageObj.clear();
          const txtProductCode = this.renderer2.selectRootElement('#txtProductCode');
          setTimeout(() => txtProductCode.focus(), 0);
        } else {
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


  EditProd() {
    this.showSubmitBtn = false;
    this.showUpdateBtn = true;
    this.showDeleteBtn = false;
    this.showProdCode = 'col-md-4 hide';
    this.showMProductCode = 'col-md-4 show';
    this.title = 'Edit Product';
    this.saveMode = 'M';
    this.clear();
    this.PRODUCT_TYPE_NAME = '';
    this.PRO_TYPE_MST_ID = 0;
    $('.disableInput').prop("disabled", false);
  }

  DelProd() {
    this.showSubmitBtn = false;
    this.showUpdateBtn = false;
    this.showDeleteBtn = true;
    this.showProdCode = 'col-md-4 hide';
    this.showMProductCode = 'col-md-4 show';
    this.title = 'Delete Product';
    this.saveMode = 'D';
    this.clear();
    this.PRODUCT_TYPE_NAME = '';
    this.PRO_TYPE_MST_ID = 0;
    $('.disableInput').prop("disabled", true);
  }

  AddProd() {
    this.showSubmitBtn = true;
    this.showUpdateBtn = false;
    this.showDeleteBtn = false;
    this.showProdCode = 'col-md-4 show';
    this.showMProductCode = 'col-md-4 hide';
    this.title = 'Add Product';
    this.saveMode = 'N';
    this.clear();
    this.PRODUCT_TYPE_NAME = '';
    this.PRO_TYPE_MST_ID = 0;
    $('.disableInput').prop("disabled", false);
  }

  clear() {
    this.appDate = '';
    this.productCode = '';
    this.productName = '';
    this.proCodeDesc = '';
    this.productUnit = '';
    this.productQuantity = 0;
    this.productRate = 0;
    this.taxPercent = 0;
    this.hsnCode = '';
    //this.productImage = null;
    this.productImage = "/assets/images/image.png";
    this.imageSize = 'Your file size must less than 30kb';
    const txtProdType = this.renderer2.selectRootElement('#txtProdType');
    setTimeout(() => txtProdType.focus(), 0);
  }
}