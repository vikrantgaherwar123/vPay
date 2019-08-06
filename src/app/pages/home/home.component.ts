import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorage } from "../../core/dataStorage";
import { ILogin } from '../../interface/login';
import { ApiService } from '../../core/api.service';
import { ErrorHandler } from '../../core/errorHandler';
import { Common } from '../../services/common';
import "../../../assets/js/jquery.event.move.js";
import "../../../assets/js/responsive-slider2.js";
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs";
import { Spinner } from "../../services/spinner";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DataStorage, ApiService, Common, Spinner]
})
export class HomeComponent implements OnInit {

  public Vpay: any;
  logInfo: ILogin;
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

  constructor(private router: Router, private dataStorage: DataStorage, private common: Common,private errorHandler: ErrorHandler,
    private dialog: MatDialog, private apiService: ApiService, private spinner: Spinner) { }
  ngOnInit() {
    $('#vpayBanner').show();
    this.GetTC();
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
      // if (err.status == 404 || err.status == 0) {
      //   // alert('Server Unreachable, Please Try Again.');
      //   this.message = "Server Unreachable, Please Try Again.";
      //   MessageBox.show(this.dialog, this.message, "");
      // }
      // else {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      // }
    });
  }

  showModel(id) {
    if (id == 1) {
      this.Vpay = {
        logo: 'assets/images/app-01.svg',
        title: 'Aadhaar Pay',
        para1: 'Aadhaar Pay is meant for merchants to receive digital payments from customers over the counter through Aadhaar authentication. It allows for any merchant associated with any acquiring bank on Aadhaar Pay service, to allow the merchant to accept payment from a customer of any bank, by authenticating the customer’s biometrics – currently only fingerprints.',
        para2: 'The merchant must have an Smart Phone with the Aadhaar Pay supporting app and a certified biometric scanner attached with the mobile phone on the USB port and both the merchant and customer should have had linked their Aadhaar numbers to their bank accounts respectively.',
        para3: 'Aadhaar Pay simplifies digital payments by using customer’s aadhaar number and biometric credentials stored on UIDAI India stack. Aadhaar Pay is a highly secure solution supported with biometric data encryption, SSL Keys to prevent identity thefts and frauds.'
      }
    }
    else if (id == 2) {
      this.Vpay = {
        logo: 'assets/images/app-02.svg',
        title: 'AEPS Micro ATM',
        para1: 'Aadhaar Enabled Payment System is a way to get money from the bank account. This system of getting money neither requires your signature nor Debit card. You don’t even need to visit a bank branch for getting money through the Aadhaar Enabled Payment System.',
        //para2: 'The customer needs to provide the UPI reference number and get the payment notification in UPI supported banking app.',
        para3: 'AEPS transactions are card-less and pin-less, an individual can transact digitally using a Smart Phone and fingerprint/iris authentication. The interbank operation methods will provide a wider reach while the biometric authentication by Unique Identification Authority of India (UIDAI) will offer the high level of security.',
        para4: 'The AEPS system aims to empower all sections of the society by making financial and banking services available to all through Aadhaar. AEPS is nothing but an Aadhaar-enabled payment system through which you can transfer funds, make payments, deposit cash, make withdrawals, make enquiry about bank balance, etc. AEPS allows customers to make payments using their Aadhaar number and by providing Aadhaar verification at Micro ATMs. This is a simple, secure and user-friendly platform for financial transactions.',
        para5: 'Customers can carry out all transactions at merchant outlet through a Micro ATM. Except fund transfer, where you need to go to the specific bank branch office.',
      }
    }
    else if (id == 3) {
      this.Vpay = {
        logo: 'assets/images/app-03.svg',
        title: 'Unified Payments Interface',
        para1: 'UPI allows a customer to pay directly from a bank account to different merchants, both online and offline, without the hassle of typing credit card details, IFSC code, or net banking/wallet passwords.',
        para2: 'The customer needs to provide the UPI reference number and get the payment notification in UPI supported banking app.',
        para3: 'UPI is built over Immediate Payment Service (IMPS) for transferring funds. Being a digital payment system it is available 24*7 and across public holidays. Unlike traditional mobile wallets, which takes a specified amount of money from user and stores it in its own accounts, UPI withdraws and deposits funds directly from the bank account whenever a transaction is requested. ',
        para4: 'For using UPI, users need to create a Virtual Payment Address (VPA) of their choice and link it to any bank account. The VPA acts as their financial address and users need not remember beneficiary account number, IFSC codes or net banking user id/password for sending or receiving money.',
      }
    }
    else if (id == 4) {
      this.Vpay = {
        logo: 'assets/images/app-04.svg',
        title: 'UPI QR Code',
        para1: 'Scanning the QR code through your mobile will help in transferring money from one source to another. Payments made through UPI QR code will directly get transferred to the bank accounts unlike other digital wallet where payments are received from e-mails.',
        para2: 'The customer needs to scan the QR code using any of the existing banking payment app (Eg. imobile, axis mobile) to make this payment.',
        para3: 'UPI QR code is a single unified QR code capable of accepting payments from Visa, MasterCard, RuPay Cards for wider acceptance. Customer can easily make payments through UPI QR code and does not require to carry physical Debit or Credit card. ',
        para4: 'UPI QR is P2M & P2P (Person to Merchant and Person to Person) Mobile payment solution. Once the UPI QR codes are deployed on Merchant locations, user can pay the transaction amount using UPI QR enabled mobile banking apps without sharing any user credentials to the merchant. It is a quick method of payment.',
      }
    }
    else if (id == 5) {
      this.Vpay = {
        logo: 'assets/images/app-05.svg',
        title: 'Bharat QR Based Payment',
        para1: 'Scanning the QR code through your mobile will help in transferring money from one source to another. Payments made through Bharat QR code will directly get transferred to the bank accounts unlike other digital wallet where payments are received from e-mails.',
        para2: 'The customer needs to scan the QR code using any of the existing banking payment app (Eg. imobile, axis mobile) to make this payment.',
        para3: 'Bharat QR code is a single unified QR code capable of accepting payments from Visa, MasterCard, RuPay Cards for wider acceptance. Customer can easily make payments through Bharat QR code and does not require to carry physical Debit or Credit card. ',
        para4: 'Bharat QR is P2M (Person to Merchant) Mobile payment solution. Once the BQR codes are deployed on Merchant locations, user can pay the transaction amount using BQR enabled mobile banking apps without sharing any user credentials to the merchant. It is a quick method of payment.',
      }
    }
    else if (id == 6) {
      this.Vpay = {
        logo: 'assets/images/app-06.svg',
        title: 'Bharat Bill Payment System',
        para1: 'Bharat Bill Payments System is an integrated online platform for all kinds of bill payments. It would connect the utility service companies on one end and all payments service providers on the other. ',
        para2: 'The customer needs to provide its Bill no./ Subscriber ID/ Mobile no. of electricity, telecom, DTH, gas, water bills etc. and will receive instant confirmation of payment via an SMS or receipt.',
        para3: 'Bharat Bill Payment System eases the payment of bills and improves the security & speed of bill pay. An instant confirmation is generated for the bill payments. The BBPS will transform the society from cash to electronic payment system, making it less dependent on cash .Currently you can pay bill for Utility (Gas, electricity, water, DTH) and Telecom billers.',
        para4: 'The platform provides an interoperable service through a digital and network of agents i.e. bank internet banking, mobile banking and retail shops for consumer to do a bill payment, at one place, anytime anywhere.',
        para5: 'Upcoming feature in BBPS are all other kind of bill payments such as school fee, university fee, municipality taxes, mutual funds and insurance premiums will be included.',
      }
    }
    else if (id == 7) {
      this.Vpay = {
        logo: 'assets/images/app-07.svg',
        title: 'FASTag',
        para1: 'FASTag is a simple to use, reloadable tag which enables automatic deduction of toll charges and lets you pass through the toll plaza without stopping for the cash transaction. FASTag has a validity of 5 years and after purchasing it, you only need to recharge/ top up the FASTag as per your requirement.',
        para2: 'FASTag is a device that employs Radio Frequency Identification (RFID) technology for making toll payments directly from the prepaid account linked to it. It is affixed on the windscreen of your vehicle and enables you to drive through toll plazas.',
        para3: 'FASTag is a perfect solution for a hassle free trip on national highways. FASTag is presently operational at 360+ toll plazas across national and state highways. More toll plazas will be brought under the FASTag program in the future.',
        para4: 'FASTag offers near non-stop movement of vehicles through toll plazas and the convenience of cashless payment of toll fee with nation-wide interoperable Electronic Toll Collection Services.',
      }
    }
    else if (id == 8) {
      this.Vpay = {
        logo: 'assets/images/app-08.svg',
        title: 'Payment Gateway',
        para1: 'Payment gateway services are required for Debit and credit card processing. It’s the same exact process as a point of service (POS) device does when you pay for your lunch at restaurant.',
        para2: 'A payment gateway is an ecommerce service that processes credit and debit card payments for online and traditional brick and mortar stores. Payment gateways facilitate these transactions by transferring key information between payment portals such as web-enabled mobile devices/websites and the front end processor/bank.',
        para3: 'The Payment gateways works with your purchase items from a brick and mortar retailer. So, the main role of a payment gateway is to authorize transactions between you and your customers.',
      }
    }

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

interface Message {
  message: string;
}