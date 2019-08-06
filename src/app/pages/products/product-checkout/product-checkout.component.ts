import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.css']
})
export class ProductCheckoutComponent implements OnInit {

  cartlist: any;

  constructor(private router: Router,
    // public localStorageServiceService: LocalStorageServiceService
    ) {
    // this.localStorageServiceService.getLocalStorage();
  }

  ngOnInit() {
  }

  // getcartlist(){
  //   this.cartlist[

  //   ]
  // }


}
