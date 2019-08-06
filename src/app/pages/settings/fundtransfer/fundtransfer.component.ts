import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { ErrorHandler } from '../../../core/errorHandler';
import { Service } from './service';
import { Spinner } from "../../../services/spinner";
import { DataStorage } from '../../../core/dataStorage';
import { Help } from '../../../shared/component/help/help.component';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { Common } from '../../../services/common';
import { ILogin } from '../../../interface/login';

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'vgipl-fundtransfer',
    styleUrls: ['./fundtransfer.scss'],
    templateUrl: './fundtransfer.html',
    providers: [ApiService, Spinner, Service,Common]

})
export class FundTransferComponent implements OnInit {
    @ViewChildren(Help) helpElement: QueryList<Help>;
    @ViewChild(dtp) dtp: dtp;
    logInfo: ILogin; isValid: boolean = false;
    TotalBalance: string; TodaysCollection: string;
    FundToTransfer: string; TodaysTotalTransferedFund: string;
    Reconcilation: string; FundTransferToBank: string;
    CORPORATE_FLAG: string = 'I';
    APIParams: string;
    termCondContent: string;
    Balances: any; TransferPercent: number = 0; TransferAttempts: number = 0; TransferLimit: number = 0;
    RemainingTransferAttempts: number = 0;
    CLIENT_MST_ID: number = 0; INSTI_MST_ID: number = 0; INSTI_SUB_MST_ID: number = 0;
    LOGIN_USER_ID: number = 0;

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

    constructor(private elementRef: ElementRef, private dialog: MatDialog, private route: ActivatedRoute, private router: Router,
        private apiserv: ApiService, private spinner: Spinner, private dataStorage: DataStorage, private common: Common,
        public service: Service, private renderer2: Renderer2, private errorHandler: ErrorHandler, ) {

    }

    ngOnInit() {
        this.logInfo = this.dataStorage.logInfo;
        this.INSTI_MST_ID = this.logInfo[0].INSTI_MST_ID;
        this.INSTI_SUB_MST_ID = this.logInfo[0].INSTI_SUB_MST_ID;
        //this.instname = this.logInfo[0].INSTITUTION_NAME;
        this.LOGIN_USER_ID = this.logInfo[0].LOGIN_USER_ID;
        this.CLIENT_MST_ID = this.logInfo[0].CLIENT_MST_ID;
        //this.CLIENT_NAME = this.logInfo[0].CLIENT_NAME;
        this.InitialValues();
    }

    pageHelp() {
        this.common.TermConditons({ Term_Cond_Type: "9", loginFlag: 'A' }, this).subscribe(data => {
            if (data.code == 1) {
                this.termCondContent = data.cursor1;
            }
        });
    }



    InitialValues() {
        this.TotalBalance = '0.00'; this.TodaysCollection = '0.00';
        this.FundToTransfer = '0.00'; this.TodaysTotalTransferedFund = '0.00';
        this.Reconcilation = '0.00'; this.FundTransferToBank = '0.00';
        this.TransferPercent = 0; this.TransferAttempts = 0; this.TransferLimit = 0;
        this.RemainingTransferAttempts = 0;
        if (this.CORPORATE_FLAG == 'I') {
            this.APIParams = 'BalanceTransfer';
        }
        else {
            this.APIParams = 'InstBalanceTransfer';
        }

        this.Get_FundTransferAmount();
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

    CallBack = function (obj) {
        if (obj != null) {
            if (obj.SetControlValue == 'gstregdate')
                this.gstregdate = obj.mydate;
            if (obj.SetControlValue == 'regdate')
                this.regdate = obj.mydate;
            if (obj.SetControlValue == 'activestatusdate')
                this.activestatusdate = obj.mydate;
        }
    }

    Get_FundTransferAmount() {
        this.spinner.show();
        var uinput = {
            Client_Mst_Id: this.CLIENT_MST_ID,
            OpFlag: 'S',
            Insti_Mst_Id: this.INSTI_MST_ID,
            Insti_Sub_Mst_Id: this.INSTI_SUB_MST_ID,
        }
        this.service.Get_FundTransferAmount(uinput, this).subscribe(
            data => {
                this.spinner.hide();
                if (data.code === 1 && data.msg == 'Success') {
                    if (data.cursor1[0]) {
                        this.Balances = data.cursor1[0];
                        this.TotalBalance = this.Balances.TOTAL_BALANCE == null ? '0.00' : this.Balances.TOTAL_BALANCE;
                        this.TodaysCollection = this.Balances.TODAY_COLLECTION == null ? '0.00' : this.Balances.TODAY_COLLECTION;
                        this.FundToTransfer = this.Balances.TOTAL_TRANFER_AMOUNT == null ? '0.00' : this.Balances.TOTAL_TRANFER_AMOUNT;
                        this.TodaysTotalTransferedFund = this.Balances.TODAY_TRF_AMOUNT == null ? '0.00' : this.Balances.TODAY_TRF_AMOUNT;
                        this.TransferPercent = this.Balances.BALANCE_TRF_PERCENT == null ? '0' : this.Balances.BALANCE_TRF_PERCENT;
                        this.TransferAttempts = this.Balances.TRANFER_REMAINING_ATTEMPT == null ? '0' : this.Balances.TRANFER_REMAINING_ATTEMPT;
                        this.TransferLimit = this.Balances.MINIMUM_AMOUNT_TRANSFER == null ? '0' : this.Balances.MINIMUM_AMOUNT_TRANSFER;
                        this.Reconcilation = this.Balances.BALANCE_AFTER_TRANSFER == null ? '0.00' : this.Balances.BALANCE_AFTER_TRANSFER;
                        this.FundTransferToBank = this.FundToTransfer;
                        this.RemainingTransferAttempts = this.TransferAttempts;
                    }
                }
                else {
                    this.message = data.msg;
                    MessageBox.show(this.dialog, this.message, "");
                }
            },
            err => {
                this.spinner.hide();
                this.errorHandler.handlePageError(err);
            },
            // () => console.log('Get Fund Transfer Amount.')
        );


    }

    ValidateData() {
        if (parseFloat(this.FundToTransfer) < this.TransferLimit) {
            this.message = "Insufficient Fund For Transfer";
            MessageBox.show(this.dialog, this.message, "");
            return false;
        }
        if (this.RemainingTransferAttempts <= 0) {
            this.message = "Your Fund Transfer Is Zero.";
            MessageBox.show(this.dialog, this.message, "");
            return false;
        }
        return true;
    }

    Proceed() {
        this.isValid = this.ValidateData();
        if (this.isValid == false) {
            return;
        }

        if (confirm('Do you want to Transfer Balance ?')) {
            var rattempt = this.RemainingTransferAttempts;
            rattempt = rattempt - 1;
            this.RemainingTransferAttempts = rattempt;
            if (this.RemainingTransferAttempts > 0) {
                this.TransferFund();
            }
        }

    }

    TransferFund() {
        this.spinner.show();
        var uinput = {
            Client_Mst_Id: this.CLIENT_MST_ID,
            OpFlag: 'T',
            Insti_Sub_Mst_Id: this.INSTI_SUB_MST_ID,
            Insti_Mst_Id: this.INSTI_MST_ID,
        }
        this.service.TransferFund(uinput, this).subscribe(
            data => {
                this.spinner.hide();
                if (data.code === 1 && data.msg == 'Success') {

                }
                else {
                    this.message = data.msg;
                    MessageBox.show(this.dialog, this.message, "");
                }
            },
            err => {
                this.spinner.hide();
                this.errorHandler.handlePageError(err);
            },
            // () => console.log('Transfer Fund.')
        );

    }

}