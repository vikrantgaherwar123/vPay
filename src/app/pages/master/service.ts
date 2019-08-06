import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service'; 
import { ICore } from '../../interface/core';
import { IHelp } from "../../interface/help";
import { IInstitution } from '../../interface/institution';

@Injectable()
export class Service {
    // Institute
    private _instimstidList: any;
    get instimstidList():any {
        return this._instimstidList;
    }
    set instimstidList(value){
        this._instimstidList = value;
    }
    //Sub Institute
    private _subInstList: any;
    get subInstList():any {
        return this._subInstList;

    }
    set subInstList(value){
        this._subInstList = value;
    }


    // Country
    private _countryList: any;
    get countryList():any {
        return this._countryList;
    }
    set countryList(value){
        this._countryList = value;
    }
    // State
    private _stateList: any;
    get stateList():any {
        return this._stateList;
    }
    set stateList(value){
        this._stateList = value;
    }
    
    private _stateKey: string;
    get stateKey():any {
           return this._stateKey;
    }
    set stateKey(value) {
       this._stateKey = value;
    }

    // District
    private _districtList: any;
    get districtList():any {
        return this._districtList;
    }
    set districtList(value){
        this._districtList = value;
    }
    
    private _distKey: string;
    get distKey():any {
           return this._distKey;
    }
    set distKey(value) {
       this._distKey = value;
    }

    // Tahasil
    private _tahasilList: any;
    get tahasilList():any {
        return this._tahasilList;
    }
    set tahasilList(value){
        this._tahasilList = value;
    }
    
    private _tahasilKey: string;
    get tahasilKey():any {
           return this._tahasilKey;
    }
    set tahasilKey(value) {
       this._tahasilKey = value;
    }

    // Address Proof List
    private _addressProofList: any;
    get addressProofList():any {
        return this._tahasilList;
    }
    set addressProofList(value){
        this._tahasilList = value;
    }
    
    private _addressProofKey: string;
    get addressProofKey():any {
           return this._addressProofKey;
    }
    set addressProofKey(value) {
       this._addressProofKey = value;
    }

    // City List
    private _cityList: any;
    get cityList():any {
        return this._cityList;
    }
    set cityList(value){
        this._cityList = value;
    }
    
    private _cityKey: string;
    get cityKey():any {
           return this._cityKey;
    }
    set cityKey(value) {
       this._cityKey = value;
    }

    // Identity
    private _identityProofList: any;
    get identityProofList():any {
        return this._cityList;
    }
    set identityProofList(value){
        this._identityProofList = value;
    }
    
    private _identityProofKey: string;
    get identityProofKey():any {
           return this._identityProofKey;
    }
    set identityProofKey(value) {
       this._identityProofKey = value;
    }

    // Business
    private _businessLineList: any;
    get businessLineList():any {
        return this._cityList;
    }
    set businessLineList(value){
        this._businessLineList = value;
    }
    
    private _businessLineKey: string;
    get businessLineKey():any {
           return this._businessLineKey;
    }
    set businessLineKey(value) {
       this._businessLineKey = value;
    }

    private _businessTypeList: any;
    get businessTypeList():any {
        return this._businessTypeList;
    }
    set businessTypeList(value){
        this._businessTypeList = value;
    }
    
    private _businessTypeKey: string;
    get businessTypeKey():any {
           return this._businessTypeKey;
    }
    set businessTypeKey(value) {
       this._businessTypeKey = value;
    }
    
    private _businessProofList: any;
    get businessProofList():any {
        return this._businessProofList;
    }
    set businessProofList(value){
        this._businessProofList = value;
    }
    
    private _businessProofKey: string;
    get businessProofKey():any {
           return this._businessProofKey;
    }
    set businessProofKey(value) {
       this._businessProofKey = value;
    }

    
    public constructor(public apiService:ApiService) {

    }

    Search(uinput, page) {
        return this.apiService.sendToServer<IHelp>('/auth/merchant/Search', uinput, page);
    }
    
    AddModify_InstitutionData(uinput, page) {
        return this.apiService.sendToServer<IInstitution>('/auth/merchant/AddModify_InstitutionData', uinput, page);
    }

    GetInstituteData(uinput, page) {
        return this.apiService.sendToServer<IInstitution>('/auth/merchant/GetInstituteData', uinput, page);
    }

    GetPinCodeData(uinput, page) {
        return this.apiService.sendToServer<ICore>('/auth/merchant/GetPinCodeData', uinput, page);
    }

}