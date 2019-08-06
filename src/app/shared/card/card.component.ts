import { Component, OnInit, Input, Output, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { cardToggle, cardClose } from './card-animation';
// import { dtp } from '../../shared/component/dtp/dtp.component';
import { DataStorage } from '../../core/dataStorage';
import { ApiService } from '../../core/api.service';
import { IStatement } from '../../interface/statement';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [cardToggle, cardClose],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
  @Input() headerContent: string;
  @Input() title: string;
  @Input() blockClass: string;
  @Input() cardClass: string;
  @Input() classHeader = false;
  @Output() graphData = new EventEmitter<any>();

  toggle = true;
  toggle1 = true;

  txt_Fdate: any; txt_Tdate: any;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  // @ViewChild(dtp) dtp: dtp;
  timeDuration: any = 'M';
  graphType: any = 'serial';
  cardToggle = 'expanded';
  cardClose = 'open';
  fullCard: string;
  fullCardIcon: string;
  loadCard = false;
  isCardToggled = false;
  cardLoad: string;

  monthlyClass: string;
  quaterlyClass: string;
  halfYearlyClass: string;
  YearlyClass: string;
  objdttm: any;
  msgshowhide: string = '';
  DisplayMsg: string = '';
  loginInfo: any;
  graphTotaldata = new Array();
  graphAadharPayData = new Array();
  graphUPIData = new Array();
  graphPaymentGateWayData = new Array();
  constructor(private dataStorage: DataStorage, private apiService: ApiService) { }

  ngOnInit() {
    this.loginInfo = this.dataStorage.logInfo;
    let curDate = moment(this.loginInfo[0].LOGIN_DATE).format('DD-MMM-YYYY');
    let curDateAr = curDate.split('-');
    this.txt_Fdate = curDateAr[0] + '-' + curDateAr[1] + '-' + (parseInt(curDateAr[2]) - 1);
    // this.toDate = curDate;
    this.txt_Fdate = new Date(this.txt_Fdate);
    this.txt_Tdate = this.toDate;
  }

  ngDoCheck() {
    $('.f_date').on('click', function () {
      $('.redbg').removeClass('redbg');
      $('.f_date').addClass('redbg');
    });

    $('.t_date').on('click', function () {
      $('.redbg').removeClass('redbg');
      $('.t_date').addClass('redbg');
    });
  }
  double() {
    return false;
  }

  enableDisableRule() {
    this.toggle = !this.toggle;

  }
  enableDisable() {
    this.toggle1 = !this.toggle1;

  }

  toggleCard(event) {
    this.cardToggle = this.cardToggle === 'collapsed' ? 'expanded' : 'collapsed';
  }

  closeCard(event) {
    this.cardClose = this.cardClose === 'closed' ? 'open' : 'closed';
  }

  fullScreen(event) {
    this.fullCard = this.fullCard === 'full-card' ? '' : 'full-card';
    this.fullCardIcon = this.fullCardIcon === 'icofont-resize' ? '' : 'icofont-resize';
  }

  cardRefresh(event, graphType) {
    this.loadCard = true;
    this.cardLoad = 'card-load';
    if (graphType && graphType.length > 0)
      this.graphType = graphType;
    let datas: any = {
      total: null,
      aadhar: null,
      upi: null,
      paymentGateway: null,
      bbps: null,
      fastTag: null,
      bharatQrCode: null,
      graphFlag: this.graphType
    }
    //graphType == 'pie';  //TODO
    if (graphType == 'pie') {
      this.graphData.emit(datas);
    }
    //dataStorage.statementAll
    //dataStorage.statementAll
    this.txt_Fdate = moment(this.txt_Fdate).format("DD-MMM-YYYY");
    this.txt_Tdate = moment(this.txt_Tdate).format("DD-MMM-YYYY");

    var uinput = {
      opKeyword: "STATEMENT",
      client_mst_id: this.loginInfo[0].CLIENT_MST_ID,
      gateway_mst_id: 0,          //this._gatewaydetid,
      fromdate: this.txt_Fdate, uptodate: this.txt_Tdate,
      fromamt: 0.00, uptoamt: 999999, flag: 'S', recpayflag: 'A', device_id: 'D',
    }
    let pageObj = this;
    this.apiService.sendToServer<IStatement>('/api/statement/cstatement', uinput, this).subscribe(data => {

      if (data && data.msg !== 'Success') {
        //this.Call_MsgDiv('SHOW',data.msg);
      }
      if (data && data.msg === 'Success') {
        if (data.data) {
          let i = 0;
          let j = 0;
          let k = 0;
          let l = 0;
          data.data = data.data.reverse();
          for (i; i < data.data.length; i++) {
            if (data.data[i].SUCCESS == "Y") {
              //this.graphTotaldata[data.data.length - 1 - i] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
              this.graphTotaldata[i] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
              if (data.data[i].GATEWAY_TYPE == 'A') {
                this.graphAadharPayData[j] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                j++;
              }
              else if (data.data[i].GATEWAY_TYPE == 'C' || data.data[i].GATEWAY_TYPE == 'F' || data.data[i].GATEWAY_TYPE == 'Q') {
                this.graphUPIData[k] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                k++;
              }
              else if (data.data[i].GATEWAY_TYPE == 'P') {
                this.graphPaymentGateWayData[l] = { 'date': moment(data.data[i].TRAN_DATE).format('YYYY-MM-DD'), 'value': data.data[i].TRANSAMT };
                l++;
              }
            }
          }
          pageObj.dataStorage.statementAll = this.graphTotaldata;
          pageObj.dataStorage.aadharStatmentData = this.graphAadharPayData;
          pageObj.dataStorage.upiStatmentData = this.graphUPIData;
          pageObj.dataStorage.pamentGateWayStatmentData = this.graphPaymentGateWayData;
          if (graphType && graphType.trim().length > 0)
            this.graphType = graphType.trim();
          datas.total = this.graphTotaldata;
          datas.aadhar = this.graphAadharPayData;
          datas.upi = this.graphUPIData;
          datas.paymentGateway = this.graphPaymentGateWayData;

          this.graphData.emit(datas);
        }
      }
      else {
        datas.total = [
          {
            'date': moment(pageObj.dataStorage.logInfo[0].LOGIN_DATE).format('YYYY-MM-DD'),
            'value': 0
          }
        ];
        this.graphData.emit(datas);
        this.txt_Fdate = new Date(this.txt_Fdate);
        this.txt_Tdate = new Date(this.txt_Tdate);
      }
    },
      err => {
      })

    setTimeout(() => {
      this.txt_Fdate = new Date(this.txt_Fdate);
      this.txt_Tdate = new Date(this.txt_Tdate);
      this.cardLoad = '';
      this.loadCard = false;
    }, 3000);
  }

  



  getGraphData(duration, graphType) {
    // debugger;
    this.monthlyClass = 'activeL';
    this.quaterlyClass = '';
    this.halfYearlyClass = '';
    this.YearlyClass = '';
    if (duration.trim().length > 0)
      this.timeDuration = duration.trim();
    if (graphType.trim().length > 0)
      this.graphType = graphType.trim();
    switch (duration) {
      case 'M': this.monthlyClass = 'activeL'; this.quaterlyClass = ''; this.halfYearlyClass = ''; this.YearlyClass = '';
        break;
      case 'Q': this.monthlyClass = ''; this.quaterlyClass = 'activeL'; this.halfYearlyClass = ''; this.YearlyClass = '';
        break;
      case 'H': this.monthlyClass = ''; this.quaterlyClass = ''; this.halfYearlyClass = 'activeL'; this.YearlyClass = '';
        break;
      case 'Y': this.monthlyClass = ''; this.quaterlyClass = ''; this.halfYearlyClass = ''; this.YearlyClass = 'activeL';
        break;
      default:
        break;
    }


    let data: any = {
      total: null,
      aadhar: null,
      bharatQrCode: null,
      upi: null,
      paymentGateway: null,
      bbps: null,
      fastTag: null,
      graphFlag: this.graphType
    }
    data.total = [{
      year: '01-APR-2018',
      value: 100.00
    }, {
      year: '08-APR-2018',
      value: 5000.00
    }, {
      year: '28-APR-2018',
      value: 400.00
    }, {
      year: '30-APR-2018',
      value: 200.00
    }, {
      year: '02-MAY-2018',
      value: 100.00
    }, {
      year: '05-MAY-2018',
      value: 5000.00
    }, {
      year: '15-MAY-2018',
      value: 400.00
    }, {
      year: '25-MAY-2018',
      value: 200.00
    }, {
      year: '30-MAY-2018',
      value: 100.00
    }, {
      year: '03-JUNE-2018',
      value: 5000.00
    }, {
      year: '14-JUNE-2018',
      value: 400.00
    }, {
      year: '30-JUNE-2018',
      value: 200.00
    }

    ];

    data.aadhar = [{
      year: '1',
      value: 100.00
    }, {
      year: '8',
      value: 500.00
    }, {
      year: '28',
      value: 400.00
    }, {
      year: '30',
      value: 200.00
    }];

    data.upi = [{
      year: '1',
      value: 100.00
    }, {
      year: '8',
      value: 5000.00
    }, {
      year: '28',
      value: 400.00
    }, {
      year: '30',
      value: 200.00
    }];

    data.bharatQrCode = [{
      year: '1',
      value: 100.00
    }, {
      year: '8',
      value: 5000.00
    }, {
      year: '28',
      value: 400.00
    }, {
      year: '30',
      value: 200.00
    }];

    data.paymentGateway = [{
      year: '1',
      value: 100.00
    }, {
      year: '8',
      value: 5000.00
    }, {
      year: '28',
      value: 400.00
    }, {
      year: '30',
      value: 200.00
    }];

    data.bbps = [{
      year: '1',
      value: 100.00
    }, {
      year: '8',
      value: 5000.00
    }, {
      year: '28',
      value: 400.00
    }, {
      year: '30',
      value: 200.00
    }];

    data.fastTag = [{
      year: '1',
      value: 100.00
    }, {
      year: '8',
      value: 5000.00
    }, {
      year: '28',
      value: 400.00
    }, {
      year: '30',
      value: 200.00
    }];
    // if(graphType.trim().length>0)
    //   data.graphFlag=graphType;

    this.graphData.emit(data);
  }
}
