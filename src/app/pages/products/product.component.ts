import { Component, Renderer2, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { ILogin } from '../../interface/login';
import { DataStorage } from '../../core/dataStorage';
import { ErrorHandler } from '../../core/errorHandler';
import { Spinner } from '../../services/spinner';
import { ICore } from '../../interface/core';
import { Common } from '../../services/common';
import { MatDialog } from "@angular/material";
import { Otp } from '../../shared/component/otp/otp.component';
import { IOtp } from '../../interface/otp';
import { Toast } from '../../services/toast';

import * as $ from 'jquery'
 //declare var $: any;

import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  public imagesUrl;



  constructor(private dataStorage: DataStorage, private router: Router, private apiService: ApiService,
    private spinner: Spinner, private errorHandler: ErrorHandler, private renderer2: Renderer2, private toast: Toast, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) { }

  ngOnInit() {
    this.imagesUrl = [
      {
        image:'assets/products-img/109A1050.jpg',
        title: 'Rose',
        price: '450'
      },
      {
        image:'assets/products-img/109A1050.jpg',
        title: 'Lily',
        price: '550'
      },
      {
        image:'assets/products-img/109A1050.jpg',
        title: 'Rose',
        price: '650'
      },
   
      ];
   
  }

 
   
 
}
