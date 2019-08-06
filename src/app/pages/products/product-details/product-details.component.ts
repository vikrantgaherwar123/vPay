import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
//import { PanZoomConfig, PanZoomAPI, PanZoomModel } from 'ng2-panzoom';
//import * as $ from 'jquery';

//declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  // private panZoomConfig: PanZoomConfig = new PanZoomConfig;
  url: any
  imagelist: any;
  SelectorIndex: any;

  qty: number = 1;
  zoom: any;
  //router: any;
   
  

  param1:any;
  constructor(private router: Router,private ActivatedRoute:ActivatedRoute) {
    this.url = "assets/products-img/109A1241.png";
    this.getimagelist();

    this.ActivatedRoute.queryParams.subscribe(params => {
      const userId = params['ItemProduct'];
      console.log(userId);
      alert(userId);
    }); 

  }

  

  ngOnInit() {

  }

  nextImg(path: any, j: any) {
    this.url = path;
    this.SelectorIndex = j;
    //alert("text== " + path);
  }
  getimagelist() {
    this.imagelist = [
      { path: 'assets/products-img/109A1241.png' },
      { path: 'assets/products-img/109A0555.jpg' },
      { path: 'assets/products-img/109A0637.jpg' },
      { path: 'assets/products-img/109A0855.jpg' },
      { path: 'assets/products-img/109A0885.jpg' },
      { path: 'assets/products-img/109A0911.jpg' },
      { path: 'assets/products-img/109A0923.jpg' },
      { path: 'assets/products-img/109A0911.jpg' },
      { path: 'assets/products-img/109A0923.jpg' },
      { path: 'assets/products-img/109A0911.jpg' },
      { path: 'assets/products-img/109A0923.jpg' },
      { path: 'assets/products-img/109A0911.jpg' },
      { path: 'assets/products-img/109A0923.jpg' },
    ];
    this.SelectorIndex = 0;

  }



  sub() {
    if (this.qty != 0 && this.qty > 1) {
      this.qty--;
    }
  }

  add() {
    if (this.qty >= 1) {
      this.qty++;
    }
  }

  checkout() {
    this.router.navigate(['/products/product-checkout']);
  }

 

}
