// import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

// import { Observable, Subscription } from 'rxjs/Rx';
// import 'rxjs/add/observable/fromEvent';
// import 'rxjs/add/operator/pairwise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/exhaustMap';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/startWith';
// interface ScrollPosition {
//   sH: number;
//   sT: number;
//   cH: number;
//   sW: number;
//   sL: number;
// };

// const DEFAULT_SCROLL_POSITION: ScrollPosition = {
//   sH: 0,
//   sT: 0,
//   cH: 0,
//   sW: 0,
//   sL: 0
// };
// @Directive({
//   selector: '[appInfiniteScroller]'
// })
// export class InfiniteScrollerDirective implements AfterViewInit {
//   private scrollEvent$;

//   private userScrolledDown$;

//   private requestStream$;

//   private requestOnScroll$;

//   private scrollDownFlag: Boolean = false;

//   private scrollLeftFlag: Boolean = false;

//   @Input()
//   scrollDownCallback;

//   @Input()
//   scrollLeftCallback;

//   @Input()
//   immediateCallback;

//   @Input()
//   scrollPercent = 70;

//   constructor(private elm: ElementRef) { }

//   ngAfterViewInit() {

//     this.registerScrollEvent();

//     this.streamScrollEvents();

//     this.requestCallbackOnScroll();

//   }

//   private registerScrollEvent() {

//     this.scrollEvent$ = Observable.fromEvent(this.elm.nativeElement, 'scroll');

//   }

//   private streamScrollEvents() {
//     this.userScrolledDown$ = this.scrollEvent$
//       .map((e: any): ScrollPosition => ({
//         sH: e.target.scrollHeight,
//         sT: e.target.scrollTop,
//         cH: e.target.clientHeight,
//         sW: e.target.scrollWidth,
//         sL: e.target.scrollLeft
//       }))
//       .pairwise()
//       .filter(positions => {
//         (this.isUserScrollingDown(positions) && this.isScrollExpectedPercent(positions[1]))
//           || (this.isUserScrollingLeft(positions) && this.isScrollExpectedPercent(positions[1]))
//       })
//   }

//   private requestCallbackOnScroll() {

//     this.requestOnScroll$ = this.userScrolledDown$;

//     if (this.immediateCallback) {
//       this.requestOnScroll$ = this.requestOnScroll$
//         .startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]);
//     }

//     this.requestOnScroll$
//       .exhaustMap(() => {
//         //if (this.scrollDownFlag)
//           return this.scrollDownCallback();
//         //else 
//         //  return this.scrollLeftCallback();
//         // else
//         //   return new Promise(resolve => {resolve();});
//       })
//       .subscribe(() => { });

//   }

//   private isUserScrollingDown = (positions) => {
//     this.scrollDownFlag = positions[0].sT < positions[1].sT ? true : false;
//     return this.scrollDownFlag;
//   }

//   private isUserScrollingLeft = (positions) => {
//     this.scrollLeftFlag = positions[0].sL < positions[1].sL ? true : false;
//     return this.scrollLeftFlag;
//   }

//   private isScrollExpectedPercent = (position) => {
//     return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
//   }

// }



import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
  sW: number;
  sL: number;
};

const DEFAULT_SCROLL_POSITION: ScrollPosition = {
  sH: 0,
  sT: 0,
  cH: 0,
  sW: 0,
  sL: 0
};
@Directive({
  selector: '[appInfiniteScroller]'
})
export class InfiniteScrollerDirective implements AfterViewInit {
  private scrollEvent$;

  private userScrolledDown$;

  private requestStream$;

  private requestOnScroll$;

  private scrollDownFlag: Boolean = false;

  private scrollLeftFlag: Boolean = false;

  @Input()
  scrollDownCallback;

  @Input()
  scrollLeftCallback;

  @Input()
  immediateCallback;

  @Input()
  scrollPercent = 70;

  constructor(private elm: ElementRef) { }

  ngAfterViewInit() {

    this.registerScrollEvent();

    this.streamScrollEvents();

    this.requestCallbackOnScroll();

  }

  private registerScrollEvent() {

    this.scrollEvent$ = Observable.fromEvent(this.elm.nativeElement, 'scroll');

  }

  private streamScrollEvents() {
    this.userScrolledDown$ = this.scrollEvent$
      .map((e: any): ScrollPosition => ({
        sH: e.target.scrollHeight,
        sT: e.target.scrollTop,
        cH: e.target.clientHeight,
        sW: e.target.scrollWidth,
        sL: e.target.scrollLeft
      }))
      .pairwise()
      .filter(positions => (this.isUserScrollingDown(positions) && this.isScrollExpectedPercent(positions[1])) || (this.isUserScrollingLeft(positions) && this.isScrollExpectedPercent(positions[1])))
  }

  private requestCallbackOnScroll() {

    this.requestOnScroll$ = this.userScrolledDown$;

    if (this.immediateCallback) {
      this.requestOnScroll$ = this.requestOnScroll$
        .startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]);
    }

    this.requestOnScroll$
      .exhaustMap(() => {
        if (this.scrollDownFlag)
          return this.scrollDownCallback();
        else if(this.scrollLeftFlag) 
         return this.scrollLeftCallback(this.elm.nativeElement.className);
        else
          return new Promise(resolve => {resolve();});
       // return this.scrollDownCallback();
      })
      .subscribe(() => { });

  }

  private isUserScrollingDown = (positions) => {
    this.scrollDownFlag = positions[0].sT < positions[1].sT ? true : false;
    return positions[0].sT < positions[1].sT;
  }

  private isUserScrollingLeft = (positions) => {
    this.scrollLeftFlag = positions[0].sL < positions[1].sL ? true : false;
    return this.scrollLeftFlag;
  }

  private isScrollExpectedPercent = (position) => {
    return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
  }

}

