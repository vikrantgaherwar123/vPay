import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service'; 
import { ICore } from '../../interface/core';
import { IHelp } from "../../interface/help";
import { IStatementOfTransaction } from '../../interface/StatementOfTransaction';

@Injectable()
export class Service {
   
    //Sub Institute
    private _instsubidList: any;
    get instsubidList():any {
        return this._instsubidList;
    }
    set instsubidList(value){
        this._instsubidList = value;
    }
    //clientid
    private _ClientidList: any;
    get ClientidList():any {
        return this._ClientidList;

    }
    set ClientidList(value){
        this._ClientidList = value;
    }
    public constructor(public apiService:ApiService) {

    }
    Search(uinput, page) {
        return this.apiService.sendToServer<IHelp>('/auth/merchant/Search', uinput, page);
    }
    
   

}