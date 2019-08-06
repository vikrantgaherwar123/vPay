import { Component, OnInit, AfterViewInit, DoCheck, Renderer2, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { ApiService } from '../../../core/api.service';
import { ICore } from '../../../interface/core';
import { IPurchaseItem } from '../../../interface/saleItem';
import { IBillDetail } from '../../../interface/payment';
import { IAadhar } from '../../../interface/aadhar';
import { ILogin } from '../../../interface/login';
import { ErrorHandler } from '../../../core/errorHandler';
import { DataStorage } from '../../../core/dataStorage';
import * as xml2js from 'xml2js';
import * as screenfull from 'screenfull';
import * as $ from 'jquery';
import { Toast } from '../../../services/toast';
import { Common } from '../../../services/common';
import { Spinner } from '../../../services/spinner';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Observable } from 'rxjs/Observable';
import { AadharPayment } from '../../../services/paymentServices/aadharPayment';
import { QrPayment } from '../../../services/paymentServices/qrPayment';
import { PaymentGateway } from '../../../services/paymentServices/paymentGateway';
import { PaymentOptionComponent } from '../../../shared/component/paymentOption/paymentOption.component';
import { UpiPayment } from '../../../services/paymentServices/upiPayment';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-productSale',
  templateUrl: './productSale.component.html',
  styleUrls: ['./productSale.component.scss'],
  animations: [
    trigger('myAwesomeAnimation', [
      // state('small', style({
      //     transform: 'scale(1)',
      // })),
      // state('large', style({
      //     transform: 'scale(1.2)',
      // })),
      // transition('small => large', animate('100ms ease-in')),
      // transition('small <=> large', animate('300ms ease-in', style({
      //   transform: 'translateY(40px)'
      // }))),
      transition('small <=> large', animate('300ms ease-in', keyframes([
        style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
        style({ opacity: 1, transform: 'translateY(35px)', offset: 0.5 }),
        style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
      ]))),
    ]),
  ],
  providers: [ApiService, Spinner, Common, AadharPayment, QrPayment, PaymentGateway]
})

export class ProductSaleComponent implements OnInit {
  @ViewChild(AdminComponent) AdminComponent: AdminComponent;
  @ViewChild(PaymentOptionComponent) payOption: PaymentOptionComponent;
  state: string = 'small';
  billDetailObj: IBillDetail;
  showPaymentOption = false;
  scrollDCallback;
  scrollDDCallback;
  scrollLCallback;
  show: boolean = false;
  getSingleRecord: Boolean = false;
  termCondContent: string;
  mCust: string;
  resultMessage: string = '';
  logInfo: ILogin;
  code: number;
  msg: string = "";
  data: Array<any>;
  productBillDataArray: any;
  TRAN_DET_ID: string = '';
  purchaseItemArray: Array<IPurchaseItem> = new Array<IPurchaseItem>();
  showBill: string = "hide transform";
  showOverlay: string = "hide";
  TCchek: boolean = true;
  mobileNo: number;
  customerName: string = '';
  itemBackground: string = '';
  totalAmount: number = 0;
  totalProduct: number = 0;
  totalQty: number = 0;
  totalTax: number = 0;
  productTypeDataArray: any;
  showProductTypeArray: any;
  showTempProductTypeArray: any;
  showProdTypeSliceNo: number = 2;
  showProdTypeSliceCounter: number = 0;
  showViewAllProdWOType = 'hide showProductBox';
  prodMasterAllFetchedDataArray: Array<any> = new Array<any>();
  productMasterDataArray: Array<any> = new Array<any>();
  tempProdMasterDataArray: Array<any> = new Array<any>();
  PRODUCT_TYPE_NAME: string = "";
  PRO_TYPE_MST_ID: number = 0;
  selectedProdTypeId: number = 0;
  currentPage = 1;
  addedqty: number = 0;
  showPayList: boolean = false;
  billNo: string = '';
  businessName: string = '';
  showProdList: string = 'show';
  showAadharPay: string = 'hide';
  showQrPay: string = 'hide';
  productTranId: number = 0;
  showPaymentMode: boolean = false;
  showVerify: boolean = true;
  ShowBillNo: boolean = false;
  showallProdwithType: string = 'show showProductBox';
  ProdTypeName: string = '';
  ProdTypeId: any;
  DataListArray: any;
  /*
  *aadhar Variable
  */
  aadharNo1Pay: string = '';
  aadharNo2Pay: string = '';
  aadharNo3Pay: string = '';
  aadhar: string = '';
  aadharBankList = null;
  bankCodePay: string = '';
  bankNamePay: string = '';
  amountPay: string = '';
  billNumberPay: string = '';
  custGSTNoPay: string = '';
  aadharRemarksPay: string = '';
  rrn: string = '';

  showOtherInfo: boolean = false;
  showStatusBox = false;
  showAadharInstallInfo: boolean = false;
  filterProdType = {
    propertyName: 'PRO_TYPE_MST_ID',
    propertyValue: 0
  }
  // QR veriable
  value: string = 'Techiediaries';
  QRFlag: any = false;
  qrValue: any;
  viewDetail: boolean = false;
  showAadharform = '';

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

  constructor(private apiService: ApiService, private dialog: MatDialog, private dataStorage: DataStorage, private renderer2: Renderer2,
    private errorHandler: ErrorHandler, private aadharPayment: AadharPayment, private paymentGateway: PaymentGateway,
    private qrPayment: QrPayment, private toast: Toast, private spinner: Spinner, private common: Common) {

  }
  ngAfterViewInit() {
    /**
     * On: focus blur => Floating label
     * Based on http://jsfiddle.net/RyanWalters/z9ymd852/
     */
    // $('.is-floating-label input, .is-floating-label textarea').on('focus blur', function (e) {
    //   $(this).parents('.is-floating-label').toggleClass('is-focused', (e.type === 'focus' || this.value.length > 0));
    // }).trigger('blur');


  }

  // onSwipe(evt, productTypeId) {
  //   const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : ''
  //   if (x == 'right') {
  //     this.getItems(productTypeId);
  //   }

  // }

  async getItems(scrollProdTypeId) {
    if (!screenfull.isFullscreen)
      screenfull.toggle();
    let pageObj = this;
    let tmp = this.productMasterDataArray.filter(a => a.PRO_TYPE_MST_ID == scrollProdTypeId);
    await this.getProduct(tmp[tmp.length - 1]._id, scrollProdTypeId - 1, scrollProdTypeId + 1, undefined);
    pageObj.productMasterDataArray = pageObj.productMasterDataArray.concat(pageObj.tempProdMasterDataArray);
    pageObj.prodMasterAllFetchedDataArray = pageObj.prodMasterAllFetchedDataArray.concat(pageObj.tempProdMasterDataArray);
    pageObj.tempProdMasterDataArray = new Array<any>();
    return Observable.of(null);
  }
  async getAllItems() {
    if (!screenfull.isFullscreen)
      screenfull.toggle();
    let pageObj = this;
    let tmp = this.prodMasterAllFetchedDataArray.filter(a => a.PRO_TYPE_MST_ID == this.ProdTypeId);
    await this.getProduct(tmp[tmp.length - 1]._id, this.ProdTypeId - 1, this.ProdTypeId + 1, 12);
    pageObj.productMasterDataArray = pageObj.productMasterDataArray.concat(pageObj.tempProdMasterDataArray);
    pageObj.prodMasterAllFetchedDataArray = pageObj.prodMasterAllFetchedDataArray.concat(pageObj.tempProdMasterDataArray);
    pageObj.tempProdMasterDataArray = new Array<any>();
    return Observable.of(null);
  }
  processItem = (data) => {
    debugger;
    if (data && data.msg === 'Success') {

      this.tempProdMasterDataArray = this.tempProdMasterDataArray.concat(data.result);
      this.productMasterDataArray = this.productMasterDataArray.concat(this.tempProdMasterDataArray);
      this.prodMasterAllFetchedDataArray = this.prodMasterAllFetchedDataArray.concat(this.tempProdMasterDataArray);
      this.tempProdMasterDataArray = null;
      this.tempProdMasterDataArray = new Array<any>();
      //this.currentPage = data.result[data.result.length - 1]._id;
      //this.productMasterDataArray = this.productMasterDataArray.concat(data.result);
    }
  }

  async getStories() {
    if (!screenfull.isFullscreen)
      screenfull.toggle();
    let pageObj = this;
    if (this.productTypeDataArray) {
      let k = this.productTypeDataArray.length - this.showProdTypeSliceCounter;
      if (k > 0) {
        this.showTempProductTypeArray = this.productTypeDataArray.slice(this.showProdTypeSliceCounter, this.showProdTypeSliceCounter + this.showProdTypeSliceNo);
      } else {
        return Observable.of(null);
      }
      this.showProdTypeSliceCounter += this.showProdTypeSliceNo;
      this.showProductTypeArray = this.showProductTypeArray.concat(this.showTempProductTypeArray);
      let i = 0;
      for (i; i < this.showTempProductTypeArray.length; i++) {
        await this.getProduct(0, this.showTempProductTypeArray[i]._id - 1, this.showTempProductTypeArray[i]._id + 1, undefined);
      }
      pageObj.productMasterDataArray = pageObj.productMasterDataArray.concat(pageObj.tempProdMasterDataArray);
      pageObj.prodMasterAllFetchedDataArray = pageObj.prodMasterAllFetchedDataArray.concat(pageObj.tempProdMasterDataArray);
      pageObj.tempProdMasterDataArray = new Array<any>();
      return Observable.of(null);
    }
    else {
      return Observable.of(null);
    }

  }
  processData = (data) => {
    debugger;
    if (data && data.msg === 'Success') {

      this.tempProdMasterDataArray = this.tempProdMasterDataArray.concat(data.result);
      this.productMasterDataArray = this.productMasterDataArray.concat(this.tempProdMasterDataArray);
      this.prodMasterAllFetchedDataArray = this.prodMasterAllFetchedDataArray.concat(this.tempProdMasterDataArray);
      this.tempProdMasterDataArray = null;
      this.tempProdMasterDataArray = new Array<any>();
      //this.currentPage = data.result[data.result.length - 1]._id;
      //this.productMasterDataArray = this.productMasterDataArray.concat(data.result);
    }
  }
  onScroll() {
    // console.log("scrolled!!");
  }
  onScrollUp() {
    // console.log("scrolled up!!");
  }
  prevProd(productType) {
    //$('.'+productType._id).scrollLeft(0);
    let $scroll = $('.' + productType._id);
    let scrollWidth = $scroll[0].scrollWidth;
    let offsetWidth = $scroll[0].offsetWidth;
    let scrollLeft = $scroll.scrollLeft();
    $scroll.scrollLeft(scrollLeft - offsetWidth);
    // let tmp = this.productMasterDataArray.filter(a => a.PRO_TYPE_MST_ID == productType._id);
    // if (tmp[0]._id == 1) return false;

    // let tmpArray = this.prodMasterAllFetchedDataArray.filter(a => a.PRO_TYPE_MST_ID == productType._id && a._id < tmp[0]._id);
    // if (tmpArray && tmpArray.length > 0) {
    //   this.productMasterDataArray = this.productMasterDataArray.filter(a => a.PRO_TYPE_MST_ID != productType._id);
    //   this.productMasterDataArray = this.productMasterDataArray.concat(tmpArray.slice(tmpArray.length - 4));
    // }

    if (this.purchaseItemArray && this.purchaseItemArray.length > 0) {
      let i = 0;
      let tempProductMasterData;
      setTimeout(() => {
        for (i; i < this.purchaseItemArray.length; i++) {
          tempProductMasterData = this.productMasterDataArray.filter(product => product._id == this.purchaseItemArray[i].itemId);
          if (tempProductMasterData && tempProductMasterData.length > 0) {
            let $item: any;
            let $itemD: any;
            // if (this.viewDetail)
            $itemD = $('#cntDivD' + this.purchaseItemArray[i].itemId);
            // else
            $item = $('#cntDiv' + this.purchaseItemArray[i].itemId);

            $itemD.text(this.purchaseItemArray[i].qty);
            $item.text(this.purchaseItemArray[i].qty);

            let $redCountDivD = $itemD.parent().parent().prev();
            let $redCountDiv = $item.parent().parent().prev();
            $redCountDiv.text(this.purchaseItemArray[i].qty);
            $redCountDivD.text(this.purchaseItemArray[i].qty);
            $redCountDiv.show();
            $redCountDivD.show();
            $redCountDivD.parent().addClass('purchaseBg');
            $redCountDiv.parent().addClass('purchaseBg');
          }
        }
      }, 500);
    }

  }
  async nextProd(productType) {
    let tmp = this.productMasterDataArray.filter(a => a.PRO_TYPE_MST_ID == productType._id);
    this.tempProdMasterDataArray = this.prodMasterAllFetchedDataArray.filter(a => a._id > tmp[tmp.length - 1]._id && a.PRO_TYPE_MST_ID == productType._id);
    if (this.tempProdMasterDataArray && this.tempProdMasterDataArray.length > 0) {
      this.setPurchaseItemIconValue();
    } else {
      await this.getProduct(tmp[tmp.length - 1]._id, productType._id - 1, productType._id + 1, 4);
      if (this.tempProdMasterDataArray && this.tempProdMasterDataArray.length > 0) {
        this.prodMasterAllFetchedDataArray = this.prodMasterAllFetchedDataArray.concat(this.tempProdMasterDataArray);
      }
    }

    if (this.tempProdMasterDataArray && this.tempProdMasterDataArray.length > 0) {
      //this.prodMasterAllFetchedDataArray = this.prodMasterAllFetchedDataArray.concat(this.tempProdMasterDataArray);
      //TODO this.productMasterDataArray = this.productMasterDataArray.filter(a => a.PRO_TYPE_MST_ID != productType._id)
      this.productMasterDataArray = this.productMasterDataArray.concat(this.tempProdMasterDataArray);
      this.tempProdMasterDataArray = null;
      this.tempProdMasterDataArray = new Array<any>();

    }
    //let sleft = $('#slides').scrollLeft();
    let $scroll = $('.' + productType._id);
    let scrollWidth = $scroll[0].scrollWidth;
    let offsetWidth = $scroll[0].offsetWidth;
    let scrollLeft = $scroll.scrollLeft();
    if ((scrollWidth / offsetWidth) >= 1) {
      $scroll.scrollLeft(scrollLeft + offsetWidth);
    } else {
      $scroll.scrollLeft(scrollWidth - offsetWidth);
    }

  }
  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.businessName = this.logInfo[0].BUSINESS_DETAILS;
    this.aadharRemarksPay = this.logInfo[0].CLIENT_NAME + (this.logInfo[0].CITY_NAME ? ('-' + this.logInfo[0].CITY_NAME) : '');
    this.getProductType();
    this.scrollDCallback = this.getStories.bind(this);
    this.scrollDDCallback = this.getAllItems.bind(this);
    this.scrollLCallback = this.getItems.bind(this);

    //this.scrollCallbackH = this.getItems(productTypeId);
    this.GetAADHARBANK();
    if (!screenfull.isFullscreen)
      screenfull.toggle();
  }
  /**
  * 
  * @param obj 
  */
  getValue(obj) {
    this.PRODUCT_TYPE_NAME = obj.PRODUCT_TYPE_NAME;
    this.PRO_TYPE_MST_ID = obj._id;
    this.getProduct(0, this.PRO_TYPE_MST_ID - 1, this.PRO_TYPE_MST_ID + 1, undefined);
  }
  /**
   * 
   */
  onQtyblur(purchaseItem, i) {
    if (purchaseItem.qty == undefined || purchaseItem.qty == 0 || purchaseItem.qty.trim().length == 0) {
      this.removeProduct(purchaseItem, i, 'blur');
      return;
    }
    this.totalQty = 0;
    this.totalAmount = 0;
    this.totalTax = 0;
    this.purchaseItemArray.forEach(element => {
      this.totalQty = this.totalQty + parseInt(element.qty.toString());
      this.totalTax += element.gst * element.qty;
      this.totalAmount += ((element.rate + element.gst) * element.qty);

    });

    //let tempProductMasterData = this.productMasterDataArray.filter(product => purchaseItem.itemId);

    // let $item = $('#cntDiv' + purchaseItem.itemId);
    let $item: any;
    let $itemD: any;
    // if (this.viewDetail)
    $itemD = $('#cntDivD' + purchaseItem.itemId);
    // else
    $item = $('#cntDiv' + purchaseItem.itemId);
    $itemD.text(purchaseItem.qty);
    $item.text(purchaseItem.qty);

    let $redCountDiv = $item.parent().parent().prev();
    $redCountDiv.text(purchaseItem.qty);

    let $redCountDivD = $itemD.parent().parent().prev();
    $redCountDivD.text(purchaseItem.qty);
  }
  /**
   * 
   */
  removeSelectedItem($countDiv, $redCountDiv) {
    let count = $countDiv.text();
    if (parseInt(count) > 1) {
      $countDiv.text(parseInt(count) - 1);
      $redCountDiv.text(parseInt($redCountDiv.text()) - 1);
    }
    else {
      $countDiv.text(0);
      $redCountDiv.text(0);
      $redCountDiv.parent().removeClass('purchaseBg');
      $redCountDiv.hide();
    }

    //let tempItem = this.productMasterDataArray[i];

  }

  removeItem(i, event) {
    let $srcElement = event.srcElement ? $(event.srcElement) : $(event.originalTarget);
    let $countDiv = $srcElement.next();
    let $redCountDiv = $countDiv.parent().parent().prev();

    let count = $countDiv.text();
    let tempItem = this.productMasterDataArray.filter(a => a._id == $countDiv[0].id.replace('cntDivD', '').replace('cntDiv', ''))[0];
    if (parseInt(count) > 0) {
      this.totalQty--;
      this.totalTax -= parseFloat(tempItem.TAX_PERCENT);
      this.totalAmount -= (parseFloat(tempItem.PRO_RATE) + parseFloat(tempItem.TAX_PERCENT));
      let tempMatchedItem = this.purchaseItemArray.filter(item => item.itemId == tempItem._id);
      if (tempMatchedItem && tempMatchedItem.length > 0) {
        tempMatchedItem[0].qty -= 1;
      }
      if (parseInt(count) == 1) {
        this.totalProduct--;
        this.purchaseItemArray = this.purchaseItemArray.filter(product => product.itemId != tempItem._id);
      }
    }
    this.removeSelectedItem($countDiv, $redCountDiv);

    let mid = $countDiv[0].id;
    if (mid.indexOf('cntDivD') == 0) {
      $countDiv = $('#cntDiv' + mid.replace('cntDivD', ''));
    } else {
      $countDiv = $('#cntDivD' + mid.replace('cntDiv', ''));
    }
    $redCountDiv = $countDiv.parent().parent().prev();
    this.removeSelectedItem($countDiv, $redCountDiv);
  }
  getAndGenerateBill() {
    return this.getNewBillNo();
  }

  getNewBillNo() {
    return new Promise(resolve => {
      let pageObj = this;
      this.apiService.sendToServer<ICore>('/api/product/getNewBillNo', { data: { CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }, this).subscribe(data => {
        if (data && data.msg === 'Success') {
          pageObj.billNo = data.result.value.sequence_value;
          resolve(data);
          return true;
        }
        else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      });
    });
  }
  /**
   * 
   */
  addItem(i, event) {
    debugger;
    let pageObj = this;
    this.addItems(i, event);
  }

  addItems(i, event) {
    let $srcElement = event.srcElement ? $(event.srcElement) : $(event.originalTarget);
    let $countDiv = $srcElement.prev();
    let count = $countDiv.text();
    $countDiv.text(parseInt(count) + 1);
    let $redCountDiv = $countDiv.parent().parent().prev();
    $redCountDiv.text(parseInt($redCountDiv.text()) + 1);
    $redCountDiv.parent().addClass('purchaseBg');
    $redCountDiv.show();
    let tempItem = this.productMasterDataArray.filter(a => a._id == $countDiv[0].id.replace('cntDivD', '').replace('cntDiv', ''))[0];
    //this.productMasterDataArray[i];
    this.totalQty++;
    this.totalTax += parseFloat(tempItem.TAX_PERCENT);
    this.totalAmount += (parseFloat(tempItem.PRO_RATE) + parseFloat(tempItem.TAX_PERCENT));
    let tempMatchedItem = this.purchaseItemArray.filter(item => item.itemId == tempItem._id);
    if (tempMatchedItem && tempMatchedItem.length > 0) {
      tempMatchedItem[0].qty = parseInt(tempMatchedItem[0].qty.toString()) + 1;
    } else {
      this.totalProduct++;
      let tempPurchaseItem: IPurchaseItem = {
        productTranId: 0,
        itemId: parseInt(tempItem._id),
        productName: tempItem.PRODUCT_NAME,
        qty: 1,
        rate: parseFloat(tempItem.PRO_RATE),
        gst: parseFloat(tempItem.TAX_PERCENT)
      }
      this.purchaseItemArray.push(tempPurchaseItem);
      this.purchaseItemArray.reverse();
    }

  }
  showPurchaseBill() {
    if (this.totalAmount == 0) {
      return false;
    }
    if (this.mobileNo.toString().trim().length != 10) {
      // alert("Enter 10 Digit Mobile No.");
      // this.option.msg = "Enter 10 Digit Mobile No.";
      // this.option.type = 'error';
      // this.toast.addToast(this.option);
      this.mobileNo = null;
    }
    // this.state = (this.state === 'small' ? 'large' : 'small');
    this.showBill = "show transform";
    this.showOverlay = "show";
    this.showProdList = "hide";
    this.showVerify = true;
    this.ShowBillNo = false;
    this.showPaymentMode = false;
    $('.disabledbutton').prop("disabled", false);
  }


  paymentCallback(obj) {
    if (obj === 'close1') {
      this.showOverlay = 'hide';
      // this.showBill = "show";
      this.showProdList = 'show';
      this.showPaymentOption = false;
      this.resetPurchaseItemIconValue();
      this.payOption.paymentMode = '';
    } else if (obj === 'close') {
      this.showOverlay = 'hide';
      // this.showBill = "show";
      this.showProdList = 'show';
      this.showPaymentOption = false;
      this.resetPurchaseItemIconValue();
      this.payOption.paymentMode = '';
      if (confirm('Do You Want to Print Bill ?')) {
      } else {

      }

    }

    else {
      this.saveTran();
      // this.resetPurchaseItemIconValue();
    }

  }

  saveTran() {
    return new Promise(resolve => {
      let paymentMode = '';
      let tranMode = '';
      let tranStatus = '';
      if (this.payOption) {
        paymentMode = this.payOption.paymentMode ? this.payOption.paymentMode : '';
        tranMode = this.payOption.paymentMode === 'CASH' ? 'C' : 'O';
      }

      let sendData = {
        "CLIENT_MST_ID": this.logInfo[0].CLIENT_MST_ID,
        "MOBILE_NO": this.mobileNo,
        "CUSTOMER_NAME": this.customerName,
        "BILL_NO": this.payOption.billNumberPay,
        "TOTAL_AMOUNT": this.totalAmount,
        "TAX_AMOUNT": this.totalTax,
        "PAYMENT_MODE": paymentMode,
        "ACTIVE_FLAG": "Y",
        "DELETE_FLAG": "N",
        "TRANSACTION_MODE": tranMode,
        "TRANSACTION_STATUS": tranStatus,
        "TRAN_DET_ID": this.TRAN_DET_ID
      }
      let pageObj = this;
      this.apiService.sendToServer<ICore>('/api/product/insertProductTranMaster', { data: sendData }, this).subscribe(async data => {
        if (data && data.msg === 'Success') {
          pageObj.productTranId = data.insertedId;
          if (this.payOption) {
            this.payOption.tranId = pageObj.productTranId;
          }
          let tmp = await this.saveProductTranDetail();
          if (tmp) {
            resolve(data);
            if (this.payOption) {
              if (this.payOption.paymentMode == 'Aadhar') {
                this.payOption.aadharTran(pageObj.updateProdTranMaster);
              } else if (this.payOption.paymentMode == 'UPI') {
                this.payOption.payUpiPayment(pageObj.updateProdTranMaster);
              }
              else if (this.payOption.paymentMode == 'PAYMENTGATEWAY') {
                this.payOption.payByPaymentGateway();
              }
              else if (this.payOption.paymentMode == 'QRCODE') {
                this.payOption.qrCodePay();
              }

            }

            return true;
          }
          else {
            return false;
          }
        } else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      });
    });
  }
  saveProductTranDetail() {
    return new Promise(resolve => {
      let sendData = this.purchaseItemArray;
      let pageObj = this;
      this.apiService.sendToServer<ICore>('/api/product/insertProductTranDetail', { data: sendData, productTranId: this.productTranId }, this).subscribe(async data => {
        if (data && data.msg === 'Success') {
          //this.productTranId = data.insertedId;
          resolve(data);
          return true;
        } else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      });
    });
  }
  updateProdTranMaster(pageObj: UpiPayment, dataObj, rrn, status) {
    return new Promise(resolve => {
      let obj = {
        _id: dataObj.tranId,
        CLIENT_MST_ID: dataObj.logInfo[0].CLIENT_MST_ID,
        TRAN_DET_ID: rrn,
        TRANSACTION_STATUS: status
      }
      pageObj.apiService.sendToServer<ICore>('/api/product/updateProdTranMaster', { data: obj }, pageObj).subscribe(data => {
        if (data && data.msg === 'Success') {
          //pageObj.billNo = data.result.value.sequence_value;
          resolve(data);
          return true;
        }
        else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      });
    });
  }




  /**
     * 
     * @param removeProduct 
     * @param i 
     * @param flag 
     */
  removeProduct(removeProduct, i, flag) {
    if (confirm('Do You want to remove this product?')) {
      this.totalProduct--;
      this.purchaseItemArray = this.purchaseItemArray.filter(product => product.itemId != removeProduct.itemId);
      if (flag == 'blur') {
        this.totalQty = 0;
        this.totalAmount = 0;
        this.totalTax = 0;
        this.purchaseItemArray.forEach(element => {
          this.totalQty += element.qty;
          this.totalTax += (element.gst * element.qty);
          this.totalAmount += ((element.rate + element.gst) * element.qty);
        });
      }
      else {
        this.totalQty -= removeProduct.qty
        this.totalTax -= (removeProduct.gst * removeProduct.qty);
        this.totalAmount -= ((removeProduct.rate + removeProduct.gst) * removeProduct.qty);

        // let $item = $('#cntDiv' + removeProduct.itemId);
        let $item: any;
        let $itemD: any;
        // if (this.viewDetail)
        $itemD = $('#cntDivD' + removeProduct.itemId);
        // else
        $item = $('#cntDiv' + removeProduct.itemId);
        $itemD.text(0);
        $item.text(0);

        let $redCountDiv = $item.parent().parent().prev();
        $redCountDiv.text(0);
        $redCountDiv.hide();
        $redCountDiv.parent().removeClass('purchaseBg');

        let $redCountDivD = $itemD.parent().parent().prev();
        $redCountDivD.text(0);
        $redCountDivD.hide();
        $redCountDivD.parent().removeClass('purchaseBg');
      }
      if (this.purchaseItemArray.length == 0) {
        this.showBill = 'hide transform';
        this.showOverlay = 'hide';
        this.showProdList = 'show';
      }
    } else {
      let txtQty = $('#' + i);
      setTimeout(() => txtQty.focus(), 0);
      return false;
    }
  }
  getProduct(id, fromProdTypeId: number, upToProdTypeId: number, limit) {
    return new Promise(resolve => {
      let pageObj = this;
      this.apiService.sendToServer<ICore>('/api/product/getProductMaster', {
        singleRecord: this.getSingleRecord,
        getRecordLimit: limit,
        data:
        {
          _id: id,
          CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID,
          fromProdTypeId: fromProdTypeId,
          upToProdTypeId: upToProdTypeId
        }
      }, this).subscribe(data => {
        if (data && data.msg === 'Success') {
          if (!pageObj.tempProdMasterDataArray)
            pageObj.tempProdMasterDataArray = new Array<any>();
          pageObj.tempProdMasterDataArray = pageObj.tempProdMasterDataArray.concat(data.result);
          this.setPurchaseItemIconValue();
          resolve(data.result);
        }
      });
    });
  }
  resetPurchaseItemIconValue() {
    this.purchaseItemArray = null;
    this.purchaseItemArray = new Array<IPurchaseItem>();
    let i = 0;
    for (i; i < this.productMasterDataArray.length; i++) {
      // let $item = $('#cntDiv' + this.productMasterDataArray[i]._id);
      let $item: any;
      let $itemD: any;
      // if (this.viewDetail)
      $itemD = $('#cntDivD' + this.productMasterDataArray[i]._id);
      // else
      $item = $('#cntDiv' + this.productMasterDataArray[i]._id);
      $item.text(0);
      $itemD.text(0);

      let $redCountDiv = $item.parent().parent().prev();
      $redCountDiv.text(0);
      $redCountDiv.hide();
      $redCountDiv.parent().removeClass('purchaseBg');

      let $redCountDivD = $itemD.parent().parent().prev();
      $redCountDivD.text(0);
      $redCountDivD.hide();
      $redCountDivD.parent().removeClass('purchaseBg');
    }

    this.totalProduct = 0;
    this.totalQty = 0;
    this.totalAmount = 0;
    this.mobileNo = null;
    this.customerName = null;
    // this.ProdTypeId = null;
    // this.DataListArray = null;
    // this.ProdTypeName= null;
  }
  setPurchaseItemIconValue() {
    if (this.purchaseItemArray && this.purchaseItemArray.length > 0) {
      let i = 0;
      let tempProductMasterData;
      setTimeout(() => {
        for (i; i < this.purchaseItemArray.length; i++) {
          tempProductMasterData = this.productMasterDataArray.filter(product => product._id == this.purchaseItemArray[i].itemId);
          if (tempProductMasterData && tempProductMasterData.length > 0) {
            // let $item = $('#cntDiv' + this.purchaseItemArray[i].itemId);
            let $item: any;
            let $itemD: any;
            // if (this.viewDetail)
            $itemD = $('#cntDivD' + this.purchaseItemArray[i].itemId);
            // else
            $item = $('#cntDiv' + this.purchaseItemArray[i].itemId);

            $itemD.text(this.purchaseItemArray[i].qty);
            $item.text(this.purchaseItemArray[i].qty);
            let $redCountDiv = $item.parent().parent().prev();
            $redCountDiv.text(this.purchaseItemArray[i].qty);
            $redCountDiv.show();
            $redCountDiv.parent().addClass('purchaseBg');

            let $redCountDivD = $itemD.parent().parent().prev();
            $redCountDivD.text(this.purchaseItemArray[i].qty);
            $redCountDivD.show();
            $redCountDivD.parent().addClass('purchaseBg');
          }
        }
      }, 500);
    }
  }
  getProductType() {
    let pageObj = this;
    this.apiService.sendToServer<ICore>('/api/product/getProductType', { data: { CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }, this).subscribe(async data => {
      if (data && data.msg === 'Success') {
        pageObj.productTypeDataArray = data.result;
        pageObj.showProductTypeArray = pageObj.productTypeDataArray.slice(0, pageObj.showProdTypeSliceNo);
        pageObj.showProdTypeSliceCounter = 2;
        let i = 0;
        for (i; i < pageObj.showProductTypeArray.length; i++) {
          await pageObj.getProduct(0, pageObj.showProductTypeArray[i]._id - 1, pageObj.showProductTypeArray[i]._id + 1, undefined);
        }
        pageObj.productMasterDataArray = pageObj.tempProdMasterDataArray;
        pageObj.prodMasterAllFetchedDataArray = pageObj.tempProdMasterDataArray;
        pageObj.tempProdMasterDataArray = new Array<any>();

      }
    });

  }
  getProdBill() {
    let pageObj = this;
    this.apiService.sendToServer<ICore>('/api/product/getProductTranMast', { data: { CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }, this).subscribe(async data => {
      if (data && data.msg === 'Success') {
        for (var i = 0; i < data.result.length; i++) {
          if (data.result[i].PAYMENT_MODE == "UPI" && data.result[i].PAYMENT_MODE == "Aadhar") {
            pageObj.productBillDataArray = data.result[i];
          }
        }
        // pageObj.productBillDataArray = data.result;

        pageObj.productBillDataArray.reverse();


      }
    });
  }
  async getBillDetails(item) {

    this.resetPurchaseItemIconValue();
    let pageObj = this;
    this.customerName = item.CUSTOMER_NAME;
    this.mobileNo = item.MOBILE_NO;
    this.billNo = item.BILL_NO;
    this.apiService.sendToServer<ICore>('/api/product/getProductTranDetail', {
      data: {
        _id: item._id,
        CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID
      }
    }, this).subscribe(async data => {
      if (data && data.msg === 'Success') {
        pageObj.productMasterDataArray = pageObj.prodMasterAllFetchedDataArray;
        let i = 0;
        let tmpArray = null;
        pageObj.purchaseItemArray = null;
        pageObj.purchaseItemArray = new Array<IPurchaseItem>();
        pageObj.totalProduct = data.result.length;
        for (i; i < data.result.length; i++) {
          tmpArray = pageObj.productMasterDataArray.filter(a => a._id === data.result[i].PRO_MST_ID);
          if (!tmpArray || (tmpArray && tmpArray.length == 0)) {
            pageObj.getSingleRecord = true;
            tmpArray = await pageObj.getProduct(data.result[i].PRO_MST_ID, 0, 0, undefined);
          }
          let obj = {
            productTranId: data.result[i].PRO_TRAN_MST_ID,
            itemId: data.result[i].PRO_MST_ID,
            productName: tmpArray[0].PRODUCT_NAME,
            qty: data.result[i].PRO_QTY,
            rate: data.result[i].PRO_RATE,
            gst: data.result[i].TAX_PERCENT
          };
          pageObj.totalAmount += data.result[i].TOTAL_AMOUNT;
          pageObj.totalQty += data.result[i].PRO_QTY;
          pageObj.purchaseItemArray.push(obj);
        }
        pageObj.productMasterDataArray = pageObj.productMasterDataArray.concat(pageObj.tempProdMasterDataArray);
        pageObj.prodMasterAllFetchedDataArray = pageObj.prodMasterAllFetchedDataArray.concat(pageObj.tempProdMasterDataArray);
        pageObj.setPurchaseItemIconValue();
        pageObj.tempProdMasterDataArray = new Array<any>();
        pageObj.showBill = 'show transform';
        pageObj.showOverlay = 'show';
        pageObj.showProdList = 'hide';
        pageObj.ShowBillNo = true;
        pageObj.showVerify = true;
        pageObj.showPaymentMode = false;
      }
    });
  }

  ViewAllProdList(productType, proTypeName) {

    this.viewDetail = true;
    this.filterProdType = {
      propertyName: 'PRO_TYPE_MST_ID',
      propertyValue: productType

    }
    this.ProdTypeId = productType;
    // this.DataListArray = this.productMasterDataArray.filter(a => a.PRO_TYPE_MST_ID == this.ProdTypeId);
    // if (this.DataListArray && this.DataListArray.length < 12) {
    //   this.getAllItems();
    // }
    let l = this.productMasterDataArray.filter(a => a.PRO_TYPE_MST_ID == this.ProdTypeId).length;
    if (l < 12) {
      this.getAllItems();
    }

    this.ProdTypeName = proTypeName;
    this.showViewAllProdWOType = 'show showProductBox';
    this.showProdList = 'hide';
    // this.showBill = 'hide';
    this.setPurchaseItemIconValue();
    this.showallProdwithType = 'hide showProductBox';
    this.showProdList = 'show';


  }
  backAllProd() {
    this.viewDetail = false;
    this.showViewAllProdWOType = 'hide showProductBox';
    this.showProdList = 'show';
    // this.showBill = 'hide';
    this.setPurchaseItemIconValue();
    this.showallProdwithType = 'show showProductBox';
  }

  VerifyPay() {

    this.showPaymentOption = true;

    this.showBill = 'hide transform';
    this.billDetailObj = {
      billAmount: this.totalAmount,
      taxAmount: this.totalTax,
      customerName: this.customerName,
      customerGstNo: this.custGSTNoPay,
      mobileNo: this.mobileNo,
      remark: this.aadharRemarksPay,
      billNo: this.billNo
    }
    // this.payOption.DivPaymentOption =true;
    // this.showVerify = false;
    // this.showPaymentMode = true;
    // $('.disabledbutton').prop("disabled", true);

  }

  async saveBill() {
    let tmp = await this.getNewBillNo();
    if (!tmp) return false;
    tmp = await this.saveTran();
    if (!tmp) return false;
    this.showBill = 'hide transform';
    this.showOverlay = 'hide';
    this.showProdList = "show";
    // alert('');

  }
  closeSaveBill() {
    this.resetPurchaseItemIconValue();
  }

  printBill() {
    // this.saveBill();
    if (confirm('Do You Want to Print Bill ?')) {
    } else {

    }
    this.resetPurchaseItemIconValue();
  }

  /** 
   * Aadhar Payment 
   */
  // async aadharPay() {

  //   let tmp = await this.getNewBillNo();
  //   if (!tmp) return false;
  //   tmp = await this.saveTran('AADHAR');
  //   if (!tmp) return false;

  //   this.showAadharPay = 'show';
  //   this.showBill = 'hide';
  // }
  aadharCallBack(tmp, mCust, showBusinness, showAadharTranId, pageObj) {
    //  let pageObj =this;
    let msgAadhar = tmp[0];
    pageObj.mCust = mCust;
    pageObj.showBusinness = showBusinness;
    pageObj.showAadharTranId = showAadharTranId;
    pageObj.TRAN_DET_ID = tmp[1];
    if (tmp[tmp.length - 1] == 'N') {
      pageObj.resultMessage = "error";
      pageObj.statusImage = "assets/images/error.png";
      pageObj.statusMessage = "Transaction failed";
      pageObj.business = pageObj.dataStorage.logInfo[0].BUSINESS_DETAILS;
      pageObj.merchantName = pageObj.dataStorage.logInfo[0].CLIENT_NAME;
      pageObj.customerName = pageObj.customerName;
      pageObj.rrn = tmp[1];
      pageObj.collMessage = msgAadhar;
      pageObj.balance = pageObj.totalAmount.toString();
      pageObj.tranDate = tmp[2];
      pageObj.showStatusBox = true;
    }
    else {
      pageObj.resultMessage = "success";
      pageObj.statusImage = "assets/images/success.png";
      pageObj.statusMessage = "Transaction Success.";
      pageObj.business = pageObj.dataStorage.logInfo[0].BUSINESS_DETAILS;
      pageObj.merchantName = pageObj.dataStorage.logInfo[0].CLIENT_NAME;
      pageObj.customerName = pageObj.customerName;
      pageObj.rrn = tmp[1];
      pageObj.collMessage = msgAadhar;
      pageObj.balance = pageObj.totalAmount.toString();
      pageObj.tranDate = tmp[2];
      pageObj.showStatusBox = true;
      pageObj.clear();
      let btnLogin = $('#aadharBtn');
      setTimeout(() => btnLogin.attr('disabled', 'true'), 0);
    }
    pageObj.showAadharform = 'hide';
  }
  // btnPaymentAadhar() {
  //   this.showAadharInstallInfo = true;
  //   //Aadhar Variables
  //   var aadharModel = {
  //     aadharNo1: this.aadharNo1Pay,
  //     aadharNo2: this.aadharNo2Pay,
  //     aadharNo3: this.aadharNo3Pay,
  //     aadhar: this.aadhar,
  //     aadharBankList: this.aadharBankList,
  //     bankCode: this.bankCodePay,
  //     bankName: this.bankNamePay,
  //     amount: this.totalAmount,
  //     customerName: this.customerName,
  //     billNumber: this.billNo,
  //     custGSTNo: this.custGSTNoPay,
  //     remark: this.aadharRemarksPay
  //   }
  //   this.aadharPayment.ThumbScan(aadharModel, this.aadharCallBack, this);
  // }
  closeaadharPay() {
    this.showAadharPay = 'hide';
    this.showBill = 'show transform';
  }

  // /**
  //   * Cash Payment
  //   */
  // async cashPay() {
  //   let tmp = await this.getNewBillNo();
  //   if (!tmp) return false;
  //   tmp = await this.saveTran('CASH');
  //   if (!tmp) return false;

  //   //this.showAadharPay = 'show';
  //   this.showBill = 'hide';
  //   this.showOverlay = 'hide';
  //   if (confirm('You Want to Print Bill.')) {
  //   } else {

  //   }
  //   this.showProdList = 'show';
  //   this.purchaseItemArray = null;
  //   this.purchaseItemArray = new Array<IPurchaseItem>();
  //   this.totalProduct = 0;
  //   this.totalQty = 0;
  //   this.totalAmount = 0;
  //   this.resetPurchaseItemIconValue();
  // }

  /**
   * Qr Code Payment
   */
  // async qrCodePay() {
  //   let tmp = await this.getNewBillNo();
  //   if (!tmp) return false;
  //   tmp = await this.saveTran('QRCODE');
  //   if (!tmp) return false;
  //   let qrParamObj = {
  //     qRAmount: this.totalAmount,
  //     qrRemark: this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME,
  //     qrBillNo: this.billNo,
  //     customerName: this.customerName,
  //     gstNo: '' //TODO
  //   }
  //   this.qrPayment.getQrCode(this.showQr, qrParamObj, this);

  // }
  // showQr(paramObj, param, pageObj) {
  //   if (paramObj.reference_id == undefined || paramObj.reference_id == "") {
  //     if (paramObj.message && paramObj.message.trim().length > 0)
  //       this.message =paramObj.message; 
  // MessageBox.show(this.dialog, this.message, "");
  //     else
  //       alert("Qr Code Generation Error. Please Retry.")
  //     pageObj.QRFlag = false;
  //     return;
  //   }
  //   else {
  //     pageObj.showQrPay = 'show';
  //     pageObj.showBill = 'hide';
  //     pageObj.qrValue = "upi://pay?pa=" + pageObj.logInfo[0].VPA + "&pn=" + pageObj.merchantName + "&tr=" + paramObj.reference_id + "&am=" + param.AMOUNT + "&cu=INR&mc=" + pageObj.logInfo[0].TERMINAL_ID;
  //     pageObj.QRFlag = true;
  //   }
  //   if (confirm('You Want to Print Bill.')) {

  //   } else {

  //   }
  //   this.resetPurchaseItemIconValue();

  // }
  /**
   * Pay By Payment Gateway
  */
  // async payByPaymentGateway() {
  //   let tmp = await this.getNewBillNo();
  //   if (!tmp) return false;
  //   tmp = await this.saveTran('PAYMENTGATEWAY');
  //   if (!tmp) return false;
  //   let paymentGatewayObj = {
  //     tranamount: this.totalAmount,
  //     billnumber: this.billNo,
  //     customername: this.customerName
  //   };
  //   // this.paymentGateway.paymentGatewayPay(this.resetPurchaseItemIconValue, this, paymentGatewayObj);
  // }

  clear() {

  }

  PayList() {
    if (this.purchaseItemArray && this.purchaseItemArray.length > 0)
      this.showPayList = true;
  }

  btnClose() {
    this.showProdList = 'show';
    this.showBill = 'hide transform';
    this.showOverlay = 'hide';
  }

  //for aadhar
  onkeyup() {
    let pageObj = this;
    $("input").keyup(function () {

      pageObj.showStatusBox = false;

      if (this.className.indexOf("aadhar") > -1) {
        if (this.value.length == this.maxLength) {
          var $next = $(this).next('.aadhar');
          if ($next.length) { $(this).next('.aadhar').focus(); }
          else { $(this).blur(); }
        }
        if (this.value.length > 4) {
          this.value = this.value.slice(0, 4);
        }
      }

    });
    // $('#footerimg').css('background-image','none')
  }

  termConditions() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "1", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  setAmountFormat() {
    if (parseFloat(this.amountPay))
      this.amountPay = parseFloat(this.amountPay).toFixed(2);

  }

  showOthInfo(e) {
    if (e.srcElement.checked == true)
      this.showOtherInfo = true;
    else {
      this.showOtherInfo = false;
    }
  }

  //# START Aadhar ==============================================

  GetAADHARBANK() {
    var paramObj = {
      key: 'IIN',
      CLIENT_MST_ID: this.logInfo.CLIENT_MST_ID
    };
    this.spinner.show();
    this.apiService.sendToServer<IAadhar>('/api/virtualpay/GetAADHARMemberBank', paramObj, this).subscribe((data) => {

      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.aadharBankList = data.cursor1;
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  setBankCode() {
    let pageObj = this;
    let selectedBank = this.aadharBankList.filter(a => a.BANK_NAME == pageObj.bankNamePay);
    if (!selectedBank || (selectedBank && selectedBank.length == 0)) {
      this.message = "Please select Bank name.";
      MessageBox.show(this.dialog, this.message, "");
      this.bankNamePay = '';
      const txtAadharBank = this.renderer2.selectRootElement('#txtAadharBank');
      setTimeout(() => txtAadharBank.focus(), 0);
      return false;
    }
    pageObj.bankCodePay = selectedBank[0].IIN;
  }

  hideArrow() {
    $('.btnCollapseDown').toggle();
    $('.btnCollapseUp').toggle();
  }
  //   animateMe() {
  //     this.state = (this.state === 'small' ? 'large' : 'small');
  // }
}