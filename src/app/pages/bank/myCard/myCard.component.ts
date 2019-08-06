import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Spinner } from '../../../services/spinner';
import { MatDialog } from "@angular/material";
import { Common } from '../../../services/common';


@Component({
  selector: 'app-bank',
  templateUrl: './myCard.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
})
export class MyCardComponent implements OnInit {
  btnBack: boolean = true;
  atmCard: boolean = false;
  cardName: any;
  topUpCard: boolean = false;
  tab: any;
  req: any;
  tab1: any;
  termCondContent: string;


  constructor(private router: Router, private route: ActivatedRoute,private common: Common,
    private spinner: Spinner, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.req = this.route.queryParams["_value"].Request;
    if (this.req == 'atm') {
      this.ChangeMenu("atmCard");
      this.cardName ="ATM Card"
    }
    else if (this.req == 'topup') {
      this.ChangeMenu("topCard");
      this.cardName ="Topup Card"
    }
  }

  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "6", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  ChangeMenu(menu) {
    this.clearPage();
    if (menu == "atmCard") {
      this.tab = 'tab1';
      this.atmCard = true;
    }
    else {
      this.tab = 'tab2';
      this.topUpCard = true;
    }
  }

  pageBack() {
    this.clearPage();
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
  }

  clearPage() {
    this.atmCard = false;
    this.topUpCard = false;
  }


}


