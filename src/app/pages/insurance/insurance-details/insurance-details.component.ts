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
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.css']
})
export class InsuranceDetailsComponent implements OnInit {

  message;

  cityModel: any;
  manufacture: any;
  BikeModel: any;
  txtStartDate: any;

  /////////////////////////////////
  ModelSelectArray: any = [];
  manufactureAreay: any;
  registeredCityArray: any;
  bikeModelManufactCode: any;
  bikeModelCode: any;
  ExShowRoomPrice: any;

  DurationDetail: any;
  ClaimsMadeDetail: any;
  NCBArray: any;
  selectModel: any;
  selectedCompany: any;
  selectedRtoLocation: any;
  exShowRoomPrice: any;
  ddClaimMade: any = '0';
  ddClaimBonus: any = "11";

  logInfo: ILogin;
  typeOfInsurance: any;
  regNumber: any;
  manufacturedArray: any;
  carManufacturedArray: any;
  newVehicalPruches: any;
  registrationDate: any;
  generalInformation: any;
  rtolocationcode: any;

  shownewVehicalPruches: boolean = false;
  showInsuranceDetailsPage: boolean = false;
  showPreviousPolicyDetailsPage: boolean = false;
  priviousVehicalPurches: boolean = true;

 btnBuyNow: boolean = true;
  btnRecalculate: boolean = false;

  RollOver: any;
  finalPremium: any;
  BusinessType: any;
  IsNoPrevInsurance: boolean = false;
  ncba: any;
  selectedclaims: any;
  electricalAcc: any;
  NoelectricalAcc: any;
  IsAntiTheftDisc: boolean;
  IsPACoverUnnamedPassenger: any;
  SIPACoverUnnamedPassenger: number;
  sValidDrivingLicense: any;
  IsValidDrivingLicense: any;
  confirmDetail: any;

  

  constructor( private dataStorage: DataStorage, private route: ActivatedRoute, private router: Router,
    private errorHandler: ErrorHandler, private dialog: MatDialog, private apiService: ApiService, private spinner: Spinner) {

    this.typeOfInsurance = this.route.queryParams["_value"].InsuranceType;
    this.regNumber = this.route.queryParams["_value"].regNo;

    this.newVehicalPruches = this.route.queryParams["_value"].newVehicalPruches == undefined ? '' : this.route.queryParams["_value"].newVehicalPruches;
    if (this.newVehicalPruches == "newVehicalPruches") {
      this.shownewVehicalPruches = true;
      this.priviousVehicalPurches = false;
    }
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;

    this.manufacturedArray = [
      {
        "Product": "TW",
        "ManufacturerCode": 31,
        "MANUFACTURER": "BAJAJ",
        "VEHICLEMODELCODE": 12718,
        "VEHICLEMODEL": "AVENGER200CC",
        "NUMBEROFWHEELS": 2,
        "CUBICCAPACITY": 200,
        "SEATINGCAPACITY": 2,
        "MAXIMUMPRICE": 68072,
        "MINIMUMPRICE": 58500,
        "FUELTYPE": "Petrol T"
      },
      {
        "Product": "TW",
        "ManufacturerCode": 31,
        "MANUFACTURER": "BAJAJ",
        "VEHICLEMODELCODE": 11052,
        "VEHICLEMODEL": "PULSAR DTS FI 220 CC",
        "NUMBEROFWHEELS": 2,
        "CUBICCAPACITY": 220,
        "SEATINGCAPACITY": 2,
        "MAXIMUMPRICE": 89800,
        "MINIMUMPRICE": 66435,
        "FUELTYPE": "Petrol T"
      },
      {
        "Product": "TW",
        "ManufacturerCode": 39,
        "MANUFACTURER": "TVS",
        "VEHICLEMODELCODE": 14565,
        "VEHICLEMODEL": "TVS WEGO",
        "NUMBEROFWHEELS": 2,
        "CUBICCAPACITY": 110,
        "SEATINGCAPACITY": 2,
        "MAXIMUMPRICE": 49500,
        "MINIMUMPRICE": 40500,
        "FUELTYPE": "Petrol T"
      },
      {
        "Product": "TW",
        "ManufacturerCode": 34,
        "MANUFACTURER": "HONDA",
        "VEHICLEMODELCODE": 13625,
        "VEHICLEMODEL": "ACTIVA",
        "NUMBEROFWHEELS": 2,
        "CUBICCAPACITY": 110,
        "SEATINGCAPACITY": 2,
        "MAXIMUMPRICE": 44688,
        "MINIMUMPRICE": 38188,
        "FUELTYPE": "Petrol T"
      },
      {
        "Product": "TW",
        "ManufacturerCode": 34,
        "MANUFACTURER": "HONDA",
        "VEHICLEMODELCODE": 13626,
        "VEHICLEMODEL": "ACTIVA 3G",
        "NUMBEROFWHEELS": 2,
        "CUBICCAPACITY": 110,
        "SEATINGCAPACITY": 2,
        "MAXIMUMPRICE": 45689,
        "MINIMUMPRICE": 48188,
        "FUELTYPE": "Petrol T"
      }

    ];

    this.carManufacturedArray = [
      {
        "Product": "FW",
        "ManufacturerCode": 10,
        "MANUFACTURER": "MARUTI",
        "VEHICLEMODELCODE": 2866,
        "VEHICLEMODEL": "WAGON R LXI",
        "NUMBEROFWHEELS": 4,
        "CUBICCAPACITY": 1061,
        "SEATINGCAPACITY": 5,
        "ModelCode": 2866,
        // "MAXIMUMPRICE": 680720,
        // "MINIMUMPRICE": 585000,
        "FUELTYPE": "Petrol C",
        "VEHICLECLASSCODE": 45,
        "VEHICLEMODELSTATUS": "Active",
        "Ex_Showroom_Price": 348212
      },
      {
        "Product": "FW",
        "ManufacturerCode": 10,
        "MANUFACTURER": "MARUTI",
        "VEHICLEMODELCODE": 16849,
        "VEHICLEMODEL": "ERTIGA VDI",
        "NUMBEROFWHEELS": 4,
        "CUBICCAPACITY": 1061,
        "SEATINGCAPACITY": 5,
        "ModelCode": 16849,
        // "MAXIMUMPRICE": 680720,
        // "MINIMUMPRICE": 585000,
        "FUELTYPE": "Petrol C",
        "VEHICLECLASSCODE": 45,
        "VEHICLEMODELSTATUS": "Active",
        "Ex_Showroom_Price": 348212
      },
      {
        "Product": "FW",
        "ManufacturerCode": 10,
        "MANUFACTURER": "MARUTI",
        "VEHICLEMODELCODE": 2866,
        "VEHICLEMODEL": "WAGON R LXI",
        "NUMBEROFWHEELS": 4,
        "CUBICCAPACITY": 1061,
        "SEATINGCAPACITY": 5,
        "ModelCode": 2866,
        // "MAXIMUMPRICE": 680720,
        // "MINIMUMPRICE": 585000,
        "FUELTYPE": "Petrol C",
        "VEHICLECLASSCODE": 45,
        "VEHICLEMODELSTATUS": "Active",
        "Ex_Showroom_Price": 348212
      },
      {
        "Product": "FW",
        "ManufacturerCode": 73,
        "MANUFACTURER": "MG",
        "VEHICLEMODELCODE": 13625,
        "VEHICLEMODEL": "VERNA",
        "NUMBEROFWHEELS": 4,
        "CUBICCAPACITY": 110,
        "SEATINGCAPACITY": 2,
        // "MAXIMUMPRICE": 446880,
        // "MINIMUMPRICE": 381880,
        "FUELTYPE": "Petrol T"
      },
      {
        "Product": "FW",
        "ManufacturerCode": 10,
        "MANUFACTURER": "MARUTI",
        "VEHICLEMODELCODE": 2866,
        "VEHICLEMODEL": "WAGON R LXI",
        "NUMBEROFWHEELS": 4,
        "CUBICCAPACITY": 1061,
        "SEATINGCAPACITY": 5,
        "ModelCode": 2866,
        // "MAXIMUMPRICE": 680720,
        // "MINIMUMPRICE": 585000,
        "FUELTYPE": "Petrol C",
        "VEHICLECLASSCODE": 45,
        "VEHICLEMODELSTATUS": "Active",
        "Ex_Showroom_Price": 348212
      }

    ];



    this.registeredCityArray = [{ TXT_RTO_LOCATION_CODE: 81, TXT_RTO_LOCATION_DESC: "MAHARASHTRA-NAGPUR" },
    { TXT_RTO_LOCATION_CODE: 91, TXT_RTO_LOCATION_DESC: "DELHI-NEW DELHI" },
    { TXT_RTO_LOCATION_CODE: 8907, TXT_RTO_LOCATION_DESC: "BIHAR-BHAGALPUR" },
    { TXT_RTO_LOCATION_CODE: 9314, TXT_RTO_LOCATION_DESC: "ANDHRA PRADESH-REPALLE" },
    { TXT_RTO_LOCATION_CODE: 640, TXT_RTO_LOCATION_DESC: "ORISSA-CHHATRAPUR" },
    { TXT_RTO_LOCATION_CODE: 634, TXT_RTO_LOCATION_DESC: "MAHARASHTRA-PUNE" },
    { TXT_RTO_LOCATION_CODE: 646, TXT_RTO_LOCATION_DESC: "GOA-SOUTH QUEPEM" },
    { TXT_RTO_LOCATION_CODE: 378, TXT_RTO_LOCATION_DESC: "MAHARASHTRA-AMRAVATI" },
    { TXT_RTO_LOCATION_CODE: 412, TXT_RTO_LOCATION_DESC: "MAHARASHTRA-NASHIK" }];



    this.getManufactureData();


    /////previous policy details/////
    this.DurationDetail = [
      { id: 1, year: "1 Year" },
      { id: 2, year: "2 Year" },
      { id: 3, year: "3 Year" }
    ];
    this.ClaimsMadeDetail = [{ id: 0, claims: 0 }, { id: 1, claims: 1 }, { id: 2, claims: 2 }, { id: 3, claims: 3 }];
    this.NCBArray = [{ idw: 10, NCB: 0 }, { idw: 11, NCB: 20 }, { idw: 12, NCB: 25 }, { idw: 13, NCB: 30 }, { idw: 14, NCB: 35 }, { idw: 15, NCB: 40 }, { idw: 16, NCB: 45 }, { idw: 17, NCB: 50 }, { idw: 18, NCB: 55 }, { idw: 19, NCB: 60 }, { idw: 20, NCB: 65 }, { idw: 68, NCB: 68 }];
  }


  pageBack() {
    this.router.navigate(['/insurance']);
  }

  getManufactureData() {
    this.showInsuranceDetailsPage = true;
    this.showPreviousPolicyDetailsPage = false;
    if (this.typeOfInsurance == "Car") {
      this.manufactureAreay = this.carManufacturedArray;
    } else if (this.typeOfInsurance == "Bike") {
      this.manufactureAreay = this.manufacturedArray;
    }
  }

  getSelectedDatalist(e): void {

    let val = '';
    val = e.target.value;
    if (val == '')
      this.BikeModel = '';
    let list;
    list = null;
    if (e.target.id == 'manufacture') {
      this.ModelSelectArray = [];
      list = this.manufactureAreay.filter(x => x.MANUFACTURER === val)[0];
      for (var i = 0; i < this.manufacturedArray.length; i++) {
        if (this.manufacturedArray[i].MANUFACTURER == list.MANUFACTURER)
          this.ModelSelectArray.push(this.manufacturedArray[i]);
      }
    }
    if (e.target.id == 'cityModel') {
      list = this.registeredCityArray.filter(x => x.TXT_RTO_LOCATION_DESC === val)[0];
      this.rtolocationcode = list.TXT_RTO_LOCATION_CODE;
      // for (var i = 0; i < this.manufacturedArray.length; i++) {
      //   if (this.manufacturedArray[i].MANUFACTURER == list.MANUFACTURER)
      //     this.ModelSelectArray.push(this.manufacturedArray[i]);
      // }
    }
    if (e.target.id == 'BikeModel') {
      list = this.ModelSelectArray.filter(x => x.VEHICLEMODEL === val)[0];
      this.bikeModelCode = list.VEHICLEMODELCODE;
      this.bikeModelManufactCode = list.ManufacturerCode;
      this.ExShowRoomPrice = list.MINIMUMPRICE;
    }
  }


  ValidateData() {
    if (this.rtolocationcode == undefined || this.rtolocationcode == 0) {
      this.message = "please select City ";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.manufacture == undefined || this.manufacture == 0) {
      this.message = "please select manufacture ";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.BikeModel == undefined || this.BikeModel == 0) {
      this.message = "please select  Bike Model";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.registrationDate == undefined || this.registrationDate == 0) {
      this.message = "please select  Registration Date";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
  }

  submit() {
    if (this.ValidateData() === false) {
      return;
    }

    if (this.typeOfInsurance == "Car") {
      //get twprimium method   roll over section car
      // this.LoginDataService.presentLoadingCustom();
      this.spinner.show();
      let ModelInfo = {
        BusinessType: "Roll Over",
        VehicleMakeCode: this.bikeModelCode,  // "31",
        ExShowRoomPrice: 512715,      //this.ExShowRoomPrice,
        RTOLocationCode: this.rtolocationcode,
        DealId: "DL-3005/411041",
        PolicyStartDate: moment(this.registrationDate).add('day', 1).format('YYYY/MM/DD'), //"2019/05/06",
        PolicyEndDate: moment(this.registrationDate).add('year', 1).format('YYYY/MM/DD'), //"2020/05/05",
        GSTToState: "MAHARASHTRA",
        ManufacturingYear: moment(this.registrationDate).format('YYYY'),
        DeliveryOrRegistrationDate: moment(this.registrationDate).format('YYYY/MM/DD'), //  this.registrationDate,//
        FirstRegistrationDate: "2019/01/04",  //  moment(this.registrationDate).add('year').format('YYYY/MM/DD'),
        Tenure: "1",
        PACoverTenure: "1",
        IsNoPrevInsurance: true,
        CustomerType: "INDIVIDUAL",
        CorrelationId: "",
        IsPACoverOwnerDriver: false,
        RSAPlanName: 'TW-299',
        ZeroDepPlanName: 'Silver TW',
      }
      console.log(ModelInfo);
      // this.loadingService.toggleLoadingIndicator(true);
      this.apiService.sendToServer<ICore>('/api/insurance/GetFWPremium', ModelInfo, this).subscribe(data => {
        this.spinner.hide();
        if (data.status.toUpperCase() === "SUCCESS") {
          console.log(data);
          // this.navCtrl.push(previousPolicyDetails, { "NumberDetails": this.NumberDetails, "typeOfInsurance ": this.typeOfInsurance, "infoDetail": this.DetailObjectArray, "responseData": data, "selectObject": this.BikeModelObject });

        }
        else {
          this.message = data.status;

        }
      }
        , err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        });

      // this.navCtrl.push(previousPolicyCarDetailsPage, { "NumberDetails": this.NumberDetails, "typeOfInsurance ": this.typeOfInsurance, "infoDetail": this.DetailObjectArray, "selectObject": this.BikeModelObject });

    }
    else {

      // this.DetailObjectArray = [];
      // var date = this.registrationDate;
      // this.BikeModelObject["date"] = date;
      // console.log(this.BikeModelObject);
      // this.ExShowRoomPrice = this.BikeModelObject.MINIMUMPRICE;
      // this.DetailObjectArray.push(this.BikeModelObject);
      // console.log(this.DetailObjectArray);
      this.PC_CalculatePremium();
    }


  }


  PC_CalculatePremium() {
    this.spinner.show();
    let ModelInfo = {
      VehicleModelCode: this.bikeModelCode,
      RTOLocationCode: this.rtolocationcode,
      ManufacturingYear: moment(this.registrationDate).format('YYYY'),
      ExShowRoomPrice: this.ExShowRoomPrice,
      DealId: "DL-3005/411041",
      BusinessType: 'Roll Over',
      FirstRegistrationDate: "2019/01/04",  //  moment(this.registrationDate).add('year').format('YYYY/MM/DD'),
      VehicleMakeCode: this.bikeModelManufactCode,  // "31",
      Tenure: "1",
      PACoverTenure: "1",
      DeliveryOrRegistrationDate: moment(this.registrationDate).format('YYYY/MM/DD'), //  this.registrationDate,//
      PolicyStartDate: moment(this.registrationDate).add('day', 1).format('YYYY/MM/DD'), //"2019/05/06",
      PolicyEndDate: moment(this.registrationDate).add('year', 1).format('YYYY/MM/DD'), //"2020/05/05",
      GSTToState: "MAHARASHTRA",
      IsNoPrevInsurance: true,
      CustomerType: "INDIVIDUAL",
      CorrelationId: "",
      IsPACoverOwnerDriver: false,
      RSAPlanName: 'TW-299',
      ZeroDepPlanName: 'Silver TW',
    }
    console.log(ModelInfo);
    // this.loadingService.toggleLoadingIndicator(true);
    this.apiService.sendToServer<IInsurance>('/api/insurance/GetTWPremium', ModelInfo, this).subscribe(data => {
      console.log(data);
      this.spinner.hide();
      if (data.status.toUpperCase() === "SUCCESS") {
        // this.navCtrl.push(previousPolicyDetails, { "NumberDetails": this.NumberDetails, "typeOfInsurance ": this.typeOfInsurance, "infoDetail": this.DetailObjectArray, "responseData": data, "selectObject": this.BikeModelObject });
        this.showInsuranceDetailsPage = false;
        this.showPreviousPolicyDetailsPage = true;
        this.selectModel = data.generalInformation.vehicleModel;
        this.selectedCompany = data.generalInformation.manufacturerName;   //selecterd detail
        // this.registrationDate = moment(data.generalInformation.registrationDate).format('LLLL'); //this.txt_Fdate = new Date(this.txt_Fdate);
        this.selectedRtoLocation = data.generalInformation.rtoLocation;
        this.exShowRoomPrice = data.generalInformation.showRoomPrice;
        this.finalPremium = data.finalPremium;
        this.ddClaimMade = "0";
        this.ddClaimBonus = "11";
      }
      else {

        this.message = data.status;
        MessageBox.show(this.dialog, this.message, "");
      }
    }
      , err => {
        // this.message = err;
        console.log(err);
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      });
 }

 

  GetFWPremium() {
    //new car
    this.spinner.show();
    let ModelInfo = {
      BusinessType: 'New Business',
      CustomerType: "INDIVIDUAL",
      DealId: 'DL-3001/1484764',
      PolicyStartDate: "2019/01/10", // moment(this.purchasedate).format('YYYY/MM/DD'),//
      PolicyEndDate: moment(this.registrationDate).add('year', 1).format('YYYY/MM/DD'),
      //"2020/01/09", //
      VehicleMakeCode: 121,
      VehicleModelCode: 11289,
      RTOLocationCode: 8,
      Tenure: "1",
      TPTenure: "3",
      PACoverTenure: "1",
      ManufacturingYear: 2019,
      DeliveryOrRegistrationDate: "2019/01/10",// this.registrationDate,// ,
      ExShowRoomPrice: 348212,
      GSTToState: 'MAHARASHTRA',
      CorrelationId: '',
      IsNoPrevInsurance: true,
      IsLegalLiabilityToPaidDriver: false,
      IsPACoverOwnerDriver: false,
      IsVehicleHaveLPG: false,
      IsVehicleHaveCNG: false,
      SIVehicleHaveLPG_CNG: 2000,
      SIHaveElectricalAccessories: 5000,
      SIHaveNonElectricalAccessories: 10000,
      IsPACoverUnnamedPassenger: false,
      SIPACoverUnnamedPassenger: 100000,
      IsAutomobileAssocnFlag: false,
      IsAntiTheftDisc: false,
      IsHandicapDisc: false,
      RSAPlanName: "RSA-Plus",
      ZeroDepPlanName: "Silver PVT",
      LossOfPersonalBelongingPlanName: "PLAN A",
      OtherLoading: 0,
      OtherDiscount: 0,
    }
    console.log(ModelInfo);
    // this.loadingService.toggleLoadingIndicator(true);
    this.apiService.sendToServer<ICore>('/api/insurance/GetFWPremium', ModelInfo, this).subscribe(data => {
      console.log(data);
      this.spinner.hide();
      // if (data.status.toUpperCase() === "SUCCESS") {
      //   this.navCtrl.push(selectYourPlan, { "NumberDetails": this.NumberDetails, "typeOfInsurance": this.typeOfInsurance, "infoDetail": data, "selectObject": this.BikeModelObject });
      // }
      // else {
      //   this.message =data.status;
      // }
    }
      , err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      });

  }

  /////////previous policy details////////////////////////

  nextPage() {

  }

  isAddOnCheck(val) {
    if (val == "roadSide") {
      this.btnBuyNow = false;
      this.btnRecalculate = true;
    }
    else if (val == "zeroDesc") {
      this.btnBuyNow = false;
      this.btnRecalculate = true;
    }
  }
  process() {
  this.router.navigate(['/insurance/confirmDetails'], { queryParams: { VehicleNumber: 'MH-24563', Mobile: '7798880952', Email:'vivektondare@gmail.com'  }, skipLocationChange: true });
}
   ///recalculate
   reCalculatePolicy() {
    //CAR
    if (this.typeOfInsurance == "Car") {
        if (this.RollOver == "RollOver") {
            this.BusinessType = "Roll Over"
        }
        else {
          this.BusinessType   = "New Business"
            // PACoverTenure  required
        }
        let ModelInfo = {
            BusinessType:  this.BusinessType,
            CustomerType: "INDIVIDUAL",
            DealId: 'DL-3001/1484764',
            PolicyStartDate: "2019/01/10", // moment(this.purchasedate).format('YYYY/MM/DD'),//
            PolicyEndDate: "2020/01/09", //moment(this.purchasedate).add('year', 1).format('YYYY/MM/DD'),
            VehicleMakeCode: 121,
            VehicleModelCode: 11289,
            RTOLocationCode: 8,
            Tenure: "1",
            TPTenure: "3",
            PACoverTenure: "1",
            ManufacturingYear: 2019,
            DeliveryOrRegistrationDate: "2019/01/04",// ,
            ExShowRoomPrice: 348212,
            GSTToState: 'MAHARASHTRA',
            CorrelationId: '',
            IsNoPrevInsurance: true,
            IsLegalLiabilityToPaidDriver: false,
            IsPACoverOwnerDriver: false,
            IsVehicleHaveLPG: false,
            IsVehicleHaveCNG: false,
            SIVehicleHaveLPG_CNG: 2000,
            SIHaveElectricalAccessories: 5000,
            SIHaveNonElectricalAccessories: 10000,
            IsPACoverUnnamedPassenger: false,
            SIPACoverUnnamedPassenger: 100000,
            IsAutomobileAssocnFlag: false,
            IsAntiTheftDisc: false,
            IsHandicapDisc: false,
            RSAPlanName: "RSA-Plus",
            ZeroDepPlanName: "Silver PVT",
            LossOfPersonalBelongingPlanName: "PLAN A",
            OtherLoading: 0,
            OtherDiscount: 0,
          }
          console.log(ModelInfo);
          // this.loadingService.toggleLoadingIndicator(true);
          this.apiService.sendToServer<IInsurance>('/api/insurance/GetFWPremium', ModelInfo, this).subscribe(data => {
            if (data.status.toUpperCase() === "SUCCESS") {
                console.log(data);
                this.btnBuyNow = true;
                this.finalPremium = data.finalPremium;
            }
            else {
              this.message = data.status;
              MessageBox.show(this.dialog, this.message, "");
            }
        }
            , err => {
              this.spinner.hide();
              this.errorHandler.handlePageError(err);
            });
    }
     ///BIKE
           else {
        if (this.RollOver == "RollOver") {
            this.BusinessType = "Roll Over"
        }
        else {
            this.BusinessType = "New Business"
            // PACoverTenure  required
        }
        let ModelInfo = {
            VehicleModelCode: "380",
            RTOLocationCode: "192",//this.rtolocationcode,//,
            ManufacturingYear: "2019", // moment(this.registrationDate).format('YYYY'),
            ExShowRoomPrice: "73689",   //this.ExShowRoomPrice,// ,
            DealId: "DL-3005/411041",
            BusinessType: this.BusinessType, // this.bussinesstype,// "New Business",
            VehicleMakeCode: "31", //this.BikeModelObject.ManufacturerCode,,
            Tenure: "1",
            TPTenure: "5", //   year select 
            PACoverTenure: "1", //
            DeliveryOrRegistrationDate: "2019/01/04", //moment(this.registrationDate).format('YYYY/MM/DD') , //  this.registrationDate,// 
            PolicyStartDate: "2019/05/06",  //moment(this.registrationDate).add('day',1).format('YYYY/MM/DD'),
            PolicyEndDate: "2020/05/05",   // moment(this.registrationDate).add('year',1).format('YYYY/MM/DD'),  
            GSTToState: "MAHARASHTRA",
            CustomerType: "INDIVIDUAL",
            CorrelationId: "",
            //new parameters
            IsPACoverOwnerDriver: false,
            RSAPlanName: 'TW-299',
            ZeroDepPlanName: 'Silver TW',
            IsNoPrevInsurance: this.IsNoPrevInsurance, //
            IsTransferOfNCB: false,
            // PreviousPolicyTenure: this.PreviousPolicyType,
            TransferOfNCBPercent: this.ncba,
            TotalNoOfODClaims: this.selectedclaims,
            IsHaveElectricalAccessories: false,
            SIHaveElectricalAccessories: this.electricalAcc,
            IsHaveNonElectricalAccessories: false,
            SIHaveNonElectricalAccessories: this.NoelectricalAcc,
            IsAntiTheftDisc: this.IsAntiTheftDisc,
            IsHandicapDisc: false,
            IsPACoverUnnamedPassenger: this.IsPACoverUnnamedPassenger,
            SIPACoverUnnamedPassenger: this.SIPACoverUnnamedPassenger,
            IsValidDrivingLicense: this.IsValidDrivingLicense
        }
        console.log(ModelInfo);
        // this.loadingService.toggleLoadingIndicator(true);
        this.apiService.sendToServer<IInsurance>('/api/insurance/GetTWPremium', ModelInfo, this).subscribe(data => {
            if (data.status.toUpperCase() === "SUCCESS") {
                console.log(data);
                this.btnBuyNow = true;
                this.finalPremium = data.finalPremium;
            }
            else {
              this.message = data.status;
              MessageBox.show(this.dialog, this.message, "");
            }
        }
            , err => {
              this.spinner.hide();
        this.errorHandler.handlePageError(err);
            });
    }
}


}
