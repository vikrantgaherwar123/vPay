import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Common } from './services/common';
import * as moment from 'moment';
declare const $: any;

//import { Spinner } from './services/spinner';
import 'style-loader!./app.component.scss';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [Common],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  termCondContent: string;
  DisplayFAQModal: boolean = false;
  //position = 'bottom-right';
  showToasty = 'hToasty';
  SystemYear: string = "";
  constructor(private toastyService: ToastyService, private common: Common) {

  }

  ngOnInit() {
    this.SystemYear = moment(Date.now()).format('YYYY');
  }
  rightClick() {
    return false;
  }

  termConditions() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "1", loginFlag: 'B' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  privacyPolicy() {
    this.common.TermConditons({ Term_Cond_Type: "2", loginFlag: 'B' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  // gotoFaqs() {
  //   // this.router.navigate(['/faq']);
  //   window.open('/faq');
  // }

  FAQ() {
    this.DisplayFAQModal = true;
    if (this.DisplayFAQModal == true) {
      $(document).ready(function () {
        $("#faqs").modal('show');
      });
    }
  }

  // onActivate() {
  //   // window.scrollTo(x-coord, y-coord);
  //   $("a[href='#top']").click(function () {
  //     $("html, body").animate({ scrollTop: 0 }, "slow");
  //     return false;
  //   });
  // }

  onActivate(event) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

}
