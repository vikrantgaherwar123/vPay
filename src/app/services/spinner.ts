import {Injectable} from '@angular/core';

@Injectable()
export class Spinner {

  private _selector:string = 'http-loader';
  //private _selector1:string = 'innerLoader';
  private _element:HTMLElement;
  private _element1:HTMLElement;

  constructor() {
    this._element = document.getElementById(this._selector)
    //this._element1 = document.getElementById(this._selector1);
  }

  public show():void {
    this._element.className = 'show'; //  style['display'] = 'block';
    //this._element1.style['display'] = 'block';
  }

  public hide(delay:number = 0):void {
    setTimeout(() => {
      this._element.className ='hide';  //style['display'] = 'none';
      //this._element1.style['display'] = 'none';
    }, delay);
  }
}