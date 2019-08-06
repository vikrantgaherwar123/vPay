import { Component, ViewChild, ElementRef, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { IOtp } from '../../../interface/otp';



@Component({
    selector: 'otp',
    styleUrls: ['./otp.scss'],
    templateUrl: './otp.html'
})
export class Otp {
    hide = true;
  mobileNo: string = "";
threedigit:number;
    @Input() eid:string;
    public mmTime: number;
    public mobLast3Digit: number;

    public ssTime: number = 60;
    public otp: string;
    public otpObj: IOtp;
    public disabled: string;
    public startFlag: string = '';
    public OTPTimeOut: string = "";
    public OTPRegenerate: string = "OTPRLH";
    public showOtpDiv: boolean = false;
    public placeholder : string= '';
    @Output() callBackMethod = new EventEmitter<any>();
    constructor(private _elementRef: ElementRef) {
    }

   public showOtp(obj, page) {
        this.startFlag = '';
        this.OTPTimeOut = "";
        this.OTPRegenerate = "OTPRLH";
        if(page.mobileNo){
            this.mobLast3Digit = parseInt(page.mobileNo) % 1000;
        }else{
            this.mobLast3Digit = parseInt(page.login_user_id) % 1000;
        }
        this.showOtpDiv = true;
        this.otpObj = obj;
        if (this.otpObj){
            if(parseInt(this.otpObj.po_OTPExpDur)>=1){
                this.mmTime = parseInt(this.otpObj.po_OTPExpDur);
                this.ssTime = 60;
            }
            else{
                this.mmTime =0;
                this.ssTime = 60;
            }
        }
            
        this.updateCounter();
        
    }

   public hideOtp() {
        this.showOtpDiv = false;
    }

    //Set Seconds
    public set_ssTime(): void {
        if (this.ssTime >= 1) {
            this.ssTime = this.ssTime - 1;
            if (this.mmTime != 0 && this.ssTime == 0) {
                this.ssTime = 60;
                this.updateCounter();
            }
            else {
                setTimeout(() => { this.set_ssTime() }, 1000);
            }
        }
    }

    public PadLeft(value, length) {
        while (parseInt(value.toString().length) < parseInt(length))
            value = '0' + value;
        return value;
    }

    public updateCounter(): void {

        if (this.mmTime >= 1 && this.ssTime == 60)
            this.mmTime = this.PadLeft((this.mmTime - 1), 2);

        if (this.mmTime >= 0 && this.ssTime >= 1) {
            this.ssTime = this.PadLeft((this.ssTime - 1), 2);
            if (this.ssTime == 0) {
                if (this.mmTime > 0) {
                    this.mmTime = this.PadLeft((this.mmTime - 1), 2);
                }
                else {
                    if (this.mmTime == 0 && this.ssTime == 0) {
                        this.startFlag = 'STOP';
                        this.OTPTimeOut = "OTPTOH";
                        this.OTPRegenerate = "";
                    }
                }

                if (this.startFlag == '')
                    this.ssTime = this.PadLeft((60 - 1), 2);
            }
        }

        if (this.startFlag == '') {
            setTimeout(() => { this.updateCounter() }, 1000);
        }
    }

    GenerateNewOTP() {
         this.callBackMethod.emit(this);
        // this.startFlag = '';
        // this.OTPTimeOut = "";
        // this.OTPRegenerate = "OTPRLH";
    }

}