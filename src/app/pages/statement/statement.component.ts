import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-statement',
  styleUrls: ['./statement.scss'],
  templateUrl: './statement.html',
  providers: []
})

export class StatementComponent implements OnInit {
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  TransactionStatus: boolean = false;
  statementOfAcc: boolean = true;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.route.queryParams["_value"].ID != null) {
      this.ChangeMenu('TransactionStatus');
    }

  }

  ChangeMenu(menu) {
    if (menu == "statementOfAcc") {
      this.tab = 'tab1';
      this.statementOfAcc = true;
      this.TransactionStatus = false;

    }
    else if (menu == "TransactionStatus") {
      this.tab = 'tab2';
      this.TransactionStatus = true;
      this.statementOfAcc = false;

    }
  }


}
