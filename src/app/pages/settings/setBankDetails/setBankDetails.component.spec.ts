import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBankDetailsComponent } from './setBankDetails.component';

describe('SetThumbDeviceComponent', () => {
  let component: SetBankDetailsComponent;
  let fixture: ComponentFixture<SetBankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
