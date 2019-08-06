import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ICore } from "../../interface/core";

@Injectable()
export class ProductService {

    constructor(public apiService: ApiService) {

    }
    /**
     * 
     * @param getCondition -- like {id:1} -- gives documents having id = 1
     */
    getProductType(getCondition: object) {
        return this.apiService.sendToServer<ICore>('/api/product/getProductType', getCondition, this);
    }

    getProductMaster(getCondition: object) {
        return this.apiService.sendToServer<ICore>('/api/product/getProductMaster', getCondition, this);
    }
}