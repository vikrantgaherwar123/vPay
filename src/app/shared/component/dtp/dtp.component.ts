import { Component, ViewChild, ElementRef, HostListener, EventEmitter, Input, Output } from '@angular/core';
// import * as ng2Bootstrap from 'ng2-bootstrap/ng2-bootstrap';
// import { ModalDirective, ModalModule } from 'ng2-bootstrap';
// import { debug } from 'util';

@Component({
    selector: 'dtp',
    styleUrls: ['./dtp.scss'],
    templateUrl: './dtp.html'
})

export class dtp {
    private isLoading = false;
    private mainobj : any;
    private subscription: any;
    noofdays: number; private currentDate = new Date();
    vmsg : string; StartD: string = ''; Sel_MonthYear = '';
    DateOrTime : string; DayOfDate:string;
    CssDivTimeUI: string; CssDivDateUI: string; CssDivMonthYear:string;
    CssDivTime: string; _pickerctrl: string;
    CssDiv: string; CssDivfirst: string; CssDivsecond : string; CssRow : string; CssCol : string;
    DMY : string; 
    _ArrBind: Array<any>; _ArrMonthsYears: Array<any>;
    _ArrDays: Array<any>; _Months: Array<any>; _ArrMonths: Array<any>; _Years: Array<any>; _ArrYears: Array<any>;
    _ArrHours: Array<any>; _ArrMinutes: Array<any>; HM : string;
    _TotalDates:number; _TotalYears:number; _DaysInWeek: Array<any>;

    //datetimepicker
    _Day:string; _Year:string; _Month:string;
    _clssd: string;
    ClsDivDBD: string; ClsDivDBM: string; ClsDivDBY: string; num:number;
    
    //Years
    Y1:string = ''; Y2:string = ''; Y3:string = ''; Y4:string = ''; Y5: string = ''; Y6:string = ''; Y7:string = ''; Y8:string = ''; Y9:string = ''; Y10:string = '';
    Y11:string = ''; Y12:string = ''; Y13:string = ''; Y14:string = ''; Y15:string = '';
    //Years CSS
    _cssY1:string = ''; _cssY2:string = ''; _cssY3:string = ''; _cssY4:string = ''; _cssY5: string = ''; _cssY6:string = ''; _cssY7:string = ''; _cssY8:string = ''; _cssY9:string = ''; _cssY10:string = '';
    _cssY11:string = ''; _cssY12:string = ''; _cssY13:string = ''; _cssY14:string = ''; _cssY15:string = '';

    //Months CSS
    _cssM1:string = ''; _cssM2:string = ''; _cssM3:string = ''; _cssM4:string = ''; _cssM5:string = ''; _cssM6:string = '';
    _cssM7:string = ''; _cssM8:string = ''; _cssM9:string = ''; _cssM10:string = ''; _cssM11:string = ''; _cssM12:string = '';

    //Dates
    D1:string = ''; D2:string = ''; D3:string = ''; D4:string = ''; D5:string = ''; D6:string = ''; D7:string = ''; D8:string = ''; D9:string = ''; D10:string = '';
    D11:string = ''; D12:string = ''; D13:string = ''; D14:string = ''; D15:string = ''; D16:string = ''; D17:string = ''; D18:string = ''; D19:string = ''; D20:string = '';
    D21:string = ''; D22:string = ''; D23:string = ''; D24:string = ''; D25:string = ''; D26:string = ''; D27:string = ''; D28:string = ''; D29:string = ''; D30:string = '';
    D31:string = ''; D32:string = ''; D33:string = ''; D34:string = ''; D35:string = ''; D36:string = ''; D37:string = ''; D38:string = ''; D39:string = ''; D40:string = '';
    D41:string = ''; D42:string = '';

    //Dates CSS
    _clssd1:string = ''; _clssd2:string = ''; _clssd3:string = ''; _clssd4:string = ''; _clssd5:string = ''; _clssd6:string = ''; _clssd7:string = ''; _clssd8:string = ''; _clssd9:string = ''; _clssd10:string = '';
    _clssd11:string = ''; _clssd12:string = ''; _clssd13:string = ''; _clssd14:string = ''; _clssd15:string = ''; _clssd16:string = ''; _clssd17:string = ''; _clssd18:string = ''; _clssd19:string = ''; _clssd20:string = '';
    _clssd21:string = ''; _clssd22:string = ''; _clssd23:string = ''; _clssd24:string = ''; _clssd25:string = ''; _clssd26:string = ''; _clssd27:string = ''; _clssd28:string = ''; _clssd29:string = ''; _clssd30:string = '';
    _clssd31:string = ''; _clssd32:string = ''; _clssd33:string = ''; _clssd34:string = ''; _clssd35:string = ''; _clssd36:string = ''; _clssd37:string = ''; _clssd38:string = ''; _clssd39:string = ''; _clssd40:string = '';
    _clssd41:string = ''; _clssd42:string = '';

    public modelShow: boolean = false;
    public dtpObj: any; public fromobj: any;

    @Output() callBackMethod = new EventEmitter<any>();
    constructor(public el: ElementRef) {
        this.ClearData();
        this.Load_InitialData();
    }

    Load_InitialData = function () {
        this._TotalDates = 42; this._TotalYears = 15;
        this._Months = [{ A: '01', B: 'Jan',C: 'January' }, { A: '02', B: 'Feb', C: 'February' }, { A: '03', B: 'Mar', C: 'March' }, { A: '04', B: 'Apr', C: 'April' },
        { A: '05', B: 'May', C: 'May' }, { A: '06', B: 'Jun', C: 'June' }, { A: '07', B: 'Jul', C: 'July' }, { A: '08', B: 'Aug', C: 'August' },
        { A: '09', B: 'Sep', C: 'September' }, { A: '10', B: 'Oct', C: 'October' }, { A: '11', B: 'Nov', C: 'November' }, { A: '12', B: 'Dec', C: 'December' },
        ];
        this._Years = [{ value: '2016' }, { value: '2017' }, { value: '2018' }];
        this._DaysInWeek = [{ A: 'Sunday', B: 'Sun', C: 'S', D: 0 },
        { A: 'Monday', B: 'Mon', C: 'M', D: 1 },
        { A: 'Tuesday', B: 'Tue', C: 'T', D: 2 },
        { A: 'Wednesday', B: 'Wed', C: 'W', D: 3 },
        { A: 'Thrusday', B: 'Thu', C: 'T', D: 4 },
        { A: 'Friday', B: 'Fri', C: 'F', D: 5 },
        { A: 'Saturday', B: 'Sat', C: 'S', D: 6 },
        ]
    }

    ClearData = function(){
        this.noofdays = 0; this._clssd = ''; this._pickerctrl = '';
        this.CssDivTimeUI = 'div_none'; this.CssDivDateUI = 'div_none'; this.CssDivMonthYear = 'div_none';
        this.HM = ''; this.DMY = ''; this.DateOrTime = '';
        
        this._Day = this.currentDate.toDateString().split(' ')[0];
        this._Date = this.currentDate.toDateString().split(' ')[2];
        this._Month = this.currentDate.toDateString().split(' ')[1];
        this._Year = this.currentDate.toDateString().split(' ')[3];
        
        this._HH = ''; this._MM = '';

        this.ClsDivDBD = 'div_block'; this.ClsDivDBM = 'div_none'; this.ClsDivDBY = 'div_none';
    }

    toggleDTTMcontrol(loading, page) {
        if (page)
            this.mainobj = page;

        if (loading) {
            if (loading.ctrl === 'DTTMPC') {
                
                this.modelShow = true;
                this.dtpObj = loading;
                this.fromobj = page;

                this.ClearData();
                this.isLoading = loading.show;
                this.DateOrTime = loading.mtype;
                if (loading.mtype == 'SET DATE') {
                    this.CssDivTimeUI = 'div_none'; this.CssDivDateUI = ''; this._pickerctrl = 'datepicker-control-container';
                    this.Get_CurrentDate();
                    this.Fill_DB_Days();
                    this.Year_Selected(this._Year);
                    this.Set_DayOfDate(this._Day);
                    this.Set_CurrentMonth(this._Month);
                }
                if (loading.mtype == 'SET TIME') {
                    this.CssDivTimeUI = ''; this.CssDivDateUI = 'div_none'; this._pickerctrl = 'timepicker-control-container';
                    this.ClsDivDBD = 'div_none'; this.ClsDivDBM = 'div_none'; this.ClsDivDBY = 'div_none';
                }
            }
        }
    }
    
    Load_MonthsYears = function (Arg1, Arg2, Arg3) {
        var i = 0; var yrs = 0; var startyrs = 0;
        if (Arg1 == 'MONTHS') {
            this._ArrMonths = new Array();
        }
        if (Arg1 == 'YEARS') {
            this._ArrYears = new Array();
            yrs = parseInt(Arg2) / 2;
            startyrs = parseInt(this._Year) - yrs;
        }

        while (i < Arg2) {
            if (Arg1 == 'MONTHS') {
                if (this._Months == undefined)
                    this.Load_InitialData();

                if (Arg3 == 'A')
                    this._ArrMonths[i] = { value: this._Months[i].A };
                if (Arg3 == 'B')
                    this._ArrMonths[i] = { value: this._Months[i].B };
                if (Arg3 == 'C')
                    this._ArrMonths[i] = { value: this._Months[i].C };
            }
            if (Arg1 == 'YEARS') {
                this._ArrYears[i] = { value: startyrs };
                startyrs++;
            }

            i++;
        }

        if (Arg1 == 'YEARS') {
            this.Year_Selected(this._Year);
        }
    }

    get_SelectedYear = function(yr){
        switch (yr) {
            case 1: return this.Y1; case 2: return this.Y2; case 3: return this.Y3; case 4: return this.Y4; case 5: return this.Y5;
            case 6: return this.Y6; case 7: return this.Y7; case 8: return this.Y8; case 9: return this.Y9; case 10: return this.Y10;
            case 11: return this.Y11; case 12: return this.Y12; case 13: return this.Y13; case 14: return this.Y14; case 15: return this.Y15;

            default:
                break;
        }
    }

    get_SelectedDate = function(de){
        switch (de) {
            case 1: return this.D1; case 2: return this.D2; case 3: return this.D3; case 4: return this.D4; case 5: return this.D5;
            case 6: return this.D6; case 7: return this.D7; case 8: return this.D8; case 9: return this.D9; case 10: return this.D10;

            case 11: return this.D11; case 12: return this.D12; case 13: return this.D13; case 14: return this.D14; case 15: return this.D15;
            case 16: return this.D16; case 17: return this.D17; case 18: return this.D18; case 19: return this.D19; case 20: return this.D20;

            case 21: return this.D21; case 22: return this.D22; case 23: return this.D23; case 24: return this.D24; case 25: return this.D25;
            case 26: return this.D26; case 27: return this.D27; case 28: return this.D28; case 29: return this.D29; case 30: return this.D30;
                
            case 31: return this.D31; case 32: return this.D32; case 33: return this.D33; case 34: return this.D34; case 35: return this.D35;
            case 36: return this.D36; case 37: return this.D37; case 38: return this.D38; case 39: return this.D39; case 40: return this.D40;

            case 41: return this.D41; case 42: return this.D42;
        
            default:
                break;
        }
    }

    GetMonth = function(arg1){
        var idx = this._Months.map(function (item) {
            if(arg1 == "MM") return item.A;
            if(arg1 == "MMM") return item.B;
        }).indexOf(this._Month);
       
        if(idx >=0){
            if(arg1 == "MM") return this._Months[idx].A;
            if(arg1 == "MMM") return this._Months[idx].B;
        }
    }
    ReturnDate = function(format){
        switch (format) {
            case "dd/MM/yyyy": return this._Date + '/' + this.GetMonth('MM') + '/' + this._Year;
            case "dd/MMM/yyyy": return this._Date + '/' + this.GetMonth('MMM') + '/' + this._Year;

            default:
                break;
        }
    }
    clk_nextyears = function(){
        if(parseInt(this.Y1) > 0)
            this.Fill_DB_Years(parseInt(this.Y1) - 15);
    }
    clk_previousyears = function(){
        this.Fill_DB_Years(parseInt(this.Y15) + 1);
    }

    ClickCancel = function(){
        this.modelShow = false; 
        this.CssDiv = 'div_none';
        this.DMY = ''; this.HM = '';
     }

     ClickSet = function () {
        // this.vmsg = '';
        // if (this.ValidateData() === false) {
        //     var msgobj = {
        //         msg: this.vmsg,
        //     }
        //     this.loadingService.toggleMSGcontrol(msgobj);
        //     return;
        // }
        
        if(this.mainobj.CallBack){
            var robj = this.mainobj;
            if(this.DateOrTime == 'SET DATE'){
                robj.selectvalue = this._Date + ' / ' + this._Month + ' / ' + this._Year;
                robj.mydate = this.ReturnDate("dd/MMM/yyyy");
            }
            if(this.DateOrTime == 'SET TIME')
                robj.selectvalue = this._HH + ' : ' + this._MM;

            var res = {
                selectvalue: robj.selectvalue,
                mydate: robj.mydate,
                SetControlValue: this.mainobj.SetControlValue,
            }

            this.ClickCancel();
            this.mainobj.CallBack(res);
        }
    }

    Get_DayOfDate = function(){
        var day = '';
        var newdate = this._Month + " " + this._Date + "," + this._Year;
        if (newdate != undefined && newdate != '') {
            var dt = new Date(newdate);
            if (dt != undefined) {
                day = dt.toDateString().split(' ')[0];
                this.Set_DayOfDate(day);
            }
        }
    }

    clk_SetDate = function(de){
        this._Date = this.PadLeft(this.get_SelectedDate(de),2);
        this.Get_DayOfDate();
        this.ForDate();
    }
    clk_SetMonth = function (mn) {
        this._Month = this._Months[mn].B;
        this.Fill_DB_Days();
        this.Clk_DB_Day();
        this.Get_DayOfDate();
        this.Set_CssForMonths(mn);
    }
    clk_SetYear = function(yr){
        this._Year = this.get_SelectedYear(yr);
        this.Fill_DB_Days();
        this.Clk_DB_Day();
        this.Get_DayOfDate();
    }

    Clk_DB_Day = function(){
        this.ClsDivDBD = 'div_block'; this.ClsDivDBM = 'div_none'; this.ClsDivDBY = 'div_none';
        this.CssDivDateUI = 'div_block'; this.CssDivMonthYear = 'div_none';
    }

    Clk_DB_Month = function(){
        this.ClsDivDBD = 'div_none'; this.ClsDivDBM = 'div_block'; this.ClsDivDBY = 'div_none';
        this.Sel_MonthYear = 'M';
        this.Load_MonthsYears('MONTHS',12,'C');
        this._ArrMonthsYears = this._ArrMonths;
    }

    Clk_DB_Year = function(){
        this.ClsDivDBD = 'div_none'; this.ClsDivDBM = 'div_none'; this.ClsDivDBY = 'div_block';
        this.Sel_MonthYear = 'Y';
        this.Load_MonthsYears('YEARS',150,'');
        this._ArrMonthsYears = this._ArrYears;
    }

    Set_CssForMonths = function (selmonth) {
        var i = 0;
        while (i <= 11) {
            if (this._Months[i].B == this._Months[selmonth].B) {
                this.Set_CssMonths((i + 1), 'clssmn');
            }
            else {
                this.Set_CssMonths((i + 1), 'clsmn');
            }
            i++;
        }
    }

    Set_CssMonths = function(num, css){
        switch (num) {
            case 1: this._cssM1 = css; break; 
            case 2: this._cssM2 = css; break; 
            case 3: this._cssM3 = css; break; 
            case 4: this._cssM4 = css; break; 
            case 5: this._cssM5 = css; break;
            case 6: this._cssM6 = css; break; 
            case 7: this._cssM7 = css; break; 
            case 8: this._cssM8 = css; break; 
            case 9: this._cssM9 = css; break; 
            case 10: this._cssM10 = css; break;
            case 11: this._cssM11 = css; break; 
            case 12: this._cssM12 = css; break; 
            

            default:
                break;
        }
    }

    Set_CurrentMonth = function (month) {
        var selmonth = -1;
        if (this._Month !== '') {
            var idx = this._Months.map(function (item) {
                return item.B;
            }).indexOf(this._Month);

            if (idx >= 0) {
               //this._Month = this._Months[idx].C;
               this._Month = this._Months[idx].B;
               this.Set_CssForMonths(idx);
            }
        }
    }

    Set_DayOfDate = function (day) {
        var idx = -1;
        idx = this._DaysInWeek.map(function (item) {
            return item.B;
        }).indexOf(day);

        if (idx >= 0) {
            this.DayOfDate = this._DaysInWeek[idx].A.toUpperCase();
        }
    }

    Set_Years = function(num, value, css){
        switch (num) {
            case 1: this.Y1 = value; this._cssY1 = css; break; 
            case 2: this.Y2 = value; this._cssY2 = css; break; 
            case 3: this.Y3 = value; this._cssY3 = css; break; 
            case 4: this.Y4 = value; this._cssY4 = css; break; 
            case 5: this.Y5 = value; this._cssY5 = css; break;
            case 6: this.Y6 = value; this._cssY6 = css; break; 
            case 7: this.Y7 = value; this._cssY7 = css; break; 
            case 8: this.Y8 = value; this._cssY8 = css; break; 
            case 9: this.Y9 = value; this._cssY9 = css; break; 
            case 10: this.Y10 = value; this._cssY10 = css; break;
            case 11: this.Y11 = value; this._cssY11 = css; break; 
            case 12: this.Y12 = value; this._cssY12 = css; break; 
            case 13: this.Y13 = value; this._cssY13 = css; break; 
            case 14: this.Y14 = value; this._cssY14 = css; break; 
            case 15: this.Y15 = value; this._cssY15 = css; break;

            default:
                break;
        }
    }

    Year_Selected = function(yr){
        this.Fill_DB_Years(parseInt(yr) - 7);
    }

    Fill_DB_Years = function (yrs) {
        var i = 0; var yr = yrs;
        //var curryear = this.currentDate.toDateString().split(' ')[3];
        while (i <= this._TotalYears) {
            if (this._Year == yr) {
                this.Set_Years((i + 1), yr, 'clssyr');
            }
            else {
                this.Set_Years((i + 1), yr, 'clsyr');
            }
            yr++; i++;
        }
    }

    Set_DateInDays = function(num, value, css){
        switch (num) {
            case 1: this.D1 = value; this._clssd1 = css; break; 
            case 2: this.D2 = value; this._clssd2 = css; break; 
            case 3: this.D3 = value; this._clssd3 = css; break; 
            case 4: this.D4 = value; this._clssd4 = css; break; 
            case 5: this.D5 = value; this._clssd5 = css; break;
            case 6: this.D6 = value; this._clssd6 = css; break; 
            case 7: this.D7 = value; this._clssd7 = css; break; 
            case 8: this.D8 = value; this._clssd8 = css; break; 
            case 9: this.D9 = value; this._clssd9 = css; break; 
            case 10: this.D10 = value; this._clssd10 = css; break;

            case 11: this.D11 = value; this._clssd11 = css; break; 
            case 12: this.D12 = value; this._clssd12 = css; break; 
            case 13: this.D13 = value; this._clssd13 = css; break; 
            case 14: this.D14 = value; this._clssd14 = css; break; 
            case 15: this.D15 = value; this._clssd15 = css; break;
            case 16: this.D16 = value; this._clssd16 = css; break; 
            case 17: this.D17 = value; this._clssd17 = css; break; 
            case 18: this.D18 = value; this._clssd18 = css; break; 
            case 19: this.D19 = value; this._clssd19 = css; break; 
            case 20: this.D20 = value; this._clssd20 = css; break;

            case 21: this.D21 = value; this._clssd21 = css; break; 
            case 22: this.D22 = value; this._clssd22 = css; break; 
            case 23: this.D23 = value; this._clssd23 = css; break; 
            case 24: this.D24 = value; this._clssd24 = css; break; 
            case 25: this.D25 = value; this._clssd25 = css; break;
            case 26: this.D26 = value; this._clssd26 = css; break; 
            case 27: this.D27 = value; this._clssd27 = css; break; 
            case 28: this.D28 = value; this._clssd28 = css; break; 
            case 29: this.D29 = value; this._clssd29 = css; break; 
            case 30: this.D30 = value; this._clssd30 = css; break;
                
            case 31: this.D31 = value; this._clssd31 = css; break; 
            case 32: this.D32 = value; this._clssd32 = css; break; 
            case 33: this.D33 = value; this._clssd33 = css; break; 
            case 34: this.D34 = value; this._clssd34 = css; break; 
            case 35: this.D35 = value; this._clssd35 = css; break;
            case 36: this.D36 = value; this._clssd36 = css; break; 
            case 37: this.D37 = value; this._clssd37 = css; break; 
            case 38: this.D38 = value; this._clssd38 = css; break; 
            case 39: this.D39 = value; this._clssd39 = css; break; 
            case 40: this.D40 = value; this._clssd40 = css; break;

            case 41: this.D41 = value; this._clssd41 = css; break; 
            case 42: this.D42 = value; this._clssd42 = css; break;
        
            default:
                break;
        }
    }

    PadLeft = function (value, length) {
        while (parseInt(value.toString().length) < parseInt(length))
            value = '0' + value;

        return value;
    }

    ForDate = function () {
        var i = 0; var date = 0;
        while (i <= this._TotalDates) {
            if (i > parseInt(this.StartD)) {
                if (date < this.noofdays) {
                    date++;
                    if (this.PadLeft(date.toString(),2) == this.PadLeft(this._Date,2)) {
                        this.Set_DateInDays(i, date, 'clssd')
                    }
                    else {
                        this.Set_DateInDays(i, date, 'clsdy')
                    }
                }
                else {
                    this.Set_DateInDays(i, '', 'clsdy')
                }
            }
            else {
                this.Set_DateInDays(i, '', 'clsdy')
            }

            i++;
        }
    }

    Fill_DB_Days = function () {
        var day = '';
       var newdate = this._Month + " 01," + this._Year;
       if (newdate != undefined && newdate != '') {
           var dt = new Date(newdate);
           if (dt != undefined) {
               day = dt.toDateString().split(' ')[0];

               this.StartD = this._DaysInWeek.map(function (item) {
                   return item.B;
               }).indexOf(day);
           }
       }

       if (day != '') {
           if (parseInt(this.StartD) >= 0) {
               this.Get_CurrentDate();
               this.ForDate();
           }
       }
   }

   daysInMonth = function (month,year) {
    return new Date(year, month, 0).getDate();
}

    Get_CurrentDate = function(){
        if (this._Month !== '' && this._Year !== '') {
            var idx = this._Months.map(function (item) {
                return item.B;
            }).indexOf(this._Month);

            this.noofdays = this.daysInMonth(parseInt(idx) + 1, parseInt(this._Year));
            if(parseInt(this._Date) > parseInt(this.noofdays)){
                this._Date = '1';
            }
        }
    }





}