import { Injectable } from '@angular/core';
 
@Injectable()
export class DataStorage {
    public data: any;

    private _client_Mst_Id: string;
    get client_Mst_Id():string{
        return this._client_Mst_Id;
    }
    set client_Mst_Id(value){
        this._client_Mst_Id = value;
    }

    private _insti_sub_mst_id: string;
    get insti_sub_mst_id():string{
        return this._insti_sub_mst_id;
    }
    set insti_sub_mst_id(value){
        this._insti_sub_mst_id = value;
    }

    

    /**
     * get and set login user type
     */
    private _loginUserType: string;
    get loginUserType():string{
        return this._loginUserType;
    }
    set loginUserType(value){
        this._loginUserType = value;
    }
    /**
     * get and set login user info
     */
    private _logInfo: any;
    get logInfo():any {
        return this._logInfo;
    }
    set logInfo(value) {
       this._logInfo = value;
    }
    /**
     * get and set spent analyzer data (Total Data)
     */
    private _spentAnalyzer: any;
    get spentAnalyzer():any {
        return this._spentAnalyzer;
    }
    set spentAnalyzer(value) {
       this._spentAnalyzer = value;
    }
    /**
     * get and set statement data (all Transaction cursor)
     */
    private _statementAll: any;
    get statementAll(): any {
        return this._statementAll;
    }
    set statementAll(value) {
        this._statementAll = value;
    }

     /**
     * get and set aadharStatmentData data (all Transaction cursor)
     */
    private _aadharStatmentData: any;
    get aadharStatmentData(): any {
        return this._aadharStatmentData;
    }
    set aadharStatmentData(value) {
        this._aadharStatmentData = value;
    }

    /**
     * get and set upiStatmentData data (all Transaction cursor)
     */
    private _upiStatmentData: any;
    get upiStatmentData(): any {
        return this._upiStatmentData;
    }
    set upiStatmentData(value) {
        this._upiStatmentData = value;
    }

     /**
     * get and set pamentGateWayStatmentData data (all Transaction cursor)
     */
    private _pamentGateWayStatmentData: any;
    get pamentGateWayStatmentData(): any {
        return this._pamentGateWayStatmentData;
    }
    set pamentGateWayStatmentData(value) {
        this._pamentGateWayStatmentData = value;
    }

    private _notificationData: Array<string> = new Array<string>();
    get notificationData(): Array<string> {
        return this._notificationData;
    }
    set notificationData(value) {
        this._notificationData = value;
    }




    public constructor() {

    }
    // public getBankInfo(){
    //     debugger;
    //     return JSON.parse(localStorage.getItem("bankInfo"));
    // }
}

