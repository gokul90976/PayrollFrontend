import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SharedModule } from './shared-module/shared.module';
import { PopupEmpDetComponent } from './all-components/popup-emp-det/popup-emp-det.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProfessionalTaxListComponent } from './all-components/professional-tax-list/professional-tax-list.component';
import { IncomeTaxListComponent } from './all-components/income-tax-list/income-tax-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonfieldsComponent } from './all-components/commonfields/commonfields.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {MatDialogModule} from '@angular/material/dialog';
import { ProfessionalTaxeditComponent } from './all-components/professional-taxedit/professional-taxedit.component';
import { IncometaxEditComponent } from './all-components/incometax-edit/incometax-edit.component';
import { DallowanceEditComponent } from './all-components/dallowance-edit/dallowance-edit.component';
import { EmployeePayrollListComponent } from './all-components/employee-payroll-list/employee-payroll-list.component';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PercentagesComponent } from './all-components/percentages/percentages.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HraListComponent } from './all-components/hra-list/hra-list.component';
import { CcaListComponent } from './all-components/cca-list/cca-list.component';
import { CcaEditComponent } from './all-components/cca-edit/cca-edit.component';
import { HraEditComponent } from './all-components/hra-edit/hra-edit.component';
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DaMonthlysalaryEditComponent } from './all-components/da-monthlysalary-edit/da-monthlysalary-edit.component';
import { PopupDaEditComponent } from './all-components/popup-da-edit/popup-da-edit.component';
import { ArrearFieldsComponent } from './all-components/arrear-fields/arrear-fields.component';
import { DaArrearFieldsComponent } from './all-components/da-arrear-fields/da-arrear-fields.component';
import { DaArrearComponent } from './all-components/da-arrear/da-arrear.component';
import { ConcessionalTableComponent } from './all-components/concessional-table/concessional-table.component';
import { ConcessionalEditComponent } from './all-components/concessional-edit/concessional-edit.component';
import { RecoveryadditionsComponent } from './all-components/recoveryadditions/recoveryadditions.component';
import { ArrearComponent } from './all-components/arrear/arrear.component';
import { PayslipComponent } from './all-components/payslip/payslip.component';
import { ELsurrenderComponent } from './all-components/elsurrender/elsurrender.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig =
{
  "bgsColor": "#162f65",
  "bgsOpacity": 1,
  "bgsPosition": "center-center",
  "bgsSize": 60,
  "bgsType": "fading-circle",
  "blur": 15,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#162f65",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "fading-circle",
  "gap": 10,
  "logoPosition": "center-center",
  "logoSize": 200,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgb(255,255,255)",
  "pbColor": "red",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": false,
  "text": "Loading...",
  "textColor": "#000000",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    PopupEmpDetComponent,
    PopupDaEditComponent,
    ProfessionalTaxListComponent,
    ProfessionalTaxeditComponent,
    IncomeTaxListComponent,
    CommonfieldsComponent,
    IncometaxEditComponent,
    DallowanceEditComponent,
    EmployeePayrollListComponent,
    RecoveryadditionsComponent,
    ArrearComponent,
    PercentagesComponent,
    HraListComponent,
    CcaListComponent,
    CcaEditComponent,
    HraEditComponent,
    ArrearFieldsComponent,
    DaArrearFieldsComponent,
    DaArrearComponent,
    ConcessionalTableComponent,
    ConcessionalEditComponent,
    PayslipComponent,
    // DaArrearComponent,
    ELsurrenderComponent
    // ArrearComponent,
    
    // NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgMultiSelectDropDownModule.forRoot(),
    NgxUiLoaderRouterModule,NgxUiLoaderHttpModule,
    HttpClientModule,
    SharedModule,
    NgxPaginationModule,
    DropDownsModule,
    InputsModule,
    LabelModule,
    MatDialogModule,
    MatSelectModule,
    NgxSpinnerModule, 
    MatTooltipModule,
    BrowserModule, 
        MatDatepickerModule, 
        MatNativeDateModule, 
        MatInputModule, 
        MatFormFieldModule, 
        BrowserAnimationsModule ,
    ToastrModule.forRoot({
      // timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
