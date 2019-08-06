import { Component, OnInit } from '@angular/core';
//import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';
@Component({
  selector: 'app-auth',
  template: '<router-outlet><app-spinner></app-spinner></router-outlet>',
  styleUrls: ['../../../../node_modules/ng2-toasty/style-bootstrap.css',
    '../../../../node_modules/ng2-toasty/style-default.css',
    '../../../../node_modules/ng2-toasty/style-material.css'
  ],
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
