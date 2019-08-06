import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DataStorage } from './dataStorage';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Injectable()
export class ErrorHandler {

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
    constructor(private router: Router, private dataStorage: DataStorage,
        private dialog: MatDialog) {

    }
    /**
     * Handle Page Error 
     */
    handlePageError(error) {
        if (error != undefined) {
            if (error.status == 404 || error.status == 0 || error.status == 500) {
                this.message = "Server Unreachable, Please Try Again.";
                MessageBox.show(this.dialog, this.message, "");
                return false;
            }

            if (error.status == 401) {
                if (error.error.message)
                    this.message = error.error.message;
                if (error.error.msg) {
                    if (error.error.msg.indexOf("ORA") > -1) {
                        this.message = "Something Went Wrong, Please Try After Sometime.";
                    } else
                        this.message = error.error.msg;
                }
                MessageBox.show(this.dialog, this.message, "");
                return false;
            }
            if (error.indexOf("ORA") > -1) {
                this.message = "Something Went Wrong, Please Try After Sometime.";
                MessageBox.show(this.dialog, this.message, "");
                return false;
            }
            if (error.error) {

                // alert(error.error.msg);
                //this.router.navigate(['/']);
                // alert(JSON.parse(error.error).msg);
                this.message = JSON.parse(error.error).msg;
                MessageBox.show(this.dialog, this.message, "");
                return;
            }


            if (error._body) {
                try {
                    if (typeof (error._body) === "string" && JSON.parse(error._body).msg) {
                        let errObj = JSON.parse(error._body);
                        switch (errObj.status) {
                            case 'ODL':     // ODL = other Device Login
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                this.router.navigate(['/']);
                                break;
                            case 'STEP':     // STEP = send to error page
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                this.router.navigate(['/error']);
                                break;
                            case 'OTH':     // OTH = other error
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                break;
                            case 'JCE':     // JCE = js conversion error
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                break;
                            case 'SE':     // SE = session expire
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                this.router.navigate(['/']);
                                break;
                            case 'PE':     // PE = parse error
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                break;
                            case 'SDNULL':     // send null data
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                break;
                            default:
                                // alert(errObj.msg);
                                this.message = errObj.msg;
                                MessageBox.show(this.dialog, this.message, "");
                                break;
                        }
                    }
                    else if (error._body.type && error._body.type === 'error') {
                        this.dataStorage.data = 'Server error or Server Unreachable.';
                        this.router.navigate(['/error']);
                    }
                    else {
                        this.dataStorage.data = 'Server error.';
                        this.router.navigate(['/error']);
                    }
                }
                catch (err) {
                    // alert(err.message);
                    this.message = err.message;
                    MessageBox.show(this.dialog, this.message, "");
                    this.router.navigate(['/error']);
                }

            }
            else if (typeof (error) === "string") {
                // alert(error);
                this.message = error;
                MessageBox.show(this.dialog, this.message, "");
                return false;

                // try {
                //     if (JSON.parse(error).status) {
                //         let errObj = JSON.parse(error)
                //         switch (errObj.status) {
                //             case 'ODL':     // ODL = other Device Login
                //                 alert(errObj.msg);
                //                 this.router.navigate(['/']);
                //                 break;
                //             case 'STEP':
                //                 this.dataStorage.data = JSON.parse(error).msg;
                //                 this.router.navigate(['/error']);
                //                 break;
                //             case 'OTH':     // OTH = other error
                //                 alert(errObj.msg);
                //                 break;
                //             case 'JCE':     // JCE = js conversion error
                //                 alert(errObj.msg);
                //                 break;
                //             case 'SE':     // SE = session expire
                //                 alert(errObj.msg);
                //                 this.router.navigate(['/']);
                //                 break;
                //             case 'PE':     // PE = parse error
                //                 alert(errObj.msg);
                //                 break;
                //             case 'SDNULL':     // send null data
                //                 alert(errObj.msg);
                //                 break;
                //             default:
                //                 this.router.navigate(['/error']);
                //                 break;
                //         }
                //     } else {
                //         alert(error);
                //     }
                // }
                // catch (err) {
                //     alert(err.message);
                //     this.router.navigate(['/error']);
                // }
            }
            else {
                this.dataStorage.data = 'Server error.';
                // alert(this.dataStorage.data);
                this.message = this.dataStorage.data;
                MessageBox.show(this.dialog, this.message, "");
                this.router.navigate(['/error']);
            }

        }
    }



    /**
     * Handle API Service error
     */
    handleError(error) {
        debugger
        if (error != undefined) {
            if (error._body) {
                try {
                    let errMsg: any;
                    if (typeof (error._body) === "string") {
                        debugger
                        if (JSON.parse(error._body).msg) {
                            debugger
                            if (JSON.parse(error._body).status) {
                                switch (JSON.parse(error._body).status) {
                                    case 'STEP': //send to error page
                                        errMsg = error._body;
                                        break;
                                    case 'ODL':
                                        errMsg = error._body;
                                    default:
                                        errMsg = JSON.stringify({ status: 'OTH', msg: JSON.parse(error._body).msg });
                                        break;
                                }
                            } else {
                                errMsg = JSON.stringify({ status: 'OTH', msg: JSON.parse(error._body).msg });
                            }
                        }
                        else
                            errMsg = JSON.stringify({ status: 'OTH', msg: JSON.parse(error._body).msg });
                    }
                    else
                        errMsg = JSON.stringify({ status: 'STEP', msg: 'Server error or Server Unreachable.' });

                    return Observable.throw(errMsg);
                }
                catch (err) {
                    debugger
                    return Observable.throw(JSON.stringify({ status: 'JCE', msg: err }));
                }
            }

            if (error.message) {
                debugger;
                if (error.message === "SE")
                    return Observable.throw(JSON.stringify({ status: 'SE', msg: 'Your session expired.' }));
                else if (error.message === "PE")
                    return Observable.throw(JSON.stringify({ status: 'PE', msg: 'Data parse error.' }));
                else if (error.message === "SDNULL")
                    return Observable.throw(JSON.stringify({ status: 'SDNULL', msg: 'Send Data Null.' }));
                else
                    return Observable.throw(JSON.stringify({ status: 'OTH', msg: error.message }));
            }
        }



    }
}