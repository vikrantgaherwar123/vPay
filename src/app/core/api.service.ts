import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DataStorage } from './dataStorage';
import { ErrorHandler } from './errorHandler';
// import { Observable, throwError } from 'rxjs';
// import { map, catchError, retry } from 'rxjs/operators';


declare var CryptoJS;
// import { Spinner } from '../service/spinner';
// const BASE_URL = 'http://node-hnapi.herokuapp.com';
@Injectable()
export class ApiService {

    public privatekey = `123456789`;
    // notificationUrl = 'https://vpays.in:8006';
    notificationUrl = 'http://192.168.1.192:8000';
    apiconfig: any = {
        // serviceUrl: 'http://192.168.1.193:2000',
        // serviceUrl: 'http://192.168.1.112:9001',
        // serviceUrl: 'http://192.168.1.62:9001/vlive',  //live test
            // serviceUrl: 'http://192.168.1.31:7003', //encryption test

        // serviceUrl: 'http://192.168.1.31:7001', //live test

        // serviceUrl: 'http://192.168.1.62:7001',  //live test
        
        // serviceUrl: '',
        authHeader1: 'bliBV',
        authHeader2: 'aliBV'
        //token: localStorage.getItem("token")
    };
    constructor(private http: HttpClient, private dataStorage: DataStorage, private errorHandler: ErrorHandler, ) {//private spinner:Spinner

        let customerType = this.dataStorage.loginUserType === 'C' ? 'WC' : 'WB';

        this.apiconfig = {
            // serviceUrl: 'http://192.168.1.112:9001',
            // serviceUrl: 'http://192.168.1.62:7001', //live test
            serviceUrl: 'http://192.168.1.31:7001', //live test
            // serviceUrl: 'http://192.168.1.31:7003', //encryption test
            // serviceUrl: 'http://192.168.1.193:2000', 
            // serviceUrl: '',
            authHeader1: "bliBV",
            authHeader2: 'aliBV',
            token: localStorage.getItem("token"),
            currentRequestFrom: customerType
        }
    }


    // getLatestStories(page: number = 1) {
    //     return this.http.get(`${BASE_URL}/news?page=${page}`);
    //   }


    /**
     * call this method for send data by post method
     * path --
     * object --
     * page -- page instance
     */
    sendDataBeforeLogin<interfaceType>(path, obj, page) {
        var headers = null;
        //if(page.firstReq){
        headers = new HttpHeaders().set('authorization', this.apiconfig.authHeader1);
        //    if (obj) obj.firstReq = true;
        //}
        //else{
        //    if (page.beforeLoginInfo && page.beforeLoginInfo.token) {
        //         headers = new HttpHeaders().set('authorization', this.apiconfig.authHeader1 + page.beforeLoginInfo.token);
        //    }
        //    else {
        //TODO
        //    }
        //}
        if (obj) {
            let customerType: string;
            if (!this.dataStorage.loginUserType)
                customerType = 'AA';
            else
                customerType = this.dataStorage.loginUserType === 'C' ? 'WC' : 'WB';
            obj.request_from = customerType;
            obj.Request_From = customerType;
            if (!obj.device_id)
                obj.device_id = 'D';
            if (!obj.Device_Id)
                obj.Device_Id = 'D';
            return this.http.post<interfaceType>(this.apiconfig.serviceUrl + path, obj, { headers })
                .catch((error) => { return this.handleError(error, page) });

            //OR encryption
            //OR encryption


            //   var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), this.privatekey);
            //   ciphertext = ciphertext.toString();
            //   // console.log(ciphertext);
            //   var Vobj = { b: 't', c: ciphertext };
            //   return this.http.post<interfaceType>(this.apiconfig.serviceUrl + path, Vobj, { headers })
            //       // .catch((error) => { return this.handleError(error, page) });

            //       .pipe(retry(3),
            //           map((data => {
            //               // console.log(data);
            //               var privatekey = `123456789`;
            //               let resultObj = data;
            //               var bytes = CryptoJS.AES.decrypt(resultObj.toString(), privatekey);
            //               var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            //               // console.log(decryptedData);
            //               return decryptedData;
            //           }
            //           ),
            //           throwError(err => {
            //               // console.log(err);
            //               return this.handleError(err, page) 
            //           })))

        }

    }

    handleError(error, page) {
        // alert(error.error.msg);
        if (error.error.msg)
            return Observable.throw(error.error.msg);
        else if (error.error.vmessage)
            return Observable.throw(error.error.vmessage);
        else if(error.error.message)
            return Observable.throw(error.error.message);
        else 
            return Observable.throw(error);
        //return false;
    }
    /**
    * Use to send data (for get ,save ,update)
    */
    sendToServer<interfaceType>(path, obj, page) {

        const headers = new HttpHeaders()
            .set('authorization', this.apiconfig.authHeader2 + this.dataStorage.logInfo.token);
        let customerType = this.dataStorage.loginUserType === 'C' ? 'WC' : 'WB';
        if (obj.allClient) {
            obj.request_from = "AA";
            obj.Request_From = "AA";
        } else {
            obj.request_from = customerType;
            obj.Request_From = customerType;
        }
        if (!obj.device_id)
            obj.device_id = 'D';
        if (!obj.Device_Id)
            obj.Device_Id = 'D';
        obj.sessionId = this.dataStorage.logInfo.sessionId;
        obj.Session_Id = '111';
        obj.Source = '111';
        obj.InetCorpoID = '';
        obj.App_Mode = 'VPAY';
        obj.InetUserID = '';
        obj.InetCorpFlag = '';
        return this.http.post<interfaceType>(this.apiconfig.serviceUrl + path, obj, { headers })
            .catch((error) => { return this.handleError(error, page) });

        // OR

        // //Encryption code
        // var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), this.privatekey);
        // ciphertext = ciphertext.toString();
        // // console.log(ciphertext);
        // var Vobj = { b: 't', c: ciphertext };
        // return this.http.post<interfaceType>(this.apiconfig.serviceUrl + path, Vobj, { headers })

        // .pipe(retry(3),
        // map((data => {
        //     // console.log(data);
        //     var privatekey = `123456789`;
        //     let resultObj = data;
        //     var bytes = CryptoJS.AES.decrypt(resultObj.toString(), privatekey);
        //     var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        //     // console.log(decryptedData);
        //     return decryptedData;
        // }
        // ),
        // throwError(err => {
        //     // console.log(err);
        //     return this.handleError(err, page) 
        // })))

    }




    uploadToServer<interfaceType>(path, obj, page) {


        obj.request_from = this.apiconfig.currentRequestFrom;
        const headers = new HttpHeaders()
            .set('authorization', 'bliBV');
        //headers.append('Content-Type', 'application/json');

        //headers.append('authorization', this.apiconfig.authHeader1);// localStorage.getItem("token").replace('"',''));
        //if (page != undefined)
        //    page.spinner.show();
        return this.http.post<interfaceType>(this.apiconfig.serviceUrl + path, obj, { headers });
    }
}