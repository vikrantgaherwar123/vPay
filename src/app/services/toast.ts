import {Injectable} from '@angular/core';
import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';
@Injectable()
export class Toast {

  position ;
  title: string;
  msg: string;
  showClose ;
  timeout ;
  theme ;
  type ;
  closeOther;

  constructor(private toastyService: ToastyService) {
    this.position = 'top-center';
    this.showClose = true;
    this.timeout = 5000;
    this.theme = 'bootstrap';
    this.type = 'default';
    this.closeOther = false;
  }

  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: (options.title==null || options.title==undefined)?"Error":options.title,
      msg: options.msg,
      showClose: (options.showClose==null || options.showClose==undefined)?this.showClose:options.showClose,
      timeout: (options.timeout==null || options.timeout==undefined)?this.timeout:options.timeout,
      theme: (options.theme==null || options.theme==undefined)?this.theme:options.theme,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }
}
