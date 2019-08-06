import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';
//import { NotificationsService } from 'angular2-notifications';
import { Toast } from '../../../services/toast';
import * as $ from 'jquery';
@Directive({
    selector: '[inputType]'
})
export class InputTypeDirective implements AfterViewInit {

    regexOnlyNumStr = '^[0-9]*$';
    regexDecimalStr1 = '^[0-9.]*$';
    regexDecimalStr = '^[0-9]\\d*(\\.\\d+)?$';
    regexAlphaNumStr = '[^><]*$';
    regexCharStr = '^[A-Za-z ]*$';
    regexMobNoStr = '^[0-9]*$';
    regexPassword = "^(?=.*[!a-z])(?=.*[!@#$%^&*_)(=:;?+-])(?=.*[!0-9])(?=.*[!A-Z]).{6,15}$";
    regexPanNo = '^([A-Z a-z]{5})+([0-9]{4})+([A-Z a-z]{1})$';
    regexeMail = '^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9])+(\.[a-zA-Z0-9_-]+)+$';
    regexVPA = '^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9])+$';
    errorMsg = {
        title: 'Error',
        msg: '',
        showClose: true,
        timeout: 1000,
        theme: 'bootstrap',
        type: 'error',
        position: 'center-center',
        closeOther: true
    }
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete', 'ArrowLeft', 'ArrowRight', 'Shift'];
    constructor(private el: ElementRef, private toast: Toast) { }
    ngAfterViewInit() {
        let elm = this.el.nativeElement;
        switch (this.inputType) {
            case 'panNo': $(elm).addClass('upperCase');
                break;

            default:
                break;
        }
    }

    @Input() inputType: string;

    /**
     * It is used for preventing wrong key entry.
     * @param event 
     */
    @HostListener('keydown', ['$event']) onKeyDown(event) {

        let e = <KeyboardEvent>event;

        if (event.key == 'Control') {
            event.preventDefault();
        }
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        switch (this.inputType) {
            case "number":
                this.onlyNumbers(e);
                break;
            case "decimal":
                this.decimal(e);
                break;
            case "char":
                this.onlyCharacters(e);
                break;
            case "alphaNumeric":
                this.alphaNumeric(e);
                break;
            case "mobileNo":
                this.mobileNo(e);
                break;
            default:
                break;
        }
    }
    /**
     * It is used for adding has-error, has-success classes and enable, disable attribute by pageValid class
     * @param event 
     */
    @HostListener('keyup', ['$event']) onKeyUp(event) {
        let e = <KeyboardEvent>event;
        if (event.key == 'Control') {
            event.preventDefault();
        }

        let elm = this.el.nativeElement;
        let formGroupElm = this.el.nativeElement.parentElement;



        /**
         * check min length and notify
         */
        if (elm.value && elm.minLength > -1 && elm.value.trim().length > 0) {
            if (elm.minLength > elm.value.trim().length) {
                if (this.inputType === 'number' || this.inputType === 'mobileNo') {
                    this.errorMsg.msg = (elm.title.trim().length > 0 ? elm.title.trim() : "This field") + " can not be less than " + elm.minLength + " digits.";
                    this.toast.addToast(this.errorMsg);
                    $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                }
                else {
                    this.errorMsg.msg = (elm.title.trim().length > 0 ? elm.title.trim() : "This field") + " can not be less than " + elm.minLength + " character.";
                    this.toast.addToast(this.errorMsg);
                    $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                }
            }
            else
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
        }


        /**
         * check mobileNo length
         */
        // if (this.inputType === 'mobileNo' && elm.value && elm.value.trim().length !== 10) {
        //     this.notificationService.error((elm.title.trim().length > 0 ? elm.title.trim() : "This field") + " can not be less than 10 digits.");
        //     $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
        //     //return;
        // }
        // else if (this.inputType === 'mobileNo' && elm.value && elm.value.trim().length === 10) {
        //     $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
        // }


        switch (this.inputType) {
            case "number": this.checkNumber(e); break;
            case "decimal": this.checkDecimal(e); break;
            case "char": this.checkChar(e); break;
            case "password": this.password(e); break;
            case "confirmPassword": this.confirmPassword(e); break;
            case 'panNo': this.panNo(e); break;
            case 'eMail': this.eMail(e); break;
            case 'vpa': this.vpa(e); break;
            case 'alphaNumeric': if (elm.required && elm.value.trim().length > 0 && elm.minLength == -1) {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
            }; break;
            default:
                break;
        }



        /**
         * Add class has-success or has-error on ng-invalid basis
         */
        if (elm.className && (elm.className.indexOf('ng-invalid') > -1 || $(formGroupElm).hasClass('has-error'))) {    //
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
        }
        /**
         * Enable, disable attribute by pageValid class
         */
        let pageValid = $('.pageValid').filter(':visible');


        // pageValid.each(()=>{
        //     if($('.'+$(this).attr('id')+' .has-error').filter(':visible').length>0 || $('.'+$(this).attr('id')+' .ng-invalid').filter(':visible').length>0)
        //         $(this).attr('disabled', 'disabled');
        //     else
        //         $(this).removeAttr('disabled');
        // })
        let i = 0;
        for (i; i < pageValid.length; i++) {
            if ($('.' + $(pageValid[i]).attr('id') + ' .has-error').filter(':visible').length > 0 || $('.' + $(pageValid[i]).attr('id') + ' .ng-invalid').filter(':visible').length > 0)
                $(pageValid[i]).attr('disabled', 'disabled');
            else
                $(pageValid[i]).removeAttr('disabled');
        }



        // if ($('.has-error').length > 0 || $('.ng-invalid').filter(':visible').length > 0)
        //     pageValid.attr('disabled', 'disabled');
        // else
        //     pageValid.removeAttr('disabled');

        // $('input,textarea,select').attr('required', 'true').filter(':visible').each(function (i, requiredField) {
        //     if ($(requiredField).val() == '') {
        //         pageValid.attr('disabled', 'disabled');
        //     }
        // });


    }

    @HostListener('blur', ['$event']) onBlur(event) {

        let e = <KeyboardEvent>event;
        let elm = this.el.nativeElement;
        let formGroupElm = this.el.nativeElement.parentElement;
        // if (elm.required && elm.value && elm.value.trim().length === 0) {
        //     this.notificationService.error(elm.title.trim().length > 0 ? elm.title.trim() : "This field" + " should not be empty.");
        //     $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
        //     return;
        // }
        // /**
        //  * check min length 
        //  */
        // if (elm.value && elm.minLength > -1 && elm.value.trim().length > 0) {
        //     if (elm.minLength > elm.value.trim().length) {
        //         if (this.inputType === 'number')
        //             this.notificationService.error(elm.title.trim().length > 0 ? elm.title.trim() : "This field" + " can not be less than " + elm.minLength + " digits.");
        //         else
        //             this.notificationService.error(elm.title.trim().length > 0 ? elm.title.trim() : "This field" + " can not be less than " + elm.minLength + " character.");
        //         $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
        //         return;
        //     }
        //     /**
        //      * check mobileNo lemgth
        //      */
        //     if (this.inputType === 'mobileNo' && elm.value && elm.value.trim().length !== 10) {
        //         this.notificationService.error(elm.title.trim().length > 0 ? elm.title.trim() : "This field" + " can not be less than 10 digits.");
        //         $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
        //         return;
        //     }
        // }
        setTimeout(() => {
        if (elm.value && elm.minLength > -1 && elm.value.trim().length > 0) {
            if (elm.maxLength == elm.value.trim().length) {
                   if (this.inputType === 'number' || this.inputType === 'mobileNo') {
                        $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
                    }
                    else {
                        // this.errorMsg.msg = (elm.title.trim().length > 0 ? elm.title.trim() : "This field") + " can not be less than " + elm.minLength + " character.";
                        // this.toast.addToast(this.errorMsg);
                        // $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                    }
                
            }
        }

        if(this.inputType == "confirmPassword"){
            let formGroupElm = this.el.nativeElement.parentElement;
            //TextBox value
            let confirmPass = this.el.nativeElement.value;
            let password = $($(formGroupElm).prev().children()[0]).val();
    
            if (password === confirmPass) {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
            }
            else {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                this.errorMsg.msg = "Password not match.";
                this.toast.addToast(this.errorMsg);
                //    this.notificationService.error("Password not match.");
                event.preventDefault();
            }

        }
        if(this.inputType == "eMail"){
            this.eMail(event);
        }

        /**
         * Add class has-success or has-error on ng-invalid basis
         */
        if (elm.className && (elm.className.indexOf('ng-invalid') > -1 || $(formGroupElm).hasClass('has-error'))) {
            if (this.inputType != 'number')
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
        }




        /**
         * Enable, disable attribute by pageValid class
         */
        let pageValid = $('.pageValid').filter(':visible');
        let i = 0;
        for (i; i < pageValid.length; i++) {
            if ($('.' + $(pageValid[i]).attr('id') + ' .has-error').filter(':visible').length > 0 || $('.' + $(pageValid[i]).attr('id') + ' .ng-invalid').filter(':visible').length > 0)
                $(pageValid[i]).attr('disabled', 'disabled');
            else
                $(pageValid[i]).removeAttr('disabled');
        }




    }, 100);

    }

    onlyNumbers(event) {
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        let current: string = this.el.nativeElement.value;
        // We need this because the current value on the DOM element
        // is not yet updated with the value from this event
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regexOnlyNumStr)) {
            event.preventDefault();
        }
    }
    decimal(event) {
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        let current: string = this.el.nativeElement.value;
        // We need this because the current value on the DOM element
        // is not yet updated with the value from this event
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regexDecimalStr1) || next.split('.').length > 2) {
            event.preventDefault();
        }
    }
    onlyCharacters(event) {
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        let current: string = this.el.nativeElement.value;
        // We need this because the current value on the DOM element
        // is not yet updated with the value from this event
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regexCharStr)) {
            event.preventDefault();
        }
    }
    alphaNumeric(event) {
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        let current: string = this.el.nativeElement.value;
        // We need this because the current value on the DOM element
        // is not yet updated with the value from this event
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regexAlphaNumStr)) {
            event.preventDefault();
        }
    }

    vpa(event) {
        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox value
        let current: string = this.el.nativeElement.value;
        if (current && String(current).match(this.regexVPA)) {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
            this.errorMsg.msg = "Enter Valid VPA Id.";
            this.toast.addToast(this.errorMsg);
            event.preventDefault();
        }
    }

    mobileNo(event) {
        this.el.nativeElement.maxLength = 10;
        this.el.nativeElement.minLength = 10;
        let current: string = this.el.nativeElement.value;
        if (current.length === 10) event.preventDefault();
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regexMobNoStr)) {
            event.preventDefault();
        }
    }
    password(event) {
        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox value
        let current: string = this.el.nativeElement.value;
        //show password validation
        if($('.passwordValidator')){
            $('.passwordValidator').removeClass('show').removeClass('hide').addClass('show');
            let $passWValElms = $('.passwordValidator').children().children();
            $passWValElms[0].className =  (current && String(current).match(/[a-z]/))?'success':'error';
            $passWValElms[1].className =  (current && String(current).match(/[A-Z]/))?'success':'error';
            $passWValElms[2].className =  (current && String(current).match(/[0-9]/))?'success':'error';
            $passWValElms[3].className =  (current && String(current).match(/[!@#$%^&*)(_=:;?+-]/))?'success':'error';
            $passWValElms[4].className =  (current.trim().length>=6)?'success':'error';
        }
        
        if (current && String(current).match(this.regexPassword)) {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');

        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
            this.errorMsg.msg = "Minimum Six Characters, At Least One Uppercase Letter,<br/> One Lowercase Letter, One Number And One Special Character.";
            this.toast.addToast(this.errorMsg);
            // this.notificationService.error("Minimum Six Characters, At Least One Uppercase Letter, One Lowercase Letter, One Number And One Special Character.");
            event.preventDefault();
        }
    }
    confirmPassword(e) {
        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox value
        let confirmPass = this.el.nativeElement.value;
        let password = $($(formGroupElm).prev().children()[0]).val();

        if (password === confirmPass) {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
            this.errorMsg.msg = "Password not match.";
            this.toast.addToast(this.errorMsg);
            //    this.notificationService.error("Password not match.");
            event.preventDefault();
        }
    }
    panNo(event) {
        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox 
        let elm = this.el.nativeElement;
        if (elm.required || (elm.value && elm.value.trim().length > 0)) {
            if (elm.value && String(elm.value).match(this.regexPanNo)) {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
            }
            else {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                this.errorMsg.msg = "PAN must have 10 character. And Formate should be ABCDE1234F.";
                this.toast.addToast(this.errorMsg);
                event.preventDefault();
            }
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error');
        }
    }
    eMail(event) {
        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox value
        let current: string = this.el.nativeElement.value;
        if (this.el.nativeElement.required || (this.el.nativeElement.value && this.el.nativeElement.value.trim().length > 0)) {
            if(current && String(current).match(this.regexeMail)) {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
            }
            else {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                this.errorMsg.msg = "Enter Valid E-Mail Id.";
                this.toast.addToast(this.errorMsg);
                event.preventDefault();
            }
        }
        else{
             $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
        }
    }


    checkNumber(e) {
        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox 
        let elm = this.el.nativeElement;
        if (elm.required || (elm.val && elm.value.trim().length > 0)) {
            if (elm.value && String(elm.value).match(this.regexOnlyNumStr)) {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
            }
            else {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                // this.errorMsg.msg ="Aadhar must have 12 Numbers.";
                // this.toast.addToast(this.errorMsg);
                //  this.notificationService.error("Aadhar must have 12 Numbers.");
                event.preventDefault();
            }
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error');
        }
    }
    checkDecimal(e) {
        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox 
        let elm = this.el.nativeElement;
        if (elm.required || (elm.val && elm.value.trim().length > 0)) {
            if (elm.value && String(elm.value).match(this.regexDecimalStr)) {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
            }
            else {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                // this.errorMsg.msg ="Aadhar must have 12 Numbers.";
                // this.toast.addToast(this.errorMsg);
                //  this.notificationService.error("Aadhar must have 12 Numbers.");
                event.preventDefault();
            }
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error');
        }
    }
    checkChar(e) {

        //find form group element div
        let formGroupElm = this.el.nativeElement.parentElement;
        //TextBox 
        let elm = this.el.nativeElement;
        if (elm.required || (elm.val && elm.value.trim().length > 0)) {
            if (elm.value && String(elm.value).match(this.regexCharStr)) {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-success');
            }
            else {
                $(formGroupElm).removeClass('has-success').removeClass('has-error').addClass('has-error');
                //this.notificationService.error("PAN must have 10 character. And Formate should be ABCDE1234F.");
                event.preventDefault();
            }
        }
        else {
            $(formGroupElm).removeClass('has-success').removeClass('has-error');
        }
    }

}
