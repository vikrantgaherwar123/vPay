import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from "@angular/core";

@Component({
  selector: "textbox",
  styleUrls: ["./textbox.scss"],
  templateUrl: "./textbox.html"
})
export class Textbox {
  @Input() eid: string = '';
  @Input() txtVal: string = '';
  @Input() dataType: string = '';
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() captionLabel: string = '';
  @Input() minLength: number = 0;
  @Input() maxLength: number = 0;
  @Output() getInputData = new EventEmitter();

  public focusEventEmitter = new EventEmitter<boolean>();

  public txtClass: string = "";
  public labelName: string = "";
  public labelValName: string = "";
  public labelFadeClass: string = "";
  //public errorMessage: string = "";
  public showError: boolean = false;
  constructor(public elementRef: ElementRef, private rendrer2: Renderer2) {
    // this.ClearData();
    // this.Load_InitialData();
  }
  ngOnInit() {
  
    this.labelName = "lbl" + this.eid;
    this.labelValName = "lblVal" + this.eid;
    if (this.dataType === 'panno')
      this.txtClass = "inputCtlClass";
  }
  cancelEvent(e) { var k = window.event ? e.keyCode : e.which; if (k != 16) { if (window.event) { e.cancelBubble = true; e.returnValue = false; e.keyCode = 555; } else { e.stopPropagation(); e.preventDefault(); } } return false; }
  setFocus(){
    setTimeout(() => {
      this.rendrer2.selectRootElement('#'+this.eid).focus();
    }, 500);
    
  }

  format(){
    if (this.txtVal.trim().length>0){
      switch (this.dataType) {
        //case 'password': let f = /^([A-Z a-z]{5})+([0-9]{4})+([A-Z a-z]{1})$/; if (this.txtVal.trim().length !== 10 || !(this.txtVal.match(f))) { alert("PAN must have 10 character. And Formate should be ABCDE1234F."); this.txtVal = '';this.setFocus();  return false; } else return true;
        case 'panno': let f = /^([A-Z a-z]{5})+([0-9]{4})+([A-Z a-z]{1})$/; if (this.txtVal.trim().length !== 10 || !(this.txtVal.match(f))) { alert("PAN must have 10 character. And Formate should be ABCDE1234F."); this.txtVal = '';this.setFocus();  return false; } ;
        case 'email': let c = "[-!$%^&*()>]"; var b = new RegExp(c, "g"); this.txtVal = this.txtVal.replace(b, ""); let emailpat = /^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9])+(\.[a-zA-Z0-9_-]+)+$/; if (!emailpat.test(this.txtVal)) { alert("Enter Valid E-Mail Id."); this.txtVal = ''; this.setFocus(); return false; } 
        default: break;
      }
      this.getInputData.emit(this.txtVal);
    }
    return true;
  }

  onBlur() {
    //** when txtVal has not assigned any value by parent page  */
    if(this.txtVal===undefined) this.txtVal="";
    
    //**  */
    if(this.txtVal.trim().length === 0) this.labelFadeClass = "";
    
    //** check required field */
    if (this.required && this.txtVal.trim().length === 0) { this.showError=true;return false;} else {this.showError=false;} // this.setFocus();
    
    //** check minimum length */
    if (this.txtVal.trim().length!==0 && this.minLength>0 && this.txtVal.trim().length<this.minLength){
      if(this.dataType==='number') alert(this.captionLabel+" should not be less than "+this.minLength+ " digits."); 
      if(this.dataType==='char') alert(this.captionLabel+" should not be less than "+this.minLength+ " character.");

      this.txtVal=''; this.setFocus();  return false;
    } 
    if (this.maxLength>0 && this.txtVal.trim().length>this.maxLength){alert(this.captionLabel+" should not be greater than " +this.maxLength + " digit."); this.setFocus(); return false;} //
    return this.format();
  }
  onFocus(){
    this.labelFadeClass = "fadeLabel";
  }
  onKeyDown(event) {
    
    if (event.key === 'Delete' || event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Enter' || event.key === 'Tab') return true;

    switch (this.dataType) {
      case 'number': if (parseInt(event.key) >= 0 && parseInt(event.key) <= 9) return true; else return false;
      case 'char': if (event.key.match(/^([A-Z a-z])$/)) return true; else return false;
      case 'title': if (event.key.match(/^([A-Z a-z])$/)|| event.key===' ') return true; else return false;
      case 'alphaNumeric': if (event.key.match(/^([A-Z a-z])$/)|| event.key.match(/^([0-9])$/)) return true; else return false;
      case 'varchar': if (event.key === '>' || event.key === '<') return false; else return true;
      case 'panno': if (event.key !== ' ' && event.key.match(/^([A-Z a-z])$/) || event.key.match(/^([0-9])$/)) { return true; } else return false;
      case 'password': if (event.key === '>' || event.key === '<') return false; else return true;
      default: return false; 
    }
  }
}


