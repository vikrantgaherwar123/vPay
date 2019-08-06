import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtpModule } from '../../shared/component/dtp/dtp.module';
import { HelpModule } from '../../shared/component/help/help.module';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';
import { MasterComponent } from './master.component';
import { MaterialModule } from '../material/material.module';
import { InstitutionSubMasterComponent } from "./institutesubmaster/institutesubmaster.component";
import { InstitutionUserMasterComponent } from "./institutionUserMaster/institutionUserMaster.component";

export const MasterRoutes: Routes = [
    {
        path: '',
        component: MasterComponent,
        data: {
            breadcrumb: 'master',
            icon: '../../../assets/images/institution.jpg',
            status: false
        }
    },
    {
        path: 'institutionUserMaster',
        component: InstitutionUserMasterComponent,
        data: {
            breadcrumb: 'Institute User Master',
            icon: '../../../assets/images/institution.jpg',
            status: true
        }
    },
    {
        path: 'institutesubmaster',
        component: InstitutionSubMasterComponent,
        data: {
            breadcrumb: 'Institute Sub Master',
            icon: '../../../assets/images/institution.jpg',
            status: true
        }
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MasterRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        DtpModule, HelpModule, InputTypeModule
    ],
    declarations: [
        MasterComponent,
        InstitutionUserMasterComponent,
        InstitutionSubMasterComponent,
    ]
})
export class MasterModule { }
