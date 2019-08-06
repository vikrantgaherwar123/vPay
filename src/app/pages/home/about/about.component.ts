import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorage } from "../../../core/dataStorage";
import { Common } from '../../../services/common';
import {FormControl} from '@angular/forms';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
// import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var $: any;

@Component({
  selector: 'vgipl-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [DataStorage, Common, Spinner]
})
export class AboutComponent implements OnInit {
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  someDate: Date = new Date();
  // displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  // dataSource: MatTableDataSource<UserData>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  Items: Array<any>;
  QRDisp: any = 'None';
  chkTerm: any = true;
  PPhone: any;
  CPhone: any;
  SPhone: any;
  PEMail: any;
  CEMail: any;
  SEMail: any;
  INSTI_SUB_MST_ID: any;
  CLIENT_MST_ID: any;
  CORPORATE_FLAG: any = '';

  //dialog
  title;
  message;
  information;
  button;
  style;
  allow_outside_click;
  width;
  buttons = [
    { value: MessageBoxButton.Ok, display: "Ok" },
    { value: MessageBoxButton.OkCancel, display: "Ok/Cancel" },
    { value: MessageBoxButton.YesNo, display: "Yes/No" },
    { value: MessageBoxButton.AcceptReject, display: "Accept/Reject" }
  ];
  style_full = MessageBoxStyle.Full;
  style_simple = MessageBoxStyle.Simple;
  subscriber: Subscription;

  constructor(private router: Router, private dialog: MatDialog, private common: Common,
    private spinner: Spinner, private errorHandler: ErrorHandler, private dataStorage: DataStorage) {
        // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    this.GetTC();
    $('#vpayBanner').hide();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    // $('#txtMobileNo')[0].focus();
    // let v = true;
    // if(v!=true){
    //   $(document).ready(function () {
    //     (<any>$("#myModal")).modal('show');
    //   });
    // }
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  GetTC() {
    this.spinner.show();
    var paramObj = {
      client_mst_id: 0,//this.logInfo[0].CLIENT_MST_ID,
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: 0
    }
    this.common.getContactUs(paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.Items = data.cursor1[0].ADDRESS_1.split('|');
        this.PPhone = data.cursor1[0].PHONE_1;
        this.CPhone = data.cursor1[1].PHONE_1;
        this.SPhone = data.cursor1[2].PHONE_1;
        this.PEMail = data.cursor1[0].EMAILID_1;
        this.CEMail = data.cursor1[1].EMAILID_1;
        this.SEMail = data.cursor1[2].EMAILID_1;
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  gotoHome() {
    this.router.navigate(['']);
  }
  gotoLogin() {
    //this.dataStorage.loginUserType = flag;
    this.router.navigate(['/authentication/login']);
  }
  gotoSignUp(flag: string) {
    this.dataStorage.loginUserType = flag;
    this.router.navigate(['/authentication/signup'], { queryParams: { signUpUserType: flag } });
  }
  gotoAbout() {
    this.router.navigate(['/about']);
  }
  gotoHowToUse() {
    this.router.navigate(['/howItWorks']);
  }
  gotoOurTeam() {
    this.router.navigate(['/ourTeam']);
  }
  gotoWhyUs() {
    this.router.navigate(['/whyUs']);
  }

}



// export interface UserData {
//   id: string;
//   name: string;
//   progress: string;
//   color: string;
// }


// /** Constants used to fill up our data base. */
// const COLORS: string[] = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//   'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];



// /** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//   };
// }
