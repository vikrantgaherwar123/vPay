import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from 'angular2-chartjs';
import { AboutComponent } from './about/about.component';
import { HowToUseComponent } from './howToUse/howToUse.component';
import { OurTeamComponent } from './ourTeam/ourTeam.component';
import { WhyUsComponent } from './whyUs/whyUs.component';
import { MaterialModule } from './../material/material.module';
import { DialogBoxComponent } from "../../shared/component/dialogBox/dialogBox.component";
import { ConfirmDialogComponent } from "../../shared/component/confirm-dialog/confirm-dialog.component";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



export const HomeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      breadcrumb: 'Default',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      breadcrumb: 'Default',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }, {
    path: 'about',
    component: AboutComponent,
    data: {
      breadcrumb: 'About',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }, {
    path: 'howItWorks',
    component: HowToUseComponent,
    data: {
      breadcrumb: 'How It Works',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'ourTeam',
    component: OurTeamComponent,
    data: {
      breadcrumb: 'Our Team',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'whyUs',
    component: WhyUsComponent,
    data: {
      breadcrumb: 'Why Us',
      // icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes),
    SharedModule,
    ChartModule, MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  entryComponents: [DialogBoxComponent, ConfirmDialogComponent],
  providers: [],
  declarations: [HomeComponent, AboutComponent, ConfirmDialogComponent, DialogBoxComponent, HowToUseComponent, OurTeamComponent, WhyUsComponent]
})
export class HomeModule { }
