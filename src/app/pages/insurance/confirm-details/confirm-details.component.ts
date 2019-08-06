import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataStorage } from "../../../core/dataStorage";
import { ILogin } from '../../../interface/login';
import { IInsurance } from '../../../interface/insurance';
import { ICore } from '../../../interface/core';
import { MessageBox } from "../../../services/_shared/message-box";
import { Spinner } from "../../../services/spinner";
import { ApiService } from '../../../core/api.service';
import { ErrorHandler } from '../../../core/errorHandler';
import { MatDialog } from "@angular/material";
import * as moment from 'moment';


@Component({
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.css']
})
export class ConfirmDetailsComponent implements OnInit {

  message: any;

  //Personal Details
  title: any;
  fullName: any;
  mobileNumber: any;
  email: any;
  PersonalDateOfBirth: any;
  addressLine1: any;
  addressLine2: any;
  pincode: any;
  cityState: any;
  panNo: any;
  landlineNo: any;
  landmark: any;
  nameOfNominee: any;
  relationshipInsured: any;
  NomineeDateOfBirth: any;
  NomineeGSTINUANnumber: any;
  GSTINUANnumber: any;
  panNumber: any;
  constitutionOfBusiness: any;
  customerType: any;
  gstRegistrationStatus: any;
  vehicleRegistrationNumber: any;

  names: any[]
  
  constructor(private route: ActivatedRoute, private dialog: MatDialog,) { }

 

  ngOnInit() {

    this.mobileNumber = this.route.queryParams["_value"].Mobile;
    this.email = this.route.queryParams["_value"].Email;
    this.vehicleRegistrationNumber = this.route.queryParams["_value"].VehicleNumber;
  }

  nextBtn() {
    if (this.title == undefined || this.title == 0) {
      this.message = "Please Select Title Name";
      MessageBox.show(this.dialog, this.message, "");
      return false
    }

    if (this.fullName == undefined || this.fullName == 0) {
      this.message = "Please Enter The Full Name";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.mobileNumber == undefined || this.mobileNumber == 0) {
      this.message = "Please Enter The Mobile Number";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.email == undefined || this.email == 0) {
      this.message = "Please Enter The Email";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.PersonalDateOfBirth == undefined || this.PersonalDateOfBirth == 0) {
      this.message = "Please Select Date";
      MessageBox.show(this.dialog, this.message, "")
      return false;
    }

    if (this.addressLine1 == undefined || this.addressLine1 == 0){
      this.message = "Please Enter The First Address";
      MessageBox.show(this.dialog, this.message, "");
      return false
      }

    if (this.addressLine2 == undefined || this.addressLine2 == 0) {
      this.message = "Please Enter The Second Address";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.pincode == undefined || this.pincode == 0) {
      this.message = "Please Enter The Pincode";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.cityState == undefined || this.cityState == 0) {
      this.message = "Please Enter The City & State";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.panNo == undefined || this.panNo == 0) {
      this.message = "Please Enter The Pan No";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.panNo == undefined || this.panNo == 0) {
      this.message = "Please Enter The Pan No";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

  }



}
