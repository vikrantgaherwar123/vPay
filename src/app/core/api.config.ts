import { Injectable } from '@angular/core';
 
@Injectable()
export class ApiConfig {
    
    public ServiceUrl: any;
    constructor() {
        debugger;
        // this.ServiceUrl = "http://103.252.169.5:9002";
        //this.ServiceUrl = "http://192.168.1.149:1111";
        // this.ServiceUrl = "http://192.168.1.193:9000";
        this.ServiceUrl = "";
        
       
    }
    
}