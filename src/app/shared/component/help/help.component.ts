import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from "@angular/core";
import { ApiService } from "../../../core/api.service";
import { IHelp } from "../../../interface/help";
import { Spinner } from "../../../services/spinner";
import { FocusDirective } from "../../directive/focus/focus.directive";
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";


@Component({
  selector: "help",
  host: { "(document:click)": "handleClick($event)" },
  styleUrls: ["./help.scss"],
  templateUrl: "./help.html",

})
export class Help {
  @Input() eid: string;
  //@Input() text:string;
  //@Input() captionArray;
  @Input() required: boolean = false;
  @Input() captionLabel;
  @Input() keyword;
  @Input() readonlyFlag;
  @Input() dataList = null;
  @Input() txtSelectedData: string;
  @Output() getData = new EventEmitter();
  @Output() getInputData = new EventEmitter();
  public focusEventEmitter = new EventEmitter<boolean>();
  public helpData: any;

  listClass: any = "hideList";
  filterText: any;
  labelFadeClass: string = "";

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


  constructor(public elementRef: ElementRef, private apiService: ApiService, private dialog: MatDialog
    , private rendrer2: Renderer2, private spinner: Spinner) {
    // this.ClearData();
    // this.Load_InitialData();
  }
  setval(item) {

    this.txtSelectedData = item.DESCRIPTION;
    this.keyword = this.keyword.split("~")[0];
    this.listClass = "hideList";
    this.labelFadeClass = "fadeLabel";
  }
  checkData(event) {
    this.listClass = "hideList";
    if (this.dataList && this.dataList.length > 0) {
      if (this.filterText.toString().trim().length > 0) {
        this.helpData = this.dataList.filter(function (el) {
          return el.DESCRIPTION.toLowerCase() == this.filterText.toLowerCase();
        }.bind(this));
        if (this.helpData.length > 0) { }
        else {
          this.filterText = '';
          return true;
        }
      }
      else {
        this.filterText = '';
        return true;
      }
    }
  }
  showBox(event) {
    // var elmAr = this.elementRef.nativeElement.querySelector('#scrollbar-1');
    // elmAr.listClass = "hideList"; 
    this.listClass = "showList";
    this.filterText = '';
    setTimeout(() => {
      this.focusEventEmitter.emit(true);
    }, 0);
  }
  hideBox() {
    setTimeout(() => {
      this.listClass = "hideList";
    }, 200);
  }
  // setNextFocus(event){
  //   if(event.code == 'ArrowDown'){

  //   }
  // } 
  search(event) {
    //  if(event.code == 'ArrowDown'){
    //   this.elementRef.nativeElement.children[1].children[0].children[0].children[1].children[0].children[0].focus();
    //   this.elementRef.nativeElement.children[1].children[0].children[0].children[1].children[0].children[0].style.color="green";
    //  }
    if (this.keyword == undefined)
      return;
    var uinput = {
      userid: 1,
      keyword: this.keyword,
      device_id: "Desktop"
    };
    if (this.keyword == "YESNO") {
      this.listClass = "showList";
      this.rendrer2.selectRootElement('#filterInput').focus();
      this.helpData = [
        { KEY: "Y", DESCRIPTION: "Yes" },
        { KEY: "N", DESCRIPTION: "No" }
      ];
      return;
    }
    if (this.keyword == "ACTY") {
      this.listClass = "showList";
      this.rendrer2.selectRootElement('#filterInput').focus();
      this.helpData = [
        { KEY: "SB", DESCRIPTION: "Saving Account" },
        { KEY: "CA", DESCRIPTION: "Current Account" }
      ];
      return;
    }
    this.spinner.show();
    if (this.dataList && this.dataList.length > 0) {
      if (this.filterText.toString().trim().length > 0) {
        this.helpData = this.dataList.filter(function (el) {
          return el.DESCRIPTION.toLowerCase().indexOf(this.filterText.toLowerCase()) == 0;
        }.bind(this));
      }
      else
        this.helpData = this.dataList;
      this.listClass = "showList";
      this.rendrer2.selectRootElement('#filterInput').focus();
      this.spinner.hide();
      //this.filterText = this.helpData[0].DESCRIPTION;
      return;
    }
    this.apiService
      .sendToServer<IHelp>("/auth/merchant/Search", uinput, this)
      .subscribe(
        data => {
          this.spinner.hide();
          if (data.code === 1 && data.cursor1.length > 0) {
            this.dataList = data.cursor1;
            this.listClass = "showList";
            this.rendrer2.selectRootElement('#filterInput').focus();

            if (this.filterText.toString().trim().length > 0) {
              this.helpData = this.dataList.filter(function (el) {
                return el.DESCRIPTION.toLowerCase().indexOf(this.filterText.toLowerCase()) == 0;
              }.bind(this));
            }
            else
              this.helpData = this.dataList;
            // this.filterText = this.helpData[0].DESCRIPTION;
          }
          else {

          }
        },
        err => {
          this.spinner.hide();
          this.message = err;
          MessageBox.show(this.dialog, this.message, "");
        },
        // () => console.log("client request details")
      );
  }
  handleClick(event) {
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.helpData = [];
      this.listClass = "hideList";
    }

  }
}
