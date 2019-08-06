import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { ITermCondition } from "../interface/termConditions";
import { ICore } from "../interface/core";
import { IStatement } from "../interface/statement";
import { Observable ,  Observer } from 'rxjs';
//import { map, catchError } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';
import {ISocket} from '../interface/socketInterface';
import { Toast } from './toast';
import {DataStorage} from '../core/dataStorage';



declare var io : {
    connect(url: string): ISocket;
}
@Injectable()
export class Common {
    errorMsg = {
        title: 'Info',
        msg: '',
        showClose: true,
        timeout: 10000,
        theme: 'bootstrap',
        type: 'info',
        position: 'top-right',
        closeOther: true
    }
    socket:ISocket;
    observer: Observer<any>;
    //private url = 'ws://192.168.1.149:8001';
    //private socket= io(this.url);
    private _error: any;
    get error(): any {
        return this._error;
    }
    set error(value) {
        this._error = value;
    }
    private _cursor: any;
    get cursor(): any {
        return this._cursor;
    }
    set cursor(value) {
        this.cursor = value;
    }

    public constructor(public apiService: ApiService, private toast: Toast, private dataStorage:DataStorage) {

    }
    
    TermConditons(uinput, page) {
        if (uinput.loginFlag == 'B') {
            return this.apiService.sendDataBeforeLogin<ITermCondition>('/auth/merchant/getTermscondition', uinput, page);
        }
        else if (uinput.loginFlag == 'A')
            return this.apiService.sendToServer<ITermCondition>('/auth/merchant/getTermscondition', uinput, page);
    }

    getSpentAnalyser(uinput, page) {
        return this.apiService.sendToServer<ICore>('/api/statement/spentanalyser', uinput, page);
    }

    getStatement(uinput, page) {
        return this.apiService.sendToServer<IStatement>('/api/statement/cstatement', uinput, page);
    }
    getContactUs(uinput, page) {
        return this.apiService.sendDataBeforeLogin<ICore>('/api/virtualPay/getContactus', uinput, page);
    }
    getBankIFSCData(uinput, page) {
        return this.apiService.sendToServer<ICore>('/auth/merchant/Search', uinput, page);
    }

    sendMessage(message) {
        this.socket.emit('login', message);
    }
    createObservable() : Observable<any> {
        return new Observable<any>(observer=>{
            this.observer = observer;
        })
    }
    getMessages(): Observable<any> {
        this.socket = socketIo( this.apiService.notificationUrl);
        this.socket.on('notification', (res)=>{
            this.errorMsg.msg = res.data.message;
            this.toast.position = 'top-right';
            this.toast.addToast(this.errorMsg);
            this.dataStorage.notificationData.push(res.data);
            this.observer.next(res.data);

        });
        return this.createObservable();
        //let url = 'http://192.168.1.149:2000';
        //let socket = io(url);
        // let observable = new Observable(observer => {
        //     //this.socket = io(this.url);
        //     this.socket.on('message', (data) => {
        //         // return data;
        //         alert(data);
        //        observer.next(data);
        //     });
        //     // return () => {
        //     //     this.socket.disconnect();
        //     // }
        // })
        // return observable;
    }
}