import {ICore} from  './core';
export interface IPayment extends ICore  {
    data: Array<any>; cursor1: Array<any>;
    result:string; oURl: string; Encryurl:string;
 }
export interface IBillDetail {
    billAmount: number;
    taxAmount: number;
    customerName: string;
    customerGstNo: string;
    mobileNo: number;
    remark: string;
    billNo:string;
    
}