import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/api.service'; 
import { ICore } from '../../../interface/core';
import { IHelp } from "../../../interface/help";
import { IFundTransfer } from '../../../interface/fundtransfer';
@Injectable()
export class Service {
    public constructor(public apiService:ApiService) {

    }

    Search(uinput, page) {
        return this.apiService.sendToServer<IHelp>('/auth/merchant/Search', uinput, page);
    }
    
    Get_FundTransferAmount(uinput, page) {
        return this.apiService.sendToServer<IFundTransfer>('/auth/merchant/Get_FundTransferAmount', uinput, page);
    }

    TransferFund(uinput, page) {
        return this.apiService.sendToServer<IFundTransfer>('/auth/merchant/InstantTransferFund', uinput, page);
        
    }

    

}