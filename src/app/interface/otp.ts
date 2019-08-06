import {ICore} from  './core';
export interface IOtp extends ICore  {
    Po_Otp_Det_ID:string; 
    Pi_OTP_Det_ID:string;
    Pio_Otp_Det_ID:string;

    po_OTPExpDur:string;
    Po_Otpexpdur:string;
    
    Po_Error:string;

}
