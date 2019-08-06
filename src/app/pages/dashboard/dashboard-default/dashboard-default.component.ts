import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/gauge.js';
import '../../../../assets/charts/amchart/pie.js';
import '../../../../assets/charts/amchart/serial.js';
import '../../../../assets/charts/amchart/light.js';
import '../../../../assets/charts/amchart/ammap.js';
import '../../../../assets/charts/amchart/worldLow.js';
import { Common } from '../../../services/common';
import { Spinner } from '../../../services/spinner';
import { DataStorage } from '../../../core/dataStorage';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';
import { ILogin } from '../../../interface/login';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material";
import { MessageBox } from "../../../services/_shared/message-box";
declare const AmCharts: any;
declare const $: any;

@Component({
  selector: 'app-dashboard-default',
  templateUrl: './dashboard-default.component.html',
  styleUrls: [
    './dashboard-default.component.css'
  ],
  providers: [Common],
})
export class DashboardDefaultComponent implements OnInit, AfterViewInit {
  logInfo: ILogin;
  kycFlag: any;
  aadharBalance: number = 0.00;
  upiBalance: number = 0.00;
  bharatQrCodeBalance: number = 0.00;
  paymentGatewayBalance: number = 0.00;
  bbpsBalance: number = 0.00;
  fastPayBalance: number = 0.00;
  VPA: number = 0.00;
  FixQR: number = 0.00;
  AmountQR: number = 0.00;

  graphTotaldata = new Array();
  pieChartData = new Array();
  serialTotalChart: any;
  serialAadharChart: any;
  serialUPIChart: any;
  serialPaymentGateWayChart: any;


  //dialog
  message;




  constructor(private dataStorage: DataStorage, public dialog: MatDialog, private route: ActivatedRoute, public spinner: Spinner,
    private common: Common, private router: Router) { }
  zoomChart() {
    if (this.serialTotalChart.dataProvider)
      this.serialTotalChart.zoomToIndexes(this.serialTotalChart.dataProvider.length - 40, this.serialTotalChart.dataProvider.length - 1);
  }

  ngAfterViewInit() {

    this.logInfo = this.dataStorage.logInfo;
    if (this.route.queryParams["_value"].kyc != 'false') {
      this.kycFlag = this.logInfo[0].KYC_FLAG;
      if (this.kycFlag == 'N') {
        $(document).ready(function () {
          // (<any>$("#KYCModal")).modal('show');
          $("#KYCModal").modal('show');
        });
      }
    }

  }
  ngOnInit() {

    // history.pushState(null, null, location.href);
    // window.onpopstate = function (event) {
    //   history.go();
    // };
    history.pushState(null, null, location.href);
    window.onpopstate = function (event) {
      history.forward();
    };

    // this.common.getMessages().subscribe(message => {
    //   alert(message + "  dashboard");
    //   //this.messages.push(message);
    // })

    // dashboard box resize css add remove class
    $(function () {
      $(window).bind("resize", function () {
        if ($(this).width() < 1200) {
          $('#bbpsBal').removeClass('bbpsBox')
        }
        else {
          $('#bbpsBal').addClass('bbpsBox')
        }
      }).trigger('resize');
    });




    if (this.dataStorage.spentAnalyzer && this.dataStorage.spentAnalyzer[0] && this.dataStorage.spentAnalyzer[1]
      && this.dataStorage.spentAnalyzer[2] && this.dataStorage.spentAnalyzer[3] && this.dataStorage.spentAnalyzer[4]
      && this.dataStorage.spentAnalyzer[5]) {
      this.aadharBalance = this.dataStorage.spentAnalyzer[0].BAL;
      this.upiBalance = this.dataStorage.spentAnalyzer[1].BAL + this.dataStorage.spentAnalyzer[2].BAL + this.dataStorage.spentAnalyzer[3].BAL;
      this.bharatQrCodeBalance = 0.00;
      this.VPA = this.dataStorage.spentAnalyzer[1].BAL;
      this.FixQR = this.dataStorage.spentAnalyzer[2].BAL;
      this.AmountQR = this.dataStorage.spentAnalyzer[3].BAL;
      this.paymentGatewayBalance = this.dataStorage.spentAnalyzer[4].BAL;
      this.bbpsBalance = 0.00;//this.dataStorage.spentAnalyzer[5].BAL;
      this.fastPayBalance = 0.00; //this.dataStorage.spentAnalyzer[6].BAL;
      this.graphTotaldata = this.dataStorage.statementAll;
    }
    this.pieChartData = [
      {
        'caption': 'Aadhar',
        'value': this.aadharBalance
      },
      {
        'caption': 'VPA',
        'value': this.VPA
      },
      {
        'caption': 'FixQR',
        'value': this.FixQR
      },
      {
        'caption': 'AmountQR',
        'value': this.AmountQR
      },
      {
        'caption': 'BharatQrCode',
        'value': this.bharatQrCodeBalance
      },
      {
        'caption': 'PaymentGateway',
        'value': this.paymentGatewayBalance
      },
      {
        'caption': 'Bbps',
        'value': this.bbpsBalance
      },
      {
        'caption': 'FastPay',
        'value': this.fastPayBalance
      }
    ]

    this.serialTotalChart = AmCharts.makeChart("statistics-chart", {
      "type": "serial",
      "path": "/assets/",
      "theme": "light",
      "marginRight": 40,
      "marginLeft": 40,
      "autoMarginOffset": 20,
      "mouseWheelZoomEnabled": true,
      "dataDateFormat": "YYYY-MM-DD",
      "valueAxes": [{
        "id": "v1",
        "axisAlpha": 0,
        "position": "left",
        "ignoreAxisWidth": true
      }],
      "balloon": {
        "borderThickness": 1,
        "shadowAlpha": 0
      },
      "graphs": [{
        "id": "g1",
        "balloon": {
          "drop": true,
          "adjustBorderColor": false,
          "color": "#ffffff"
        },
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "bulletSize": 5,
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "title": "red line",
        "useLineColorForBulletBorder": true,
        "valueField": "value",
        "balloonText": "<span style='font-size:18px;'>₹[[value]]</span>"
      }],
      "chartScrollbar": {
        "graph": "g1",
        "oppositeAxis": false,
        "offset": 30,
        "scrollbarHeight": 80,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "graphLineAlpha": 0.5,
        "selectedGraphFillAlpha": 0,
        "selectedGraphLineAlpha": 1,
        "autoGridCount": true,
        "color": "#AAAAAA"
      },
      "chartCursor": {
        "pan": true,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "cursorAlpha": 1,
        "cursorColor": "#258cbb",
        "limitToGraph": "g1",
        "valueLineAlpha": 0.2,
        "valueZoomable": true
      },
      "valueScrollbar": {
        "oppositeAxis": false,
        "offset": 50,
        "scrollbarHeight": 10
      },
      "categoryField": "date",
      "categoryAxis": {
        "parseDates": true,
        "dashLength": 1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      },
      "dataProvider": this.graphTotaldata
    });
    this.serialTotalChart.addListener("rendered", this.zoomChart);
    this.zoomChart();

    //Payment GateWay
    this.serialPaymentGateWayChart = AmCharts.makeChart("payment-gateway", {
      type: 'serial',
      path: '/assets/',
      marginTop: 0,
      hideCredits: true,
      marginRight: 20,
      dataProvider: this.dataStorage.pamentGateWayStatmentData,
      "graphs": [{
        "id": "g1",
        // "balloon": {
        //   "drop": false,
        //   "adjustBorderColor": true,
        //   "color": "#ffffff"
        // },
        bullet: "round",
        bulletBorderAlpha: 1,
        bulletColor: "#FFFFFF",
        bulletSize: 5,
        hideBulletsCount: 50,
        lineThickness: 2,
        title: "red line",
        useLineColorForBulletBorder: true,
        valueField: "value",
        balloonText: "<span style='font-size:18px;'>₹[[value]]</span>"
      }],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: false,
        valueLineBalloonEnabled: true,
        valueLineAlpha: false,
        color: '#fff',
        cursorColor: '#FC6180',
        fullWidth: true
      },
      categoryField: "date",
      categoryAxis: {
        parseDates: true,
        dashLength: 1,
        minorGridEnabled: true
      },
      'export': {
        enabled: true
      }
    });
    this.serialPaymentGateWayChart.addListener("rendered", this.zoomChart);
    this.zoomChart();

    //aadhar-payment
    this.serialAadharChart = AmCharts.makeChart('aadhar-payment', {
      type: 'serial',
      path: '/assets/',
      marginTop: 0,
      hideCredits: true,
      marginRight: 20,
      dataProvider: this.dataStorage.aadharStatmentData,
      "graphs": [{
        "id": "g1",
        "balloon": {
          "drop": true,
          "adjustBorderColor": false,
          "color": "#ffffff"
        },
        bullet: "round",
        bulletBorderAlpha: 1,
        bulletColor: "#FFFFFF",
        bulletSize: 5,
        hideBulletsCount: 50,
        lineThickness: 2,
        title: "red line",
        useLineColorForBulletBorder: true,
        valueField: "value",
        balloonText: "<span style='font-size:18px;'>₹[[value]]</span>"
      }],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: false,
        valueLineBalloonEnabled: true,
        valueLineAlpha: false,
        color: '#fff',
        cursorColor: '#FC6180',
        fullWidth: true
      },
      categoryField: "date",
      categoryAxis: {
        parseDates: true,
        dashLength: 1,
        minorGridEnabled: true
      },
      'export': {
        enabled: true
      }
    });
    this.serialAadharChart.addListener("rendered", this.zoomChart);
    this.zoomChart();
    //upi
    this.serialUPIChart = AmCharts.makeChart('upi', {
      type: 'serial',
      path: '/assets/',
      marginTop: 0,
      hideCredits: true,
      marginRight: 20,
      dataProvider: this.dataStorage.upiStatmentData,
      "graphs": [{
        "id": "g1",
        "balloon": {
          "drop": true,
          "adjustBorderColor": false,
          "color": "#ffffff"
        },
        bullet: "round",
        bulletBorderAlpha: 1,
        bulletColor: "#FFFFFF",
        bulletSize: 5,
        hideBulletsCount: 50,
        lineThickness: 2,
        title: "red line",
        useLineColorForBulletBorder: true,
        valueField: "value",
        balloonText: "<span style='font-size:18px;'>₹[[value]]</span>"
      }],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: false,
        valueLineBalloonEnabled: true,
        valueLineAlpha: false,
        color: '#fff',
        cursorColor: '#FC6180',
        fullWidth: true
      },
      categoryField: "date",
      categoryAxis: {
        parseDates: true,
        dashLength: 1,
        minorGridEnabled: true
      },
      'export': {
        enabled: true
      }
    });
    this.serialUPIChart.addListener("rendered", this.zoomChart);
    this.zoomChart();

    //bharatQRCode
    AmCharts.makeChart('bharatQRCode', {
      type: 'serial',
      marginTop: 0,
      hideCredits: true,
      marginRight: 80,
      dataProvider: null,
      valueAxes: [{
        axisAlpha: 0,
        dashLength: 12,
        gridAlpha: 0.1,
        position: 'left'
      }],
      graphs: [{
        id: 'g1',
        bullet: 'round',
        bulletSize: 9,
        lineColor: '#ffffff',
        lineThickness: 2,
        negativeLineColor: '#ffffff',
        type: 'smoothedLine',
        valueField: 'value'
      }],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: false,
        valueLineBalloonEnabled: true,
        valueLineAlpha: false,
        color: '#fff',
        cursorColor: '#FC6180',
        fullWidth: true
      },
      categoryField: 'year',
      categoryAxis: {
        gridAlpha: 0,
        axisAlpha: 0,
        fillAlpha: 1,
        fillColor: '#ffb64d',
        minorGridAlpha: 0,
        minorGridEnabled: true
      },
      'export': {
        enabled: true
      }
    });

    //Bbps-payment
    AmCharts.makeChart('Bbps-payment', {
      type: 'serial',
      marginTop: 0,
      hideCredits: true,
      marginRight: 80,
      dataProvider: null,
      valueAxes: [{
        axisAlpha: 0,
        dashLength: 12,
        gridAlpha: 0.1,
        position: 'left'
      }],
      graphs: [{
        id: 'g1',
        bullet: 'round',
        bulletSize: 9,
        lineColor: '#ffffff',
        lineThickness: 2,
        negativeLineColor: '#ffffff',
        type: 'smoothedLine',
        valueField: 'value'
      }],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: false,
        valueLineBalloonEnabled: true,
        valueLineAlpha: false,
        color: '#fff',
        cursorColor: '#FC6180',
        fullWidth: true
      },
      categoryField: 'year',
      categoryAxis: {
        gridAlpha: 0,
        axisAlpha: 0,
        fillAlpha: 1,
        fillColor: '#ffb64d',
        minorGridAlpha: 0,
        minorGridEnabled: true
      },
      'export': {
        enabled: true
      }
    });

    //fastag-payment
    AmCharts.makeChart('fastag-payment', {
      type: 'serial',
      marginTop: 0,
      hideCredits: true,
      marginRight: 80,
      dataProvider: null,
      valueAxes: [{
        axisAlpha: 0,
        dashLength: 12,
        gridAlpha: 0.1,
        position: 'left'
      }],
      graphs: [{
        id: 'g1',
        bullet: 'round',
        bulletSize: 9,
        lineColor: '#ffffff',
        lineThickness: 2,
        negativeLineColor: '#ffffff',
        type: 'smoothedLine',
        valueField: 'value'
      }],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: false,
        valueLineBalloonEnabled: true,
        valueLineAlpha: false,
        color: '#fff',
        cursorColor: '#FC6180',
        fullWidth: true
      },
      categoryField: 'year',
      categoryAxis: {
        gridAlpha: 0,
        axisAlpha: 0,
        fillAlpha: 1,
        fillColor: '#4680ff',
        minorGridAlpha: 0,
        minorGridEnabled: true
      },
      'export': {
        enabled: true
      }
    });

    $('.flip').click(function () {
      $(this).find('.card').addClass('flipped').mouseleave(function () {
        $(this).removeClass('flipped');
      });
      return true;
    });
  }

  goTOStatement() {
    // this.router.navigate(['']);
  }

  onTaskStatusChange(event) {
    const parentNode = (event.target.parentNode.parentNode);
    parentNode.classList.toggle('done-task');
  }

  dataGraph(data) {
    debugger;

    this.makeGraph({ id: 'statistics-chart', data: data.total }, data);
    this.makeGraph({ id: 'aadhar-payment', data: data.aadhar }, data);
    this.makeGraph({ id: 'upi', data: data.upi }, data);
    this.makeGraph({ id: 'bharatQRCode', data: data.bharatQRCode }, data);
    this.makeGraph({ id: 'payment-gateway', data: data.paymentGateway }, data);
    this.makeGraph({ id: 'Bbps-payment', data: data.bbps }, data);
    this.makeGraph({ id: 'fastag-payment', data: data.fastTag }, data);

  }
  cardGraph(data) {
    debugger;
    this.aadharBalance = data[0].BAL;
    this.upiBalance = data[1].BAL + data[2].BAL + data[3].BAL;
    this.bharatQrCodeBalance = 0.00;
    this.VPA = data[1].BAL;
    this.FixQR = data[2].BAL;
    this.AmountQR = data[3].BAL;
    this.paymentGatewayBalance = data[4].BAL;
    this.bbpsBalance = 0.00;//data[5].BAL;
    this.fastPayBalance = 0.00; //data[6].BAL;
    this.graphTotaldata = this.dataStorage.statementAll;
  }
  makeGraph(obj: any, data) {
    let fillColors = '';
    let lineColors = '';
    if (obj.id === "statistics-chart") {
      fillColors = '#FAFAFA';
      lineColors = '#4680ff';
    } else if (obj.id === "aadhar-payment") {
      fillColors = '#4680ff';
      lineColors = '#FAFAFA';
    } else if (obj.id === "upi") {
      fillColors = '#fc6180';
      lineColors = '#FAFAFA';
    } else if (obj.id === "payment-gateway") {
      fillColors = '#93be52';
      lineColors = '#FAFAFA';
    } else if (obj.id === "Bbps-payment") {
      fillColors = '#ffb64d';
      lineColors = '#FAFAFA';
    }

    if (data.graphFlag === 'serial')
      this.serialGraph(obj.id, obj.data, lineColors, fillColors);
    else if (data.graphFlag === 'pie')
      this.pieGraph(obj.id, obj.data);

  }

  serialGraph(id, data, lineColors, fillColors) {
    let graphExpandPath = '';
    if (id == 'statistics-chart') {


      this.serialTotalChart = AmCharts.makeChart(id, {
        "type": "serial",
        "path": '/assets/',
        "theme": "light",
        "marginRight": 40,
        "marginLeft": 40,
        "marginTop": 40,
        "autoMarginOffset": 20,
        "mouseWheelZoomEnabled": true,
        "dataDateFormat": "YYYY-MM-DD",
        "valueAxes": [{
          "id": "v1",
          "axisAlpha": 0,
          "position": "left",
          "ignoreAxisWidth": true
        }],
        "balloon": {
          "borderThickness": 1,
          "shadowAlpha": 0
        },
        "graphs": [{
          "id": "g1",
          "balloon": {
            "drop": true,
            "adjustBorderColor": false,
            "color": "#ffffff"
          },
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "bulletSize": 5,
          "hideBulletsCount": 50,
          "lineThickness": 2,
          "title": "red line",
          "useLineColorForBulletBorder": true,
          "valueField": "value",
          "balloonText": "<span style='font-size:18px;'>₹[[value]]</span>"
        }],
        "chartScrollbar": {
          "graph": "g1",
          "oppositeAxis": false,
          "offset": 30,
          "scrollbarHeight": 80,
          "backgroundAlpha": 0,
          "selectedBackgroundAlpha": 0.1,
          "selectedBackgroundColor": "#888888",
          "graphFillAlpha": 0,
          "graphLineAlpha": 0.5,
          "selectedGraphFillAlpha": 0,
          "selectedGraphLineAlpha": 1,
          "autoGridCount": true,
          "color": "#AAAAAA"
        },
        "chartCursor": {
          "pan": true,
          "valueLineEnabled": true,
          "valueLineBalloonEnabled": true,
          "cursorAlpha": 1,
          "cursorColor": "#258cbb",
          "limitToGraph": "g1",
          "valueLineAlpha": 0.2,
          "valueZoomable": true
        },
        "valueScrollbar": {
          "oppositeAxis": false,
          "offset": 50,
          "scrollbarHeight": 10
        },
        "categoryField": "date",
        "categoryAxis": {
          "parseDates": true,
          "dashLength": 1,
          "minorGridEnabled": true
        },
        "export": {
          "enabled": true
        },
        "dataProvider": data
      });
    }
    else {
      this.serialTotalChart = AmCharts.makeChart(id, {
        type: 'serial',
        path: '/assets/',
        marginTop: 0,
        hideCredits: true,
        marginRight: 20,
        dataProvider: data,
        "graphs": [{
          "id": "g1",
          // "balloon": {
          //   "drop": true,
          //   "adjustBorderColor": false,
          //   "color": "#ffffff"
          // },
          bullet: "round",
          bulletBorderAlpha: 1,
          bulletColor: "#FFFFFF",
          bulletSize: 5,
          hideBulletsCount: 50,
          lineThickness: 2,
          title: "red line",
          useLineColorForBulletBorder: true,
          valueField: "value",
          balloonText: "<span style='font-size:18px;'>₹[[value]]</span>"
        }],
        chartCursor: {
          cursorAlpha: 0,
          valueLineEnabled: false,
          valueLineBalloonEnabled: true,
          valueLineAlpha: false,
          color: '#fff',
          cursorColor: '#FC6180',
          fullWidth: true
        },
        categoryField: "date",
        categoryAxis: {
          parseDates: true,
          dashLength: 1,
          minorGridEnabled: true
        },
        'export': {
          enabled: true
        }
      });

    }

    this.serialTotalChart.addListener("rendered", this.zoomChart);
    this.zoomChart();

  }
  pieGraph(id, data) {
    if (this.dataStorage.spentAnalyzer && this.dataStorage.spentAnalyzer[0] && this.dataStorage.spentAnalyzer[1]
      && this.dataStorage.spentAnalyzer[2] && this.dataStorage.spentAnalyzer[3] && this.dataStorage.spentAnalyzer[4]
      && this.dataStorage.spentAnalyzer[5]) {
      this.aadharBalance = this.dataStorage.spentAnalyzer[0].BAL;
      this.bharatQrCodeBalance = 0.00;
      this.VPA = this.dataStorage.spentAnalyzer[1].BAL;
      this.FixQR = this.dataStorage.spentAnalyzer[2].BAL;
      this.AmountQR = this.dataStorage.spentAnalyzer[3].BAL;
      this.paymentGatewayBalance = this.dataStorage.spentAnalyzer[4].BAL;
      this.bbpsBalance = 0.00;//this.dataStorage.spentAnalyzer[5].BAL;
      this.fastPayBalance = 0.00;
    }
    this.pieChartData = [
      {
        'caption': 'Aadhar',
        'value': this.aadharBalance
      },
      {
        'caption': 'VPA',
        'value': this.VPA
      },
      {
        'caption': 'FixQR',
        'value': this.FixQR
      },
      {
        'caption': 'AmountQR',
        'value': this.AmountQR
      },
      {
        'caption': 'BharatQrCode',
        'value': this.bharatQrCodeBalance
      },
      {
        'caption': 'PaymentGateway',
        'value': this.paymentGatewayBalance
      },
      {
        'caption': 'Bbps',
        'value': this.bbpsBalance
      },
      {
        'caption': 'FastPay',
        'value': this.fastPayBalance
      }
    ]
    AmCharts.makeChart("statistics-chart", {
      "type": "pie",
      "theme": "light",
      "dataProvider": this.pieChartData,
      "valueField": "value",
      "titleField": "caption",
      "outlineAlpha": 0.4,
      "depth3D": 15,
      "balloonText": "[[title]]<br><span style='font-size:14px'><b>₹[[value]]</b> ([[percents]]%)</span>",
      "angle": 30,
      "export": {
        "enabled": true
      }
    });
  }

  goToStatement(id) {
    this.router.navigate(['/statements'], { queryParams: { ID: id }, skipLocationChange: true });
  }

  complekyc(flag) {
    // this.router.navigate(['/settings/profile'], { queryParams: { ID: flag }, skipLocationChange: true });
    this.router.navigate(['/settings'], { queryParams: { ID: flag }, skipLocationChange: true });

  }


  onClick(value) {
    // if(value =='aadhar')
    // this.router.navigate(['/billPayment/receiveMoney/aadhar'], { queryParams: { ID: value } });
    // else if(value == 'upi')
    // this.router.navigate(['/billPayment/receiveMoney'], { queryParams: { ID: value } });
    if (value == 'paymentGateway') {
      this.message = 'Coming Soon... ';
      MessageBox.show(this.dialog, this.message, "");
    }
    else if (value == 'aadhar') {
      if (this.logInfo[0].AEPS_TERMINAL_ID == undefined || this.logInfo[0].AEPS_TERMINAL_ID == null || this.logInfo[0].AEPS_TERMINAL_ID == '') { 
        this.message = "You are not a Authorised user";
        MessageBox.show(this.dialog, this.message, "");
        // this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
        return false;
      }else{
        this.router.navigate(['/billPayment/receiveMoney'], { queryParams: { ID: value } });
      }
    }
    else
      this.router.navigate(['/billPayment/receiveMoney'], { queryParams: { ID: value } });
  }






}
function getRandomData() {
  let data = [];
  const totalPoints = 300;
  if (data.length > 0) {
    data = data.slice(1);
  }

  while (data.length < totalPoints) {
    const prev = data.length > 0 ? data[data.length - 1] : 50;
    let y = prev + Math.random() * 10 - 5;
    if (y < 0) {
      y = 0;
    } else if (y > 100) {
      y = 100;
    }
    data.push(y);
  }

  const res = [];
  for (let i = 0; i < data.length; ++i) {
    res.push([i, data[i]]);
  }
  return res;
}
