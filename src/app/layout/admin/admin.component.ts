import { Component, ElementRef, Input, OnInit, AfterViewInit, Output, ViewChild, EventEmitter, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import * as screenfull from 'screenfull';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { DomSanitizer } from '@angular/platform-browser';
import { ICore } from '../../interface/core';
import { ILogin } from '../../interface/login';
import { Common } from '../../services/common';
import { ApiService } from '../../core/api.service';
import { ErrorHandler } from '../../core/errorHandler';
import { DataStorage } from '../../core/dataStorage';
import { Toast } from '../../services/toast';
import * as moment from 'moment';
// import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
// import {Keepalive} from '@ng-idle/keepalive';
import { Spinner } from '../../services/spinner';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { Subscription } from "rxjs/Subscription";
import * as $ from 'jquery';

//import * as io from 'socket.io-client';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [Common, Spinner],
  animations: [
    trigger('mobileMenuTop', [
      state('no-block, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('yes-block',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('no-block <=> yes-block', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})


export class AdminComponent implements OnInit, DoCheck {

  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  tab5: any;
  tab6: any;
  tab7: any;
  tab8: any;
  tab9: any;
  totalNotification = 0;
  bbpsFlag: any;
  messages = [];
  connection;
  message = "";
  userDetClass: string;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  hideMenuBar: boolean = false;
  notificationArray: any;
  logInfo: ILogin;
  menuItemArray: any;
  navType: string; /* st1, st2(default), st3, st4 */
  themeLayout: string; /* vertical(default) */
  layoutType: string; /* dark, light */
  verticalPlacement: string; /* left(default), right */
  verticalLayout: string; /* wide(default), box */
  deviceType: string; /* desktop(default), tablet, mobile */
  verticalNavType: string; /* expanded(default), offcanvas */
  verticalEffect: string; /* shrink(default), push, overlay */
  vNavigationView: string; /* view1(default) */
  pcodedHeaderPosition: string; /* fixed(default), relative*/
  pcodedSidebarPosition: string; /* fixed(default), absolute*/
  headerTheme: string; /* theme1(default), theme2, theme3, theme4, theme5, theme6 */
  logoTheme: string; /* theme1(default), theme2, theme3, theme4, theme5, theme6 */

  innerHeight: string;
  windowWidth: number;

  toggleOn: boolean;

  headerFixedMargin: string;
  navBarTheme: string; /* theme1, themelight1(default)*/
  activeItemTheme: string; /* theme1, theme2, theme3, theme4(default), ..., theme11, theme12 */

  isCollapsedMobile: string;
  isCollapsedSideBar: string;

  chatToggle: string;
  chatToggleInverse: string;
  chatInnerToggle: string;
  chatInnerToggleInverse: string;

  menuTitleTheme: string; /* theme1, theme2, theme3, theme4, theme5(default), theme6 */
  itemBorder: boolean;
  itemBorderStyle: string; /* none(default), solid, dotted, dashed */
  subItemBorder: boolean;
  subItemIcon: string; /* style1, style2, style3, style4, style5, style6(default) */
  dropDownIcon: string; /* style1(default), style2, style3 */
  configOpenRightBar: string;
  isSidebarChecked: boolean;
  isHeaderChecked: boolean;
  CorporateFlag: any;
  showUserIcon: boolean = false;
  bbpsMenu: boolean = false;
  masterMenu: boolean = false;
  statemenuMenu: boolean = false;
  productMenu: boolean = false;
  clientPhoto: string;
  mobileNo: string;
  password: string = "";
  MenuDisplay: string = "hideMenu";
  showBalSec: boolean = true;
  balance: string;
  businessName: string;
  clientName: string;
  Totalbalance: string = '';
  headerClientName: string = '';
  headerBalance: string = '';
  loginDate: string = '';
  loginTime: string = '';
  msgType: string = '';
  option = {
    position: 'top-right',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: this.msgType,
    closeOther: false,
    msg: ''
  }

  //dialog
  title;
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
  graphTotaldata = new Array();
  userTypeCaption: string;
  banklogo: any = null;
  bankname: any;
  @Output() graphData = new EventEmitter<any>();
  @Output() cardData = new EventEmitter<any>();
  //@ViewChild('searchFriends') search_friends: ElementRef;
  //@ViewChild('hideMenu') hideMenu: ElementRef;
  //hideMenu:boolean;
  /*  @ViewChild('toggleButton') toggle_button: ElementRef;
    @ViewChild('sideMenu') side_menu: ElementRef;*/



  //==============================
  constructor(public menuItems: MenuItems, private domSanitizer: DomSanitizer, private dialog: MatDialog,
    private dataStorage: DataStorage, private errorHandler: ErrorHandler, private toast: Toast, private apiService: ApiService,
    private router: Router, private common: Common, private spinner: Spinner) {
    this.navType = 'st2';
    this.themeLayout = 'vertical';
    this.vNavigationView = 'view1';
    this.verticalPlacement = 'left';
    this.verticalLayout = 'wide';
    this.deviceType = 'desktop';
    this.verticalNavType = 'expanded';
    this.verticalEffect = 'shrink';
    this.pcodedHeaderPosition = 'fixed';
    this.pcodedSidebarPosition = 'fixed';
    this.headerTheme = 'theme2';
    this.logoTheme = 'theme1';

    this.toggleOn = true;

    this.headerFixedMargin = '0px';
    this.navBarTheme = 'themelight1';
    this.activeItemTheme = 'theme4';

    this.isCollapsedMobile = 'no-block';
    this.isCollapsedSideBar = 'no-block';

    this.chatToggle = 'out';
    this.chatToggleInverse = 'in';
    this.chatInnerToggle = 'off';
    this.chatInnerToggleInverse = 'on';

    this.menuTitleTheme = 'theme5';
    this.itemBorder = true;
    this.itemBorderStyle = 'none';
    this.subItemBorder = true;
    this.subItemIcon = 'style6';
    this.dropDownIcon = 'style1';
    this.isSidebarChecked = true;
    this.isHeaderChecked = true;

    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributes(this.windowWidth);



  }

  //TODO SOCKET==============================
  // sendMessage() {
  //   this.common.sendMessage(this.message);
  //   this.message = '';
  // }

  //================================
  ngDoCheck() {
    this.notificationArray = this.dataStorage.notificationData;
    this.totalNotification = this.notificationArray.length;

  }
  ngAfterViewInit() {
    //screenfull.toggle();

  }
  ngOnInit() {

    $('#vpayBanner').hide();

    // this.sendMessage();
    // // Socket=====================
    // this.common.getMessages().subscribe(message => {
    //   alert(message + "  admin");
    //   this.messages.push(message);
    // })

    this.logInfo = this.dataStorage.logInfo;
    this.CorporateFlag = this.logInfo[0].CORPORATE_FLAG;
    this.bbpsFlag = this.logInfo[0].BBPS_FLAG;
    this.bankname = this.logInfo[0].BANKNAME;
    if (this.logInfo[0].BANKFULLLOGO != null) {
      this.banklogo = this.arrayBufferToBase64(this.logInfo[0].BANKFULLLOGO.data);
    }
    this.getRefreshBal();
    this.userTypeCaption = this.logInfo[0].CORPORATE_FLAG == "C" ? "Vpay Corporate" : "";
    // // sets an idle timeout of 5 seconds, for testing purposes.
    // //https://github.com/HackedByChinese/ng2-idle-example
    // this.idle.setIdle(5);
    // // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    // this.idle.setTimeout(5);
    // // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    // this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    // this.idle.onTimeout.subscribe(() => {
    //   this.idleState = 'Timed out!';
    //   this.timedOut = true;
    //   alert('Your session expired, Login to continue..');
    //   //window.close();
    //   var obj = {};
    //   this.spinner.show();
    //   this.gotoLogout();

    // });








    this.message = this.logInfo[0].LOGIN_USER_ID;

    //let menuItems = this.menuItems;
    if (this.logInfo[0].CORPORATE_FLAG == 'C' && this.logInfo[0].ADMINUSER == 'Y' && this.logInfo[0].SUPERUSER == 'Y') {
      if (this.bbpsFlag == "Y") {
        // this.menuItemArray = this.menuItems.getAll('AB');
        this.bbpsMenu = true;
        this.masterMenu = true;
        this.statemenuMenu = true;
        this.productMenu = true;
      }
      else {
        // this.menuItemArray = this.menuItems.getAll('A');
        this.masterMenu = true;
        this.statemenuMenu = true;
        this.productMenu = true;
      }
      $(document).ready(function () {
        $('li a').ready(function () {
          $('li a').addClass("paddingNav");
          // $(this).addClass("paddingNav");
        });
      });
    }
    else if (this.logInfo[0].CORPORATE_FLAG == 'C' && this.logInfo[0].SUPERUSER == 'Y') {
      if (this.bbpsFlag == "Y") {
        this.bbpsMenu = true;
        this.masterMenu = true;
        this.statemenuMenu = true;
        this.productMenu = true;
        // this.menuItemArray = this.menuItems.getAll('SB');
      }
      else {
        this.masterMenu = true;
        this.statemenuMenu = true;
        this.productMenu = true;
        // this.menuItemArray = this.menuItems.getAll('S');
      }
      $(document).ready(function () {
        $('li a').ready(function () {
          $('li a').addClass("paddingNav");
          // $(this).addClass("paddingNav");
        });
      });
    }
    else {
      if (this.bbpsFlag == "Y") {
        this.bbpsMenu = true;
        this.productMenu = true;
        // this.menuItemArray = this.menuItems.getAll('IB');
      }
      else {
        this.productMenu = true;
        // this.menuItemArray = this.menuItems.getAll('I');
      }
      //   let array=this.menuItems.getAll('I');
      //   if(this.bbpsFlag =="Y"){
      //      let array4 = array[0].main.filter((c) => {
      //     if(c.short_label != 'bb' && c.short_label != 'bn'){
      //          return c
      //     }});

      //   }else{
      //  this.menuItemArray = this.menuItems.getAll('I');
      //   }
    }
    if (this.logInfo[0].BUSINESS_DETAILS && this.logInfo[0].BUSINESS_DETAILS.trim().length > 0) {
      this.businessName = this.logInfo[0].BUSINESS_DETAILS;
      this.userDetClass = 'business-details';
    }
    else {
      this.userDetClass = 'user-details';
    }
    //this.mobileNo = this.activatedRoute.queryParams["_value"].mobileNo;
    this.mobileNo = this.logInfo[0].LOGIN_USER_ID;
    this.balance = this.logInfo[0].BALANCE; //.toFixed(2);
    this.clientName = this.logInfo[0].CLIENT_NAME;
    if (this.logInfo[0].CLIENT_PHOTO) {
      this.clientPhoto = "data:image/JPEG;base64," + this.logInfo[0].CLIENT_PHOTO;
      this.showUserIcon = false;
    }
    else
      this.showUserIcon = true;
    this.headerClientName = this.clientName;
    //this.headerBalance = this.dataStorage.spentAnalyzer[this.dataStorage.spentAnalyzer.length - 1].BAL;
    this.loginDate = moment(this.logInfo[0].LOGIN_DATE).format('DD-MM-YYYY');
    this.loginTime = this.logInfo[0].LOGIN_TIME;

  }


  ShowMenu(value1) {
    if (value1 == "showMenu")
      this.MenuDisplay = 'hideMenu';
    else
      this.MenuDisplay = 'showMenu';
  }

  onClick(check) {
    if (this.MenuDisplay == "showMenu")
      this.MenuDisplay = 'hideMenu';

    if (check == 1) {
      this.tab = 'tab1';
      this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
    } else if (check == 2) {
      this.tab = 'tab2';
      this.tab = 'tab2';
      // if (this.bankname == null)
      //   this.router.navigate(['/settings'], { queryParams: { ID: check } });
      // else
        this.router.navigate(['/bank']);
      // this.router.navigate(['/bankModal']);
    } else if (check == 3) {
      this.tab = 'tab3';
      this.router.navigate(['/billPayment/receiveMoney']);
    } else if (check == 4) {
      this.tab = 'tab4';
      this.router.navigate(['/billPayment/sendMoney']);
    } else if (check == 5) {
      this.tab = 'tab5';
      this.router.navigate(['/insurance']);
    } else if (check == 11) {
      this.tab = 'tab11';
      this.router.navigate(['/products']);
    } else if (check == 6) {
      this.tab = 'tab6';
      this.router.navigate(['/bbps']);
    } else if (check == 8) {
      this.tab = 'tab8';
      this.router.navigate(['/statements']);
    } else if (check == 9) {
      this.tab = 'tab9';
      this.router.navigate(['/settings']);
    } else if (check == 10) {
      this.tab = 'tab10';
      this.router.navigate(['/StatementOfTransaction']);
    } else if (check == 7) {
      this.tab = 'tab7';
      this.router.navigate(['/master']);
    }

  }





  onMenuToggle() {

    var yourUl = document.getElementById("idMenu");
    if (yourUl.style.display === "none" || yourUl.style.display === " ") {
      yourUl.style.display = "block";
    } else {
      yourUl.style.display = "none";
    }

  }

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
  goToPage(path) {
    debugger;
    this.router.navigate([path]);
  }

  gotoLogout() {
    let paramObj = {
      login_user_id: this.mobileNo,
      Client_Mst_Id: this.logInfo[0].CLIENT_MST_ID,
      Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID
    }
    let pageObj = this;
    // if (!confirm('Do you want to logout?'))
    //   return false;
    this.apiService.sendToServer<ICore>('/auth/merchant/logout', paramObj, this).subscribe(data => {
      if (data && data.msg === 'Success') {

        this.mobileNo = '';
        this.password = '';
        // alert('Logout Successfully.');
        this.message = "Logout Successfully";
        MessageBox.show(this.dialog, this.message, "");
        // this.option.msg = 'Logout Successfully. Please login.';
        // this.option.type = 'success';
        // this.toast.addToast(this.option);
        pageObj.spinner.hide();
        pageObj.router.navigate(['/home']);
      }
      else {
        pageObj.spinner.hide();
        pageObj.router.navigate(['/home']);
      }

    },
      err => {
        pageObj.router.navigate(['/home']);
      });
  }
  getRefreshBal() {
    //this.VibrateButton();
    this.getBalace();
    //this.getTotalBalance();
  }

  getBalace() {
    //alert('test');
    if (this.logInfo[0].CLIENT_MST_ID != "") {
      var paramObj = {
        client_mst_id: this.logInfo[0].CLIENT_MST_ID,
        device_id: 'Desktop',
        login_user_id: this.mobileNo,
        request_from: 'WB',
        CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG,
        Corporate_Flag: this.logInfo[0].CORPORATE_FLAG
      };
      this.spinner.show();
      this.apiService.sendDataBeforeLogin<ICore>('/api/virtualpay/GetBal', paramObj, this).subscribe((data) => {
        this.spinner.hide();
        if (data.code == 1) {
          if (data.result != null) {
            localStorage.setItem('Balance', data.result);
            var balance = localStorage.getItem('Balance');
            this.balance = 'VPAY Balance : ₹' + parseFloat(balance).toFixed(2);

          }
          else {
            this.balance = 'VPAY Balance :₹ 0.00';

          }
          if (this.logInfo[0].ADMINUSER == 'Y' || this.logInfo[0].SUPERUSER == 'Y') {
            this.getTotalBalance();
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
  }

  getTotalBalance() {
    //alert('test');
    if (this.logInfo[0].CLIENT_MST_ID != "") {
      var paramObj = {
        client_mst_id: this.logInfo[0].CLIENT_MST_ID,
        device_id: 'Desktop',
        login_user_id: this.mobileNo,
        request_from: 'WB',
        CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG,
        Corporate_Flag: this.logInfo[0].CORPORATE_FLAG
      };
      this.spinner.show();
      this.apiService.sendDataBeforeLogin<ICore>('/api/virtualpay/GetTotBalance', paramObj, this).subscribe((data) => {
        this.spinner.hide();
        if (data.code == 1) {
          if (data.result != null) {
            // var T_balance = data.result; 
            localStorage.setItem('T_Balance', data.result);
            var T_balance = localStorage.getItem('T_Balance');
            this.Totalbalance = 'Total Balance : ₹ ' + parseFloat(T_balance).toFixed(2);
          }
          else {
            // localStorage.setItem('Total_Balance','0.00');
            this.Totalbalance = 'Total Balance : ₹ 0.00';
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
  }

  getSpentData() {
    let pageObj = this;
    let datas: any = {
      total: null,
      aadhar: null,
      upi: null,
      paymentGateway: null,
      bbps: null,
      fastTag: null,
      bharatQrCode: null,
      graphFlag: 'serial'
    }
    let paraml = {
      Client_Mst_Id: pageObj.dataStorage.logInfo[0].CLIENT_MST_ID,
      Insti_Sub_Mst_Id: pageObj.dataStorage.logInfo[0].INSTI_SUB_MST_ID,
      User_Flag: 'I'      //pageObj.dataStorage.logInfo[0].User_Flag,
    }
    this.common.getSpentAnalyser(paraml, this).subscribe(data => {
      if (data && data.msg === 'Success') {
        debugger;
        pageObj.dataStorage.spentAnalyzer = data.cursor1;


        this.cardData.emit(pageObj.dataStorage.spentAnalyzer);
        let ad = pageObj.dataStorage.spentAnalyzer.filter(a => a.GATEWAY_CODE == "AADHARPS");
        if ($('#cardAadhar')[0] != undefined)
          $('#cardAadhar')[0].innerHTML = '<i _ngcontent-c7="" class="icofont icofont-cur-rupee-false"></i> ' + parseFloat(ad[0].BAL).toFixed(2);

        let upiV = pageObj.dataStorage.spentAnalyzer.filter(a => a.GATEWAY_CODE == "UPIVPA");
        if ($('#cardUpi')[0] != undefined)
          $('#cardUpi')[0].innerHTML = '<i _ngcontent-c7="" class="icofont icofont-cur-rupee-false"></i> ' + parseFloat(upiV[0].BAL).toFixed(2);

        let payGat = pageObj.dataStorage.spentAnalyzer.filter(a => a.GATEWAY_CODE == "PAYG");
        if ($('#cardPaymentGateway')[0] != undefined)
          $('#cardPaymentGateway')[0].innerHTML = '<i _ngcontent-c7="" class="icofont icofont-cur-rupee-false"></i> ' + parseFloat(payGat[0].BAL).toFixed(2);

        let bb = pageObj.dataStorage.spentAnalyzer.filter(a => a.GATEWAY_CODE == "BBP");
        if ($('#cardBbps')[0] != undefined)
          $('#cardBbps')[0].innerHTML = '<i _ngcontent-c7="" class="icofont icofont-cur-rupee-false"></i> ' + parseFloat(bb[0].BAL).toFixed(2);
        this.headerBalance = data.cursor1[6].BAL;
        //call graph statement data
        let curDate = moment(pageObj.dataStorage.logInfo[0].LOGIN_DATE).format('DD-MMM-YYYY');
        let curDateAr = curDate.split('-');
        var uinput = {
          opKeyword: "STATEMENT",
          client_mst_id: pageObj.dataStorage.logInfo[0].CLIENT_MST_ID,
          // client_mst_id: 1,
          gateway_det_id: 0,          //this._gatewaydetid,
          fromdate: curDateAr[0] + '-' + curDateAr[1] + '-' + (parseInt(curDateAr[2]) - 1), uptodate: curDate,
          fromamt: 0.00, uptoamt: 999999, flag: 'S', recpayflag: 'A', device_id: 'D',
        }
        this.common.getStatement(uinput, this).subscribe(data => {
          if (data && data.msg !== 'Success') {
            //this.Call_MsgDiv('SHOW',data.msg);
          }
          if (data && data.msg === 'Success') {
            if (data.data) {
              let i = 0;
              for (i; i < data.data.length; i++) {
                if (data.data[i].SUCCESS == "Y")
                  this.graphTotaldata[data.data.length - 1 - i] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
              }
              pageObj.dataStorage.statementAll = this.graphTotaldata;
              datas.total = this.graphTotaldata
              this.graphData.emit(datas);
              this.getRefreshBal();
            }
            this.router.navigate(['/dashboard']);
            return;
          }
          else {
            pageObj.dataStorage.statementAll = [
              {
                'date': moment(pageObj.dataStorage.logInfo[0].LOGIN_DATE).format('YYYY-MM-DD'),
                'value': 0
              }
            ];
            this.router.navigate(['/dashboard']);
            return;
          }
        },
          err => {
            this.toast.addToast(this.option);
          })

      }
      else {
        pageObj.dataStorage.statementAll = [
          {
            'date': moment(pageObj.dataStorage.logInfo[0].LOGIN_DATE).format('YYYY-MM-DD'),
            'value': 0
          }
        ];
      }
    });
  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
    /* menu responsive */
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.deviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    /* for check device */
    if (reSizeFlag) {
      this.setMenuAttributes(this.windowWidth);
    }
  }

  setMenuAttributes(windowWidth) {

    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'tablet';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
    if (this.hideMenuBar) {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
      if (!screenfull.isFullscreen)
        screenfull.toggle();
      this.hideMenuBar = false;
    } else {
      this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
      if (screenfull.isFullscreen)
        screenfull.toggle();
    }
  }
  toggleMenu(pagePath) {
    if (pagePath[2] && pagePath[2] == 'productSale') {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
      this.hideMenuBar = true;
      if (!screenfull.isFullscreen)
        screenfull.toggle();
    } else {
      this.hideMenuBar = false;
      if (screenfull.isFullscreen)
        screenfull.toggle();
    }
    let tmpPath = '';
    if (pagePath.length > 1) {
      tmpPath = pagePath[0] + "/" + pagePath[1];
      let i = 2;
      for (i; i < pagePath.length; i++)
        tmpPath += "/" + pagePath[i];
    }
    if (this.bankname == null) {
      if (tmpPath == "//bank") {
        this.router.navigate(['/settings/setBankDetails']);
      }
      else {
        this.router.navigate([tmpPath]);
      }
    } else {
      this.router.navigate([tmpPath]);
    }

  }


  toggleOpened() {

    // if (this.windowWidth < 768) {
    //   this.toggleOn = this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
    // }
    // this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';

    if (this.windowWidth < 768) {
      this.toggleOn = this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
      this.toggleOn = true;
      this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
      // this.verticalNavType = 'offcanvas';
    } else {
      if (this.hideMenuBar) {
        this.toggleOn = true;
        this.verticalNavType = 'offcanvas';
        if (!screenfull.isFullscreen)
          screenfull.toggle();
        this.hideMenuBar = false;
      } else {
        this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
        // if(screenfull.isFullscreen)
        // screenfull.toggle();
      }
    }



  }

  onClickedOutside(e: Event) {
    if (this.windowWidth < 768 && this.toggleOn && this.verticalNavType !== 'offcanvas') {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
    }
  }

  onMobileMenu() {
    this.isCollapsedMobile = this.isCollapsedMobile === 'yes-block' ? 'no-block' : 'yes-block';
  }

  toggleOpenedSidebar() {
    this.isCollapsedSideBar = this.isCollapsedSideBar === 'yes-block' ? 'no-block' : 'yes-block';
  }


  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: "Logout",
      content: "Do you want to logout?",
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
        this.gotoLogout();
    });
  }
}
