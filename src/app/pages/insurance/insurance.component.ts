import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

import { DataStorage } from "../../core/dataStorage";
import { ILogin } from '../../interface/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: [
    './insurance.component.css'
  ],
  providers: [],
})
export class InsuranceComponent implements OnInit {
 message;
  textNumber: any;
 mobileNumber: any;
 email: any;
 
 logInfo: ILogin;
 termsConditions: any;
 //whatsapp: any;

  InsuranceItemArray: any;

  //dialog
  carInsurance = false;
  bikeInsurance = false;
  marineInsurance = false;
  healthInsurance = false;
  travelInsurance = false;

  

  constructor(private dialog: MatDialog, private dataStorage: DataStorage,  private router: Router) { }

  ngOnInit() {
   this.logInfo = this.dataStorage.logInfo;
   this.gotoMenu('carInsurance');
  }

  submit(insuranceType) {
    if (this.textNumber == undefined || this.textNumber.trim().length == 0 || this.textNumber == null) {
      this.message = "Please Enter Registration Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.mobileNumber == undefined || this.mobileNumber.trim().length == 0 || this.mobileNumber == null){
      this.message = "Please Enter Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.email == undefined || this.email.trim().length == 0 || this.email == null) {
      this.message = "Please Enter Email ID.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.termsConditions == undefined || this.termsConditions.lenght == 0 || this.termsConditions == null) {
      this.message = "Please Select Checkbox.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    // if (this.whatsapp == undefined || this.whatsapp.trim().lenght == 0 || this.whatsapp == null) {
    //   this.message = "Please Select Checkbox.";
    //   MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }

    this.router.navigate(['/insurance/detailsInfo'], { queryParams: { InsuranceType: insuranceType, regNo: this.textNumber }, skipLocationChange: true });
  }

  gotoMenu(val) {
    $(document).ready(function () {
      $('#menuId li').click(function () {
        $('#menuId li').removeClass("tab-current");
        $(this).addClass("tab-current");
      });
    });
    this.carInsurance = false;
    this.bikeInsurance = false;
    this.marineInsurance = false;
    this.healthInsurance = false;
    this.travelInsurance = false;
    if (val == 'carInsurance') {
      this.carInsurance = true;
    }
    else if (val == 'bikeInsurance') {
      this.bikeInsurance = true;
    }
    else if (val == 'marineInsurance') {
      this.marineInsurance = true;
    }
    else if (val == 'healthInsurance') {
      this.healthInsurance = true;
    }
    else if (val == 'travelInsurance') {
      this.travelInsurance = true;
    }
  }


 

}
