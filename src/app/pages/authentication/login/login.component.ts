import { Component, OnInit, VERSION, Renderer2 } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { InputTypeDirective } from '../../../shared/directive/inputType/input-type.directive';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ICore } from '../../../interface/core';
import { ILogin } from '../../../interface/login';
import { ApiService } from '../../../core/api.service';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { Toast } from '../../../services/toast';
import { IStatement } from '../../../interface/statement';
import { Common } from '../../../services/common';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { MatDialog } from "@angular/material";
import { MessageBox } from "../../../services/_shared/message-box";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //  encapsulation: ViewEncapsulation.None
  providers: [Spinner, Common]
})
export class LoginComponent implements OnInit {

  public version = VERSION.full;
  public reactiveForm: FormGroup = new FormGroup({
    recaptchaReactive: new FormControl(null, Validators.required)
  });


  deviceId: any;
  btnGodisabled: string = 'disabled';
  hideCorpList: string = "hide";
  showCustTypes: string = "hide";
  showPasswd: string = "hide";
  // showProcessBtn: string = "btn btn-success pageValid show";
  custType: string;
  CLIENT_MST_ID: string;
  individualCursor: any;
  corporateCursor: any;
  termCondContent: string;
  loginUserType: string;
  mobileNo: string = "";
  CaptchaBox: string = "";
  password: string = "";
  msgType: string = '';
  hideCorpCode: string = 'hide';
  corporateCode: string = null;
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: this.msgType,
    closeOther: false,
    msg: ''
  }

  graphTotaldata = new Array();
  graphAadharPayData = new Array();
  graphUPIData = new Array();
  graphPaymentGateWayData = new Array();
  TCchek: boolean = true;

  //dialog
  message;
 
  constructor(private toastyService: ToastyService, private apiService: ApiService, private route: ActivatedRoute, private router: Router, private dataStorage: DataStorage,
    private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, private dialog: MatDialog,
    private renderer2: Renderer2, private common: Common) { }

  ngOnInit() {
    $('#vpayBanner').hide();
    //this.loginUserType = this.route.queryParams["_value"].loginUserType;
    this.dataStorage.loginUserType = this.loginUserType;
    this.setfirstFocus(this.loginUserType);

    $(".toggle-password").click(function () {

      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });

    $(document).ready(function () {
      //Disable cut copy paste
      $('main').bind('cut copy paste', function (e) {
        e.preventDefault();
      });

      //Disable mouse right click
      $("main").on("contextmenu", function (e) {
        return false;
      });
    });


    // var nVer = navigator.appVersion;
    // var nAgt = navigator.userAgent;
    // var browserName = navigator.appName;
    // var fullVersion = '' + parseFloat(navigator.appVersion);
    // var majorVersion = parseInt(navigator.appVersion, 10);
    // var nameOffset, verOffset, ix;


    // // In Opera 15+, the true version is after "OPR/" 
    // if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
    //   browserName = "Opera";
    //   fullVersion = nAgt.substring(verOffset + 4);
    // }
    // // In older Opera, the true version is after "Opera" or after "Version"
    // else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    //   browserName = "Opera";
    //   fullVersion = nAgt.substring(verOffset + 6);
    //   if ((verOffset = nAgt.indexOf("Version")) != -1)
    //     fullVersion = nAgt.substring(verOffset + 8);
    // }
    // // In MSIE, the true version is after "MSIE" in userAgent
    // else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    //   browserName = "Microsoft Internet Explorer";
    //   fullVersion = nAgt.substring(verOffset + 5);
    // }
    // // In Chrome, the true version is after "Chrome" 
    // else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    //   browserName = "Chrome";
    //   fullVersion = nAgt.substring(verOffset + 7);
    // }
    // // In Safari, the true version is after "Safari" or after "Version" 
    // else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    //   browserName = "Safari";
    //   fullVersion = nAgt.substring(verOffset + 7);
    //   if ((verOffset = nAgt.indexOf("Version")) != -1)
    //     fullVersion = nAgt.substring(verOffset + 8);
    // }
    // // In Firefox, the true version is after "Firefox" 
    // else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    //   browserName = "Firefox";
    //   fullVersion = nAgt.substring(verOffset + 8);
    // }
    // // In most other browsers, "name/version" is at the end of userAgent 
    // else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
    //   (verOffset = nAgt.lastIndexOf('/'))) {
    //   browserName = nAgt.substring(nameOffset, verOffset);
    //   fullVersion = nAgt.substring(verOffset + 1);
    //   if (browserName.toLowerCase() == browserName.toUpperCase()) {
    //     browserName = navigator.appName;
    //   }
    // }
    // // trim the fullVersion string at semicolon/space if present
    // if ((ix = fullVersion.indexOf(";")) != -1)
    //   fullVersion = fullVersion.substring(0, ix);
    // if ((ix = fullVersion.indexOf(" ")) != -1)
    //   fullVersion = fullVersion.substring(0, ix);

    // majorVersion = parseInt('' + fullVersion, 10);
    // if (isNaN(majorVersion)) {
    //   fullVersion = '' + parseFloat(navigator.appVersion);
    //   majorVersion = parseInt(navigator.appVersion, 10);
    // }


    // // alert("Name:" + browserName + " Version " + majorVersion)
    // this.message = "Name:" + browserName + " Version " + majorVersion;
    // MessageBox.show(this.dialog, this.message, "");
    // return false;




  }

  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;

  // }
  changeCustType(flag) {
    const rdbIndividual = this.renderer2.selectRootElement('#rdbIndividual');
    const rdbCorporate = this.renderer2.selectRootElement('#rdbCorporate');
    if (rdbCorporate.checked) {
      this.dataStorage.loginUserType = 'C';
      this.loginUserType = 'C';
      flag = 'C';
    }
    else if (rdbIndividual.checked) {
      this.dataStorage.loginUserType = 'I';
      this.loginUserType = 'I';
      flag = 'I'
    }
    this.showPasswd = "show";
    if (flag == "C") {
      this.hideCorpCode = "show";
      this.corporateCode = '';
      const txtCorporateCode = this.renderer2.selectRootElement('#txtCorporateCode');
      setTimeout(() => txtCorporateCode.focus(), 0);
    } else {
      this.hideCorpCode = "hide";
      this.CLIENT_MST_ID = this.individualCursor[0].CLIENT_MST_ID;
      this.dataStorage.client_Mst_Id = this.CLIENT_MST_ID;
      const txtPassword = this.renderer2.selectRootElement('#txtPassword');
      setTimeout(() => txtPassword.focus(), 0);
    }
    this.password = '';

  }
  setCorpId(obj) {
    this.corporateCode = obj.INSTI_SUB_MST_ID;
    this.CLIENT_MST_ID = obj.CLIENT_MST_ID;
    this.dataStorage.client_Mst_Id = this.CLIENT_MST_ID;
    const txtPassword = this.renderer2.selectRootElement('#txtPassword');
    setTimeout(() => txtPassword.focus(), 0);
  }
  setCorpClientMstId() {
    let tmp = this.corporateCursor.filter(a => (a.INSTI_SUB_MST_ID == this.corporateCode && a.LOGIN_USER_ID == this.mobileNo));
    this.CLIENT_MST_ID = tmp[0].CLIENT_MST_ID;
    this.dataStorage.client_Mst_Id = this.CLIENT_MST_ID;
    this.dataStorage.insti_sub_mst_id = tmp[0].INSTI_SUB_MST_ID;
  }

  goProcess(event) {
    if (event.keyCode === 13) {
      if (this.mobileNo.trim().length == 0) {
        this.message = "Please Enter Mobile No.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.mobileNo.trim().length !== 10) {
        this.message = "Enter a valid 10 digit mobile no.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      this.process();
    }
  }

  process() {
    if (this.mobileNo.trim().length == 0) {
      this.message = "Please Enter Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.mobileNo.trim().length != 10) {
      this.message = "Please Enter 10 digits Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.btnGodisabled = 'disabled';
    this.hideCorpCode = "hide";
    this.hideCorpList = "hide";
    this.showCustTypes = "hide";
    this.showPasswd = "show";
    this.password = '';
    this.Captcha();
    const rdbIndividual = this.renderer2.selectRootElement('#rdbIndividual');
    setTimeout(() => rdbIndividual.checked = true, 0);
    this.dataStorage.loginUserType = undefined;
    let pageObj = this;
    this.spinner.show();
    //this.common.sendMessage(this.mobileNo);
    this.apiService.sendDataBeforeLogin<ILogin>('/auth/merchant/getClientInfo', { MobileNo: this.mobileNo, setSid: true }, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg.toUpperCase() === 'SUCCESS') {

        //for set socketId


        // let url = 'http://192.168.1.149:2000';
        // let socket = io(url);
        // socket.emit('login', this.mobileNo.trim());


        //let observable = new Observable(observer => {
        // socket.on('message', (data) => {

        //   pageObj.deviceId = data; 

        //   alert(data);
        //   //socket.disconnect();
        //     debugger;
        //     //observer.next(data);
        // });
        // return () => {
        //     socket.disconnect();
        // }
        // })
        //return observable;


        pageObj.individualCursor = data.cursor1.filter(a => a.CORPORATE_FLAG == 'I');
        pageObj.corporateCursor = data.cursor1.filter(a => a.CORPORATE_FLAG == 'C');
        if (pageObj.individualCursor.length == 0 && pageObj.corporateCursor.length == 0) {
          pageObj.showPasswd = "hide";
          setTimeout(() => {
            this.message = "Client Not Found for this Mobile Number..!!";
            MessageBox.show(this.dialog, this.message, "");
          }, 50);
          return false;
        }
        if (pageObj.corporateCursor && pageObj.corporateCursor.length > 0) {
          //TODO Corporate Condition
          if (pageObj.corporateCursor.length == 1) {
            //TODO COrporate condition for single
            if (pageObj.individualCursor.length > 0) {
              //TODO Corporate and Individual for single corporate condition
              pageObj.hideCorpList = "show";
              pageObj.showCustTypes = "show";
              // const rdbIndividual = pageObj.renderer2.selectRootElement('#rdbIndividual');
              // setTimeout(() => rdbIndividual.focus(), 0);
              pageObj.changeCustType('I');
              const txtPassword = this.renderer2.selectRootElement('#txtPassword');
              setTimeout(() => txtPassword.focus(), 0);

            } else {
              pageObj.dataStorage.loginUserType = "C";
              const txtCorporateCode = this.renderer2.selectRootElement('#txtCorporateCode');
              setTimeout(() => txtCorporateCode.focus(), 0);
              pageObj.hideCorpCode = "show";
              pageObj.showPasswd = "show";
            }
          }
          else {
            //TODO Corporate condition for Multiple
            pageObj.hideCorpList = "show";

            if (pageObj.individualCursor.length > 0) {
              pageObj.changeCustType('I');
              //TODO Corporate and Individual for single corporate condition
              pageObj.showCustTypes = "show";
              const txtPassword = this.renderer2.selectRootElement('#txtPassword');
              setTimeout(() => txtPassword.focus(), 0);
            } else {
              pageObj.dataStorage.loginUserType = "C";
              pageObj.showCustTypes = "hide";
              pageObj.hideCorpCode = "show";
              pageObj.showPasswd = "show";
            }
          }

        } else {
          //TODO Individual Condition
          pageObj.dataStorage.loginUserType = "I";
          pageObj.CLIENT_MST_ID = pageObj.individualCursor[0].CLIENT_MST_ID;
          pageObj.dataStorage.client_Mst_Id = pageObj.individualCursor[0].CLIENT_MST_ID;
          pageObj.showPasswd = "show";
          pageObj.hideCorpCode = "hide";
          pageObj.showCustTypes = "hide";
          pageObj.hideCorpList = "hide";
          const txtPassword = this.renderer2.selectRootElement('#txtPassword');
          setTimeout(() => txtPassword.focus(), 0);
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        return false;
        //TODO

      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        this.mobileNo = '';
      })
    let btnLogin = $('#loginBtn');
    setTimeout(() => btnLogin.attr('disabled', 'true'), 0);

    // this.common.getMessages().subscribe(message => {
    //   //pageObj.deviceId = message;
    //   //alert(message);
    // });  //FOR SOCKET PURPOSE ONLY Remove Comment   

  }

  termConditions() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "1", loginFlag: 'B' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  privacyPolicy() {
    this.common.TermConditons({ Term_Cond_Type: "2", loginFlag: 'B' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  setfirstFocus(loginUserType: string) {
    const txtCorporateCode = this.renderer2.selectRootElement('#txtCorporateCode');
    const txtMobileNo = this.renderer2.selectRootElement('#txtMobileNo');
    if (loginUserType === 'C') {

      this.hideCorpCode = 'show';
      setTimeout(() => txtCorporateCode.focus(), 0);
    }
    else {
      this.hideCorpCode = 'hide';
      setTimeout(() => txtMobileNo.focus(), 0);
    }
  }
  login() {

    let paramObj = {
      login_user_id: this.mobileNo,
      login_pass: this.password,
      Client_Mst_Id: this.CLIENT_MST_ID,
      Insti_Sub_Mst_Id: this.corporateCode,
      Pass_Flag: 'P',
      device_id: this.deviceId,
      Device_Id: this.deviceId
    }
    let pageObj = this;
    this.spinner.show();

    this.apiService.sendDataBeforeLogin<ILogin>('/auth/merchant/login', paramObj, this).subscribe(data => {
      if (data && data.msg.toUpperCase() === 'SUCCESS') {

        // pageObj.common.getMessages().subscribe(message => {
        //   alert(message);
        // });

        pageObj.dataStorage.logInfo = data.cursor2;
        pageObj.dataStorage.logInfo.token = data.token;
        pageObj.dataStorage.logInfo.po_approvalflag = data.po_approvalflag;
        pageObj.dataStorage.logInfo.sessionId = data.sessionId;
        if (pageObj.dataStorage.logInfo[0].ADMINUSER == 'Y') {
          pageObj.dataStorage.logInfo[0].User_Flag = 'A';
        }
        else if (pageObj.dataStorage.logInfo[0].SUPERUSER == 'Y') {
          pageObj.dataStorage.logInfo[0].User_Flag = 'S';
        }
        else {
          pageObj.dataStorage.logInfo[0].User_Flag = 'I';
        }

        let pageData = data;

        if (pageData.po_approvalflag == 'N') {
          this.spinner.hide();
          this.router.navigate(['/merchantRegistration']);
          return;
        }
        else if (pageData.po_approvalflag == 'P') {
          this.spinner.hide();
          // alert("Waiting for approval");
          this.message = "Waiting for approval";
          MessageBox.show(this.dialog, this.message, "");
          this.clear();
          return;
        }
        else if (pageData.po_approvalflag == 'R') {
          this.spinner.hide();
          // alert("Application Rejected." + pageData.cursor2[0].REJECT_REASON);
          this.message = "Application Rejected." + pageData.cursor2[0].REJECT_REASON;
          MessageBox.show(this.dialog, this.message, "");
          this.router.navigate(['/merchantRegistration'], { queryParams: { approvalFlag: 'R', reqDetId: pageData.cursor2[0].CLIENT_REQ_DET_ID } });
          return;
        }
        else if (pageData.po_approvalflag == 'Y') {
          let paraml = {
            Client_Mst_Id: pageObj.dataStorage.logInfo[0].CLIENT_MST_ID,
            Insti_Sub_Mst_Id: pageObj.dataStorage.logInfo[0].INSTI_SUB_MST_ID,
            User_Flag: 'I' //pageObj.dataStorage.logInfo[0].User_Flag,
          }
          //spentanalyser use here
          this.apiService.sendToServer<ICore>('/api/statement/spentanalyser', paraml, this).subscribe(data => {
            if (data && data.msg === 'Success') {

              pageObj.dataStorage.spentAnalyzer = data.cursor1;
              //call graph statement data

              if (!pageObj.dataStorage.logInfo[0].LOGIN_DATE) {
                pageObj.dataStorage.logInfo[0].LOGIN_DATE = Date.now();
              }
              let curDate = moment(pageObj.dataStorage.logInfo[0].LOGIN_DATE).format('DD-MMM-YYYY');
              let curDateAr = curDate.split('-');
              var uinput = {
                opKeyword: "STATEMENT",
                client_mst_id: pageObj.dataStorage.logInfo[0].CLIENT_MST_ID,
                // client_mst_id: 1,
                gateway_mst_id: 0,          //this._gatewaydetid,
                fromdate: curDateAr[0] + '-' + curDateAr[1] + '-' + (parseInt(curDateAr[2]) - 1), uptodate: curDate,
                fromamt: 0.00, uptoamt: 999999, flag: 'S', recpayflag: 'A', device_id: 'D',
              }
              this.apiService.sendToServer<IStatement>('/api/statement/cstatement', uinput, this).subscribe(data => {
                if (data && data.msg !== 'Success') {
                  //this.Call_MsgDiv('SHOW',data.msg);
                }
                if (data && data.msg === 'Success') {
                  if (data.data) {
                    let i = 0;
                    let j = 0;
                    let k = 0;
                    let l = 0;
                    // data.data = data.data.sort(
                    //   function(a, b):any{ 
                    //       let x:Date = new Date(a.TRAN_DATE);
                    //       let y:Date = new Date(b.TRAN_DATE);
                    //       let z = x < y;
                    //       return  z;
                    //   }
                    // );

                    data.data = data.data.reverse();
                    for (i; i < data.data.length; i++) {
                      if (data.data[i].SUCCESS == "Y") {
                        //this.graphTotaldata[data.data.length - 1 - i] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                        this.graphTotaldata[i] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                        if (data.data[i].GATEWAY_TYPE == 'A') {
                          this.graphAadharPayData[j] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                          j++;
                        }
                        else if (data.data[i].GATEWAY_TYPE == 'C' || data.data[i].GATEWAY_TYPE == 'F' || data.data[i].GATEWAY_TYPE == 'Q') {
                          this.graphUPIData[k] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                          k++;
                        }
                        else if (data.data[i].GATEWAY_TYPE == 'P') {
                          this.graphPaymentGateWayData[l] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                          l++;
                        }
                      }
                    }
                    pageObj.dataStorage.statementAll = this.graphTotaldata;
                    pageObj.dataStorage.aadharStatmentData = this.graphAadharPayData;
                    pageObj.dataStorage.upiStatmentData = this.graphUPIData;
                    pageObj.dataStorage.pamentGateWayStatmentData = this.graphPaymentGateWayData;

                  }
                  this.spinner.hide();
                  // if(pageObj.dataStorage.logInfo[0].BANKNAME == null)
                  this.router.navigate(['/dashboard']);
                  // else
                  // this.router.navigate(['/bank']);
                  return;
                }
                else {
                  pageObj.dataStorage.statementAll = [
                    {
                      'date': moment(pageObj.dataStorage.logInfo[0].LOGIN_DATE).format('YYYY-MM-DD'),
                      'value': 0
                    }
                  ];
                  this.spinner.hide();
                  // if(pageObj.dataStorage.logInfo[0].BANKNAME == null)
                  this.router.navigate(['/dashboard']);
                  // else
                  // this.router.navigate(['/bank']);
                  return;
                }
              },
                err => {
                  this.password = '';
                  this.spinner.hide();
                  this.errorHandler.handlePageError(err);
                })

            }
            else {
              pageObj.dataStorage.statementAll = [
                {
                  'date': moment(pageObj.dataStorage.logInfo[0].LOGIN_DATE).format('YYYY-MM-DD'),
                  'value': 0
                }
              ];
              this.spinner.hide();
              // if(pageObj.dataStorage.logInfo[0].BANKNAME == null)
              this.router.navigate(['/dashboard']);
              // else
              // this.router.navigate(['/bank']);
              return;
            }
          })
        }

      }
      else {
        this.Captcha();
        this.spinner.hide();
        if (data.msg.indexOf('User Already Login') !== -1 || data.status == 'SE') {
          if (confirm('user Already Login from other device. You want to logout?')) {
            return this.logout();
          } else {
            this.clear();
            return false;
          }
        }
        else {
          this.spinner.hide();

          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          if (data.msg.indexOf("Invalid Password") > -1) {
            this.password = '';
            const txtPassword = this.renderer2.selectRootElement('#txtPassword');
            setTimeout(() => txtPassword.focus(), 0);
            this.CaptchaBox = '';
          }
          else if (data.msg.toLowerCase().indexOf("set password for existing user") > -1) {
            this.password = '';
            // const txtPassword = this.renderer2.selectRootElement('#txtPassword');
            // setTimeout(() => txtPassword.focus(), 0);
          }
          else {
            //this.clear();
          }
        }
      }

    },
      err => {
        this.Captcha();
        this.spinner.hide();
        this.password = '';
        this.CaptchaBox = '';
        this.errorHandler.handlePageError(err);

      })
    let btnLogin = $('#loginBtn');
    setTimeout(() => btnLogin.attr('disabled', 'true'), 0);

  }

  logout() {
    let paramObj = {
      login_user_id: this.mobileNo,
      Client_Mst_Id: this.CLIENT_MST_ID,
      Insti_Sub_Mst_Id: this.dataStorage.insti_sub_mst_id
    }
    let pageObj = this;
    this.apiService.sendToServer<ICore>('/auth/merchant/logout', paramObj, this).subscribe(data => {
      if (data && data.msg === 'Success') {

        this.mobileNo = '';
        this.password = '';
        // alert('Logout Successfully. Please login.');
        this.message = "Logout Successfully. Please login.";
        MessageBox.show(this.dialog, this.message, "");
        // this.option.msg = 'Logout Successfully. Please login.';
        // this.option.type = 'success';
        // this.toast.addToast(this.option);
      }

    });
  }



  submit(event) {

    if (event.keyCode === 13) {
      if (this.mobileNo.trim().length == 0) {
        this.message = "Please Enter Mobile No.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.mobileNo.trim().length !== 10) {
        // alert("Enter a valid 10 digit mobile no.");
        this.message = "Enter a valid 10 digit mobile no.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.password.trim().length == 0) {
        // alert("Please Enter Password.");
        this.message = "Please Enter Password.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
       //this.validateForm(); //change for captcha code
       this.login();
    }
  }
  clear() {
    this.mobileNo = '';
    this.password = '';
    this.CaptchaBox = '';
    this.corporateCode = '';
    this.hideCorpCode = 'hide';
    this.showPasswd = 'hide';
    this.showCustTypes = 'hide';
    this.btnGodisabled = '';
  }
  gotoHome() {
    this.router.navigate(['']);
  }

  gotoLogin() {
    this.router.navigate(['/authentication/login']);
  }
  gotoSignUp(flag: string) {
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
  gotoForgetUnLockTab(flag) {

    if (this.dataStorage.loginUserType == "C" && (!this.corporateCode || (this.corporateCode && this.corporateCode.trim().length == 0))) {
      // alert("Please Enter Corporate Code.");
      this.message = "Please Enter Corporate Code.";
      MessageBox.show(this.dialog, this.message, "");
      const txtCorporateCode = this.renderer2.selectRootElement('#txtCorporateCode');
      setTimeout(() => txtCorporateCode.focus(), 0);
      return false;
    }
    this.router.navigate(['/authentication/forgetUnlock'], {
      queryParams:
      {
        loginUserId: this.mobileNo,
        corporateCode: this.corporateCode,
        //loginUserType: this.dataStorage.loginUserType,
        pageFlag: flag
      }
    });
    //this.router.navigate(['/authentication/forgetUnlock']);
  }


  validateForm() {

    if (this.mobileNo.trim().length == 0) {
      this.message = "Please Enter Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.mobileNo.trim().length !== 10) {
      this.message = "Enter a valid 10 digit mobile no.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.password.trim().length == 0) {
      this.message = "Please Enter Password.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.CaptchaBox == "" || this.CaptchaBox.trim().length == 0) {
      this.message = "Enter Captcha.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (!this.TCchek) {
      this.message = "Please check Terms and conditions.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    // document.getElementById('log').innerHTML = '';
    var string1 = this.removeSpaces((<HTMLInputElement>document.getElementById('mainCaptcha')).value);
    var string2 = this.removeSpaces((<HTMLInputElement>document.getElementById('txtInput')).value);
    if (string1 != string2 || string2 == "") {
      this.Captcha();
      // document.getElementById('log').innerHTML += '<span style="font-size:16px; padding: 25px;">Entered Invalid Captcha</span> ';
      this.message = 'Entered Invalid Captcha';
      MessageBox.show(this.dialog, this.message, "");
      this.CaptchaBox = '';
      return false;
    }
    else {
      this.login();
    }
  }
  Captcha() {
    var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
    var i;
    for (i = 0; i < 6; i++) {
      var a = alpha[Math.floor(Math.random() * alpha.length)];
      var b = alpha[Math.floor(Math.random() * alpha.length)];
      var c = alpha[Math.floor(Math.random() * alpha.length)];
      var d = alpha[Math.floor(Math.random() * alpha.length)];
      var e = alpha[Math.floor(Math.random() * alpha.length)];
      var f = alpha[Math.floor(Math.random() * alpha.length)];
      var g = alpha[Math.floor(Math.random() * alpha.length)];
    }
    var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
    // document.getElementById("mainCaptcha").value = code
    (<HTMLInputElement>document.getElementById("mainCaptcha")).value = code
    var colors = ["#B40404", "#beb1dd", "#b200ff", "#faff00", "#0000FF", "#FE2E9A", "#FF0080", "#2EFE2E",];
    var rand = Math.floor(Math.random() * colors.length);
    //$('#mainCaptcha').css("background-color", colors[rand]);

  }
  removeSpaces(string) {
    return string.split(' ').join('');
  }


}

