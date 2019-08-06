import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetThumbDeviceComponent } from './setThumbDevice.component';

describe('SetThumbDeviceComponent', () => {
  let component: SetThumbDeviceComponent;
  let fixture: ComponentFixture<SetThumbDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetThumbDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetThumbDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
