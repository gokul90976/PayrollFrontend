import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeePayrollListComponent } from '../../all-components/employee-payroll-list/employee-payroll-list.component';
import { MonthlySalaryComponent } from '../../all-components/monthly-salary/monthly-salary.component';
import { NewEmployeePayrollComponent } from '../../all-components/new-employee-payroll/new-employee-payroll.component';
import { NewMonthlySalaryComponent } from '../../all-components/new-monthly-salary/new-monthly-salary.component';
import { NewRecoveryadditionsComponent } from '../../all-components/new-recoveryadditions/new-recoveryadditions.component';
import { PopupMonthlySalaryComponent } from '../../all-components/popup-monthly-salary/popup-monthly-salary.component';
import { RecoveryadditionsComponent } from '../../all-components/recoveryadditions/recoveryadditions.component';
import { ReportsPageComponent } from '../../all-components/reports-page/reports-page.component';
import { TaxCalculationViewComponent } from '../../all-components/tax-calculations/tax-calculation-view/tax-calculation-view.component';
import { TaxCalculationsComponent } from '../../all-components/tax-calculations/tax-calculations.component';
import { LayoutNavComponent } from '../../pages/layout-nav/layout-nav.component';
import { MaterialModule } from '../../shared/material/material.module';
import { PayrollRoutingModule } from './payroll-routing.module';
import { DallowanceComponent } from '../../all-components/dallowance/dallowance.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { DaMonthlysalaryEditComponent } from '../../all-components/da-monthlysalary-edit/da-monthlysalary-edit.component';
import { ArrearComponent } from '../../all-components/arrear/arrear.component';
import { SupplementarySalaryComponent } from '../../all-components/supplementary-salary/supplementary-salary.component';
import { ELsurrenderComponent } from '../../all-components/elsurrender/elsurrender.component';




@NgModule({
  declarations: [
    LayoutNavComponent,
    NewEmployeePayrollComponent,
    TaxCalculationsComponent,
    // RecoveryadditionsComponent,
    NewRecoveryadditionsComponent,
    NewMonthlySalaryComponent,
    SupplementarySalaryComponent,
    // ArrearComponent,
    MonthlySalaryComponent,
    PopupMonthlySalaryComponent,
    ReportsPageComponent,
    TaxCalculationViewComponent,
    DallowanceComponent,
    DaMonthlysalaryEditComponent,
    // PayslipComponent
    // ELsurrenderComponent
  ],
  imports:[
    CommonModule,
    PayrollRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

})
export class PayrollModule { }
