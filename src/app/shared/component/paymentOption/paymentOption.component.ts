import { Component, SecurityContext, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ErrorHandler } from '../../../core/errorHandler';
import { DataStorage } from '../../../core/dataStorage';
import { ICore } from '../../../interface/core';
import { ILogin } from '../../../interface/login';
import { IBillDetail } from '../../../interface/payment';
import { IAadhar } from '../../../interface/aadhar';
import { AadharPayment } from './paymentServices/aadharPayment';
import { QrPayment } from './paymentServices/qrPayment';
import { BbpsPayment } from './paymentServices/bbpsPayment';
import { UpiPayment } from './paymentServices/upiPayment';
import { PaymentGateway } from './paymentServices/paymentGateway';
import { IBillCollectionUPI } from '../../../interface/billCollectionUPI';
import { ApiService } from '../../../core/api.service';
import { Spinner } from '../../../services/spinner';
import { Common } from '../../../services/common';
import { Toast } from '../../../services/toast';
import * as $ from 'jquery';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

//import {WebView, LoadEventData} from "ui/web-view";
@Component({
    selector: 'paymentOption',
    styleUrls: ['./paymentOption.component.scss'],
    templateUrl: './paymentOption.component.html',
    providers: [ApiService, Spinner, Common, AadharPayment, QrPayment, PaymentGateway, UpiPayment, BbpsPayment]
})

export class PaymentOptionComponent {
    @Input() billDetail: IBillDetail;
    paymentMode = '';
    public PaymentGatewayUrl: SafeResourceUrl;
    showPaymentGatewayWindow = 'hide';
    showThanksWindow = "hide";
    tranId = 0;
    logInfo: ILogin;
    termCondContent: string;
    showPayButton = 'showInline';
    /*
     *aadhar Variable
     */
    showAadharTranResult = false;
    showUpiOtherInfo: string = 'hide';
    showAadharOtherInfo: string = 'hide';
    DivPaymentOption: boolean = true;
    showAadharForm: string = "show";
    showUpiForm: string = "show";

    TCchek: boolean = true;
    showAadharStatusBox = 'hide';
    showUpiStatusBox = 'hide';
    showAadharPay = false;
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
    showBill: string = "hide";
    //showOverlay: string = "hide";
    // showAadharInstallInfo = false;
    showDisableLink: string = "";
    showAadharBox: string = "show";
    showUpiBox: string = "hide";
    showCashBox: string = "hide";
    showQRBox: string = "hide";
    showPaymentGatewayBox: string = "hide";
    showPOSBox = "hide";


    /**
     * qr variable
     */

    QRFlag: string = 'hide';
    qrValue: any = null;


    /**
     * UPI Variable
     */
    acName: any;
    CollectionVPAPay: any;
    upiPaymentObj: any;
    errorStatusBtnHide: string = 'showInline';
    errorStatusBtnClose: string = 'hide';
    beneficaryList: any;
    @Output() btnClick = new EventEmitter<any>();

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

    constructor(public domSanitizer: DomSanitizer, private dialog: MatDialog, public el: ElementRef, private apiService: ApiService, private dataStorage: DataStorage, private renderer2: Renderer2,
        private errorHandler: ErrorHandler, private aadharPayment: AadharPayment, private paymentGateway: PaymentGateway,
        private qrPayment: QrPayment, private upiPayment: UpiPayment, private bbpsPaymemt: BbpsPayment, private toast: Toast, private spinner: Spinner, private common: Common) {
    }


    ngOnInit() {
        this.logInfo = this.dataStorage.logInfo;
        debugger;
        // this.DivPaymentOption =true;
        //this.aadharRemarksPay = this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME;
        this.GetAADHARBANK();
        if (this.billDetail.billNo == undefined || this.billDetail.billNo == null || this.billDetail.billNo == '') {
            this.getNewBillNo();
        }
        else {
            this.billNumberPay = this.billDetail.billNo;
        }
        this.getBeneficiaryData();
        this.aadharPay(null);
        // $('.disabled').prop("disabled", false);
        // this.errorStatusBtnHide = true;

    }

    showAadharOthInfo(e) {

        if (e.srcElement.checked == true)
            this.showAadharOtherInfo = 'show';
        else {
            this.showAadharOtherInfo = 'hide';
        }
    }
    showUpiOthInfo(e) {

        if (e.srcElement.checked == true)
            this.showUpiOtherInfo = 'show';
        else {
            this.showUpiOtherInfo = 'hide';
        }
    }


    getNewBillNo() {
        return new Promise(resolve => {
            let pageObj = this;
            this.apiService.sendToServer<ICore>('/api/product/getNewBillNo', { data: { CLIENT_MST_ID: this.logInfo[0].CLIENT_MST_ID } }, this).subscribe(data => {
                if (data && data.msg === 'Success') {
                    pageObj.billNumberPay = data.result.value.sequence_value;
                    resolve(data);
                    return data.result.value.sequence_value;
                }
                else {
                    this.message = data.msg;
                    MessageBox.show(this.dialog, this.message, "");
                    return 0;
                }
            });
        });
    }
    //for aadhar
    onkeyup() {
        let pageObj = this;
        $("input").keyup(function () {
            pageObj.showAadharStatusBox = 'hide';
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
    /**
     * Get Aadhar bank List
     */
    GetAADHARBANK() {
        this.spinner.show();
        var paramObj = {
            key: 'IIN',
            CLIENT_MST_ID: this.logInfo.CLIENT_MST_ID
        };
        this.apiService.sendToServer<IAadhar>('/api/virtualpay/GetAADHARMemberBank', paramObj, this).subscribe((data) => {
            this.spinner.hide();
            if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
                this.aadharBankList = data.cursor1;
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




    aadharCallBack(tmp, mCust, showBusinness, showAadharTranId, pageObj) {
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
            pageObj.customerName = pageObj.billDetail.customerName;
            pageObj.rrn = tmp[1];
            pageObj.collMessage = msgAadhar;
            pageObj.balance = pageObj.billDetail.billAmount;
            pageObj.tranDate = tmp[2];
            pageObj.showAadharStatusBox = 'show';
            pageObj.errorStatusBtnHide = 'showInline';
            pageObj.errorStatusBtnClose = 'hide';

        }
        else {
            pageObj.resultMessage = "success";
            pageObj.statusImage = "assets/images/success.png";
            pageObj.statusMessage = "Transaction Success.";
            pageObj.business = pageObj.dataStorage.logInfo[0].BUSINESS_DETAILS;
            pageObj.merchantName = pageObj.dataStorage.logInfo[0].CLIENT_NAME;
            pageObj.customerName = pageObj.billDetail.customerName;
            pageObj.rrn = tmp[1];
            pageObj.collMessage = msgAadhar;
            pageObj.balance = pageObj.billDetail.billAmount;
            pageObj.tranDate = tmp[2];
            pageObj.showAadharStatusBox = 'show';
            pageObj.errorStatusBtnClose = 'showInline';
            pageObj.errorStatusBtnHide = 'hide';
            // $('.disabled').prop("disabled", true);
            pageObj.showDisableLink = "showDisablebox";
            pageObj.clear();
            let btnLogin = $('#aadharBtn');
            setTimeout(() => btnLogin.attr('disabled', 'true'), 0);
            pageObj.bbpsPaymemt.saveBbpsBill(pageObj);
            if (confirm('Do You Want to Print Bill.')) {
                //$('.showReciptBox').removeClass('hide');
                pageObj.PrintDivByClass('showReciptBox');
            } else {

            }
        }
        pageObj.showAadharForm = 'hide';

    }
    aadharPay(elm) {
        this.paymentMode = 'Aadhar';
        this.showAadharBox = 'show';
        this.showUpiBox = 'hide';
        this.showPaymentGatewayBox = "hide";
        this.showCashBox = "hide";
        this.showPOSBox = "hide";
        this.showQRBox = "hide";
        // this.btnClick.emit(this);
        this.QRFlag = "hide";
        this.qrValue = null;
        if (elm) {
            $('.nav-link').removeClass('active');
            elm.className = "nav-link active";
        }

    }
    upiPay(elm) {
        this.paymentMode = 'UPI';
        this.showAadharBox = "hide";
        this.showUpiBox = "show";
        this.showPOSBox = "hide";
        this.showPaymentGatewayBox = "hide";
        this.showCashBox = "hide";
        this.showQRBox = "hide";
        $('.nav-link').removeClass('active');
        elm.className = "nav-link active";
        this.QRFlag = 'hide';
        this.qrValue = null;
    }
    cashPayment(elm) {
        this.paymentMode = 'CASH';
        this.showCashBox = "show";
        this.showAadharBox = "hide";
        this.showPOSBox = "hide";
        this.showUpiBox = "hide";
        this.showQRBox = "hide";
        this.showPaymentGatewayBox = "hide";
        // this.cashPay();/
        $('.nav-link').removeClass('active');
        elm.className = "nav-link active";
        this.QRFlag = "hide";
        this.qrValue = null;

    }
    posPayment(elm) {
        this.paymentMode = 'POSPAY';
        this.showPOSBox = "show";
        this.showCashBox = "hide";
        this.showAadharBox = "hide";
        this.showUpiBox = "hide";
        this.showQRBox = "hide";
        this.showPaymentGatewayBox = "hide";
        $('.nav-link').removeClass('active');
        elm.className = "nav-link active";
        this.QRFlag = "hide";
        this.qrValue = null;

    }
    showQRPayment(elm) {
        this.QRFlag = 'hide';
        this.qrValue = null;
        this.showPOSBox = "hide";
        this.showQRBox = "show";
        this.showCashBox = "hide";
        this.showAadharBox = 'hide';
        this.showUpiBox = 'hide';
        this.showPaymentGatewayBox = "hide";
        $('.nav-link').removeClass('active');
        elm.className = "nav-link active";
        this.btnPayment('QRCODE');

    }
    showPaymentGateway(elm) {
        this.showPaymentGatewayBox = "show";
        this.showQRBox = "hide";
        this.showCashBox = "hide";
        this.showAadharBox = 'hide';
        this.showUpiBox = 'hide';
        this.showPOSBox = "hide";
        $('.nav-link').removeClass('active');
        elm.className = "nav-link active";
        this.QRFlag = "hide";
        this.qrValue = null;
        // this.btnPayment('PAYMENTGATEWAY');
    }



    aadharTran(callbackUpdateTranId) {
        // this.showAadharStatusBox = true;

        //this.btnPayment();
        //Aadhar Variables
        this.aadharNo1Pay = $("#txtAadhar1").val();
        this.aadharNo2Pay = $("#txtAadhar2").val();
        this.aadharNo3Pay = $("#txtAadhar3").val();
        this.aadhar = this.aadharNo1Pay + this.aadharNo2Pay + this.aadharNo3Pay;
        this.billDetail.customerName = $("#aadharCustName").val();
        this.billDetail.customerGstNo = $("#aadharCustGstNo").val();
        this.billDetail.remark = $("#aadharRemark").val();

        var aadharModel = {
            aadharNo1: this.aadharNo1Pay,
            aadharNo2: this.aadharNo2Pay,
            aadharNo3: this.aadharNo3Pay,
            aadhar: this.aadhar,
            aadharBankList: this.aadharBankList,
            bankCode: this.bankCodePay,
            bankName: this.bankNamePay,
            amount: this.billDetail.billAmount,
            customerName: this.billDetail.customerName,
            billNumber: this.billNumberPay,
            custGSTNo: this.billDetail.customerGstNo,
            remark: this.billDetail.remark
        }
        this.aadharPayment.ThumbScan(aadharModel, this.aadharCallBack, callbackUpdateTranId, this);
    }


    clearData() {
        this.aadharNo1Pay = '';
        this.aadharNo2Pay = '';
        this.aadharNo3Pay = '';
        this.aadhar = '';
        this.aadharBankList = '';
        this.bankCodePay = '';
        this.bankNamePay = '';
        this.billDetail.billAmount = 0.00;
        this.billDetail.customerName = '';
        this.billNumberPay = '';
        this.billDetail.customerGstNo = '';
        this.billDetail.remark = '';
        this.CollectionVPAPay = '';
    }
    btnPayment(mode) {
        // alert("Demo Version!");
        // return false;
        if (mode == 'CASH' || mode == 'POS') {
            this.showDisableLink = 'showDisablebox';
            this.showPayButton = 'hide';
            this.errorStatusBtnClose = 'showInline';
        }
        this.paymentMode = mode;
        this.btnClick.emit(this.paymentMode);
    }


    btnClosePayOpt() {
        this.showThanksWindow = "show";
        // this.DivPaymentOption = false;
        this.btnClick.emit('close');
        this.showDisableLink = "";
        this.clearData();
        this.hideUpiStatus();
        this.hideAadharStatus();

        this.message = "Thanks For Using Vpay and Visit Again.";
        MessageBox.show(this.dialog, this.message, "");

    }
    btnClosePayOptFail() {
        this.showThanksWindow = "show";
        // this.DivPaymentOption = false;
        this.btnClick.emit('close1');
        // $('#myModal').modal("show");
        this.clearData();
        this.hideUpiStatus();
        this.hideAadharStatus();

        // alert("Thanks For Using Vpay and Visit Again");
        this.message = "Thanks For Using Vpay and Visit Again.";
        MessageBox.show(this.dialog, this.message, "");


    }

    closeThanksWindow() {
        this.showThanksWindow = "hide";
    }



    setBankCode() {
        let pageObj = this;
        let selectedBank = this.aadharBankList.filter(a => a.BANK_NAME == pageObj.bankNamePay);
        if (!selectedBank || (selectedBank && selectedBank.length == 0)) {
            this.message = "Please select Bank name.";
            MessageBox.show(this.dialog, this.message, "");
            this.bankNamePay = '';
            this.bankCodePay = '';
            // const txtAadharBank = this.renderer2.selectRootElement('#txtAadharBank');
            // setTimeout(() => txtAadharBank.focus(), 0);
            return false;
        }
        pageObj.bankCodePay = selectedBank[0].IIN;
    }






    cashPosPay() {
        if (confirm('Do You Want to Print Bill.')) {
            this.PrintDivByClass('showReciptBox');
        } else {

        }
    }
    /**
     * Qr Code Payment
     */
    qrCodePay() {
        // this.paymentMode = 'QRCODE';
        // this.btnPayment();
        // let tmp = await this.getNewBillNo();
        // if (!tmp) return false;
        // tmp = await this.saveTran('QRCODE');
        // if (!tmp) return false;
        let qrParamObj = {
            qRAmount: this.billDetail.billAmount,
            qrRemark: this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME,
            qrBillNo: this.billNumberPay,
            customerName: this.billDetail.customerName,
            gstNo: '' //TODO
        }
        this.qrPayment.getQrCode(this.showQr, qrParamObj, this);

    }
    showQr(paramObj, param, pageObj) {
        if (paramObj.reference_id == undefined || paramObj.reference_id == "") {
            if (paramObj.message && paramObj.message.trim().length > 0) {
                this.message = paramObj.message;
                MessageBox.show(this.dialog, this.message, "");
            }
            else {
                //   alert("Qr Code Generation Error. Please Retry.")
                this.message = "Qr Code Generation Error. Please Retry.";
                MessageBox.show(this.dialog, this.message, "");
                pageObj.QRFlag = "hide";
                return;
            }
        }
        else {
            pageObj.showQrPay = 'show';
            pageObj.showBill = 'hide';
            pageObj.qrValue = "upi://pay?pa=" + pageObj.logInfo[0].VPA + "&pn=" + pageObj.logInfo[0].MERCHANT_NAME + "&tr=" + paramObj.reference_id + "&am=" + param.AMOUNT + "&cu=INR&mc=" + pageObj.logInfo[0].TERMINAL_ID;
            pageObj.QRFlag = "show";
            //   pageObj.merchantName = pageObj.logInfo[0].MERCHANT_NAME;
            pageObj.businessName = pageObj.dataStorage.logInfo[0].BUSINESS_DETAILS;
            pageObj.merchantName = pageObj.dataStorage.logInfo[0].CLIENT_NAME;

            pageObj.showDisableLink = "showDisablebox";
            if (confirm('Do You Want to Print Bill.')) {
                //$('.showReciptBox').removeClass('hide');
                pageObj.PrintDivByClass('showReciptBox');
            } else {

            }
        }

        // this.resetPurchaseItemIconValue();

    }
    PrintDivBody(mdata) {
        var WindowObject = window.open('', 'PrintWindow', 'width=100,height=100,top=50,left=50,toolbars=yes,Menubar=no, scrollbars=yes,status=no,resizable=yes');
        WindowObject.document.writeln(mdata);
        //WindowObject.document.close();
        //WindowObject.focus();
        WindowObject.print();
        WindowObject.close();
    }
    PrintDivByClass(className) {
        var mdata = `<html><head><style>.price-sec>table.table-fixedheader { width: 100% !important;} 
    .price-sec>table.table-fixedheader,.price-sec>table.table-fixedheader>thead, .price-sec>table.table-fixedheader>tbody, .price-sec>table.table-fixedheader>thead>tr, .price-sec>table.table-fixedheader>tbody>tr, .price-sec>table.table-fixedheader>thead>tr>th, .price-sec>table.table-fixedheader>tbody>td {
        display: block !important;
    }
    .price-sec>table.table-fixedheader>thead>tr:after, .price-sec>table.table-fixedheader>tbody>tr:after {
        content:' ' !important;
        display: block !important;
        visibility: hidden !important;
        clear: both !important;
    }
    .price-sec>table.table-fixedheader>tbody {
        overflow-y: scroll !important;
        height: 100px !important ;
        
    }
    .price-sec>table.table-fixedheader>thead {
        overflow-y: scroll !important;    
    }
    .price-sec>table.table-fixedheader>thead::-webkit-scrollbar {
        background-color: inherit !important;
    }
    .price-sec>table.table-fixedheader>thead>tr>th:after, .price-sec>table.table-fixedheader>tbody>tr>td:after {
        content:' ' !important;
        display: table-cell !important;
        visibility: hidden !important;
        clear: both !important;
    }
    .price-sec>table.table-fixedheader>thead tr th, .price-sec>table.table-fixedheader>tbody tr td {
        float: left !important;    
        word-wrap:break-word !important;     
    }
    .price-sec td, th {
        white-space: normal !important; 
    }
    .reciptFont{
        font-size: 9px;
        border:0 !important;
        font-weight: bold;
        
    }
    .tableHeader{
        background: #fff;
    }
    .showReciptBox{
        position:absolute;z-index: 5000;color: #000;top: 0%; left: 0%;
    }
    </style></head><body>` + $('.' + className).html();
        this.PrintDivBody(mdata + "</body></html>");
    }

    /**
     * Pay By UPI Payment 
    */


    upiCallBack(tmp, mCust, showBusinness, showAadharTranId, pageObj) {
        let msgAadhar = tmp[0];
        pageObj.mCust = mCust;
        pageObj.showBusinness = showBusinness;
        pageObj.showAadharTranId = showAadharTranId;
        pageObj.TRAN_DET_ID = tmp[1];

        if (tmp[tmp.length - 1] == 'N') {
            pageObj.resultMessage = "error";
            pageObj.statusImage = "assets/images/error.png";
            pageObj.statusMessage = "Transaction failed";
            pageObj.business = pageObj.logInfo[0].BUSINESS_DETAILS;
            pageObj.merchantName = pageObj.logInfo[0].CLIENT_NAME;
            pageObj.customerName = pageObj.upiPaymentObj.CollectionCustomerName;
            pageObj.rrn = tmp[1];
            pageObj.collMessage = pageObj.msgcoll;          //tmp[0].replace(/-/g,'');
            //pageObj.status = "Pending";
            pageObj.balance = pageObj.upiPaymentObj.CollectionAmount;
            pageObj.tranDate = tmp[2];
            // pageObj.display='block'; 
            pageObj.showUpiStatusBox = 'show';
            pageObj.errorStatusBtnHide = 'showInline';
            pageObj.errorStatusBtnClose = 'hide';
            // pageObj.showDisableLink="showDisablebox";

        }
        else {

            pageObj.resultMessage = "success";
            pageObj.statusImage = "assets/images/success.png";
            pageObj.statusMessage = "Transaction Success.";
            pageObj.business = pageObj.logInfo[0].BUSINESS_DETAILS;
            pageObj.merchantName = pageObj.logInfo[0].CLIENT_NAME;
            pageObj.customerName = pageObj.upiPaymentObj.CollectionCustomerName;
            pageObj.rrn = tmp[1];
            pageObj.collMessage = tmp[0].replace(/-/g, '');
            pageObj.status = "Pending";
            pageObj.balance = pageObj.upiPaymentObj.CollectionAmount;
            pageObj.tranDate = tmp[2];
            pageObj.showUpiStatusBox = 'show';
            pageObj.errorStatusBtnHide = 'hide';
            pageObj.errorStatusBtnClose = 'showInline';
            pageObj.bbpsPaymemt.saveBbpsBill(pageObj);
            // $('.disabled').prop("disabled", true);
            pageObj.showDisableLink = "showDisablebox";
            if (confirm('Do You Want to Print Bill.')) {
                //$('.showReciptBox').removeClass('hide');
                pageObj.PrintDivByClass('showReciptBox');
            } else {

            }

        }
        pageObj.showUpiForm = 'hide';

    }
    payUpiPayment(callbackUpdateTranId) {
        // this.paymentMode = 'UPI';
        // this.btnPayment();
        this.CollectionVPAPay = $('#txtVpa').val();
        this.billDetail.customerName = $('#upiCustName').val();
        this.billDetail.customerGstNo = $('#upiGstNo').val();
        this.billDetail.remark = $('#upiRemark').val();
        this.upiPaymentObj = {
            CollectionVPA: this.CollectionVPAPay,
            CollectionAmount: this.billDetail.billAmount,
            CollectionCustomerName: this.billDetail.customerName,
            CollectionBillNumber: this.billNumberPay,
            CollectionGstNumber: this.billDetail.customerGstNo,
            CollectionRemarks: this.billDetail.remark
        };

        this.upiPayment.processUPI(this, this.upiPaymentObj, callbackUpdateTranId, this.upiCallBack);
    }
    closePaymentGatewayWindow() {
        this.showPaymentGatewayWindow = 'hide';
    }
    pamentGateWayCallback(pamentUrl, obj) {
        obj.showPaymentGatewayWindow = 'show';
        obj.PaymentGatewayUrl = obj.domSanitizer.bypassSecurityTrustResourceUrl(pamentUrl);
    }
    /**
     * Pay By Payment Gateway
    */
    payByPaymentGateway() {
        // this.paymentMode = 'PAYMENTGATEWAY';
        // this.btnPayment();
        // let tmp = await this.getNewBillNo();
        // if (!tmp) return false;
        // tmp = await this.saveTran('PAYMENTGATEWAY');
        // if (!tmp) return false;
        if (confirm('Do You Want to Print Bill.')) {
            this.PrintDivByClass('showReciptBox');
        } else {

        }
        this.showDisableLink = 'showDisablebox';
        this.showPayButton = 'hide';
        this.errorStatusBtnClose = 'showInline';
        let paymentGatewayObj = {
            tranamount: this.billDetail.billAmount,
            billnumber: this.billNumberPay,
            customername: this.billDetail.customerName,
        };
        this.paymentGateway.paymentGatewayPay(this.pamentGateWayCallback, paymentGatewayObj, this);
    }


    /**
    * Cash Payment
    */
    cashPay() {
        this.showDisableLink = 'showDisablebox';
        this.paymentMode = 'CASH';
        this.showPayButton = 'hide';
        this.errorStatusBtnClose = 'showInline';
        // alert("Demo Version!");
        // this.btnPayment();
        // this.btnPayment('CASH');

        if (confirm('Do You Want to Print Bill.')) {
            //$('.showReciptBox').removeClass('hide');
            this.PrintDivByClass('showReciptBox');
        } else {

        }
        // if (confirm('Do You Want to Print Bill.')) {
        //     $('.showReciptBox').removeClass('hide');
        // } else {

        // }
        //     this.showProdList = 'show';
        //     this.purchaseItemArray = null;
        //     this.purchaseItemArray = new Array<IPurchaseItem>();
        //     this.totalProduct = 0;
        //     this.totalQty = 0;
        //     this.totalAmount = 0;
        //     this.resetPurchaseItemIconValue();
    }

    getBeneficiaryData() {
        this.spinner.show();
        let param = {
            Client_Mst_ID: this.logInfo[0].CLIENT_MST_ID,
            Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
            Gateway_Mst_Id: 2,
            CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG
        };
        this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/BeneficiaryData', param, this).subscribe((data) => {
            this.spinner.hide();
            if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
                this.beneficaryList = data.cursor1;
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


    setAcNameLabel(item) {
        let l = this.beneficaryList.filter((a) => a.VPA_ADDRESS == item);
        if (l && l[0].ACCOUNT_NAME)
            this.acName = l[0].ACCOUNT_NAME;
    }

    setAmountFormat() {

        if (parseFloat(this.amountPay))
            this.amountPay = parseFloat(this.amountPay).toFixed(2);

    }


    hideUpiStatus() {
        this.showUpiStatusBox = 'hide';
        this.showUpiForm = 'show';
    }

    hideAadharStatus() {
        this.showAadharStatusBox = 'hide';
        this.showAadharForm = 'show';
    }

    termConditions() {
        this.common.TermConditons({ Term_Cond_Type: "1", loginFlag: 'A' }, this).subscribe(data => {
            if (data.code == 1) {
                this.termCondContent = data.cursor1;
            }
        });
    }





}


