// =====================================================================
//Original Author : Vivek Tondare
//Creation Date   : 30/5/2018 
//Project Name    : VPay
//Module Name	    : Reports
//Page Name       : ClientReports
//     Modify Author	  -    Modify Date    -     Reason Of Modify

//1)
//2)
//3)
//=====================================================================

import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';

import { ErrorHandler } from '../../../../../core/errorHandler';
import { Spinner } from '../../../../../services/spinner';
import { ApiService } from '../../../../../core/api.service';
import { DataStorage } from '../../../../../core/dataStorage';
import { Router } from '@angular/router';
import { ICore } from '../../../../../interface/core';
import { ILogin } from '../../../../../interface/login';
import { Common } from '../../../../../services/common';
import { IBillCollectionUPI } from '../../../../../interface/billCollectionUPI';
declare let jsPDF;
// import * as jspdf from 'jspdf';  
import * as html2canvas from 'html2canvas'; 
@Component({
    selector: 'R-vgipl-fixQr',
    templateUrl: './fixQrCode.html',
    styleUrls: ['./fixQrCode.scss'],
    providers :[Spinner]
  })

  export class FixQrCodeComponent implements OnInit {


    @ViewChild('exportthis2') el: ElementRef;
    
    login_user_id:string;
    successDialoage:boolean=false;
    failureDialoage:boolean=false;
    logInfo:ILogin;
    smallQRImg: boolean = true;
    largeQRImg: boolean = false;
    showLargeQr:string = 'col-md-6 hide';
    showSmallQr:string = 'col-md-6 show';
    termCondContent: string;

  //FIX QR
    showFQR:any;
    showQR:any;
    QRFlag:any = false;
    QRAmount: any = '';
    QRCustomerName: any = '';
    QRBillNumber: any = '';
    QRGstNumber: any = '';
    QRRemarks: any = '';
    QRDATA: any = '';
    //END
    showCollReqF: boolean = true;
    clientMstId: number;
    businessName:string;
    merchantName:string;

    constructor( private dataStorage: DataStorage, private spinner: Spinner, private common: Common){
    }
    ngOnInit() {
      this.logInfo = this.dataStorage.logInfo[0];
      this.businessName =this.dataStorage.logInfo[0].BUSINESS_DETAILS;
      this.merchantName = this.logInfo.CLIENT_NAME;
      this.QRDATA = "upi://pay?pa="+this.dataStorage.logInfo[0].VPA+"&pn="+this.dataStorage.logInfo[0].MERCHANT_NAME+"&tr=ATCFQ" + this.dataStorage.logInfo[0].LOGIN_USER_ID + this.dataStorage.logInfo[0].CLIENT_MST_ID + "&am=0&cu=INR&mc="+this.dataStorage.logInfo[0].TERMINAL_ID;
    }


    
pageHelp() {
  // alert('term condition');
  this.common.TermConditons({ Term_Cond_Type: "4", loginFlag: 'A' }, this).subscribe(data => {
    if (data.code == 1) {
      this.termCondContent = data.cursor1;
    }
  });
}

    generatePdf(){
      this.showLargeQr = 'col-md-6 show';
      this.showSmallQr = 'col-md-6 hide';
      if(this.showLargeQr =='col-md-6 show'){
        setTimeout(() => {
          this.downloadP();
            },2000);
            console.clear();
      }    
    }

    downloadP(){
      let obj = this;
      html2canvas(document.getElementById('exportthis2')).then(function(canvas) {
      var img = canvas.toDataURL("image/png",1.0);
      var options = {orientation: 'p', unit: 'mm'};
      var doc = new jsPDF(options);
      // doc.addImage(img,'PNG', 0, 0,200, 250);
      doc.addImage(img,'PNG', 40, 40, 130, 250);
      doc.save('VpayQrP.pdf');
      });
      obj.showLargeQr = 'col-md-6 hide';
      obj.showSmallQr = 'col-md-6 show';

    }
  }