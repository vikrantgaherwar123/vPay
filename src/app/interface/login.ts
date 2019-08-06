import {ICore} from  './core';
//import { Time } from '@angular/common/src/i18n/locale_data_api';
export interface ILogin extends ICore  {
    CLIENT_MST_ID:number;
    Client_Mst_Id:number;
    CLIENT_NAME:string;
    LOGIN_DATE:Date;
    LOGIN_TIME:string;
    LOGIN_USER_ID:string;
    LOGOUT_DATE:Date;
    LOGOUT_TIME:string;
    BALANCE:number;
    CLIENT_LANGUAGE:string;
    po_approvalflag:string;
    data:Array<any>;
    cursor1:any;
    cursor2:any;
    token:any;
    sessionId:any;
}


