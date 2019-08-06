import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { InsuranceComponent } from './insurance.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';

//import {SpinnerComponent} from '../../shared/spinner/spinner.component';


export const InsuranceRoutes: Routes = [
  {
    path: '',
    component: InsuranceComponent,
    data: {
      breadcrumb: 'Insurance',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },

  {
    path: 'detailsInfo',
    component: InsuranceDetailsComponent,
    data: {
      breadcrumb: 'detailsInfo',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },

  {path: 'confirmDetails', component: ConfirmDetailsComponent},

  

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InsuranceRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    InputTypeModule
  ],
  declarations: [InsuranceComponent, InsuranceDetailsComponent, ConfirmDetailsComponent]
})
export class InsuranceModule { 


 
}
