import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { ProfessionalTaxListComponent } from '../../all-components/professional-tax-list/professional-tax-list.component';
import { IncomeTaxListComponent } from '../../all-components/income-tax-list/income-tax-list.component';
import { CommonfieldsComponent } from '../../all-components/commonfields/commonfields.component';
import { DallowanceComponent } from '../../all-components/dallowance/dallowance.component';
import { ProfessionalTaxeditComponent } from '../../all-components/professional-taxedit/professional-taxedit.component';
import { IncometaxEditComponent } from '../../all-components/incometax-edit/incometax-edit.component';
import { DallowanceEditComponent } from '../../all-components/dallowance-edit/dallowance-edit.component';
import { PercentagesComponent } from '../../all-components/percentages/percentages.component';
import { HraListComponent } from '../../all-components/hra-list/hra-list.component';
import { CcaListComponent } from '../../all-components/cca-list/cca-list.component';
import { CcaEditComponent } from '../../all-components/cca-edit/cca-edit.component';
import { HraEditComponent } from '../../all-components/hra-edit/hra-edit.component';
import { DaMonthlysalaryEditComponent } from '../../all-components/da-monthlysalary-edit/da-monthlysalary-edit.component';
import { ArrearComponent } from '../../all-components/arrear/arrear.component';
import { ArrearFieldsComponent } from '../../all-components/arrear-fields/arrear-fields.component';
import { DaArrearComponent } from '../../all-components/da-arrear/da-arrear.component';
import { ConcessionalTableComponent } from '../../all-components/concessional-table/concessional-table.component';
import { ConcessionalEditComponent } from '../../all-components/concessional-edit/concessional-edit.component';
import { AuthGuard } from '../../service/authguard/auth.guard';
import { SupplementarySalaryComponent } from '../../all-components/supplementary-salary/supplementary-salary.component';
import { ELsurrenderComponent } from '../../all-components/elsurrender/elsurrender.component';
import { PayslipComponent } from '../../all-components/payslip/payslip.component';

const routes: Routes = [
  {
    path: '', component: LayoutNavComponent,
    children: [
      { path: 'employeepayroll', component: EmployeePayrollListComponent, canActivate: [AuthGuard] },
      { path: 'newemployeepayroll', component: NewEmployeePayrollComponent, canActivate: [AuthGuard] },
      { path: 'newemployeepayroll/save/:id', component: NewEmployeePayrollComponent, canActivate: [AuthGuard] },
      { path: 'newemployeepayroll/edit/:id', component: NewEmployeePayrollComponent, canActivate: [AuthGuard] },
      { path: 'newemployeepayroll/view/:id', component: NewEmployeePayrollComponent, canActivate: [AuthGuard] },
      { path: 'taxcalculation', component: TaxCalculationViewComponent, canActivate: [AuthGuard] },
      { path: 'recoveryaddition', component: RecoveryadditionsComponent, canActivate: [AuthGuard] },
      { path: 'newrecoveryaddition/edit/:id', component: NewRecoveryadditionsComponent, canActivate: [AuthGuard] },
      { path: 'newrecoveryaddition/edit/:id/:empId', component: NewRecoveryadditionsComponent, canActivate: [AuthGuard] },
      { path: 'newrecoveryaddition/view/:id', component: NewRecoveryadditionsComponent, canActivate: [AuthGuard] },
      { path: 'newrecoveryaddition/view/:id/:empId', component: NewRecoveryadditionsComponent, canActivate: [AuthGuard] },
      { path: 'newrecoveryaddition', component: NewRecoveryadditionsComponent, canActivate: [AuthGuard] },
      { path: 'monthlysalary', component: MonthlySalaryComponent, canActivate: [AuthGuard] },
      { path: 'supplementarysalary', component:SupplementarySalaryComponent, canActivate: [AuthGuard] },
      { path: 'newmonthlysalary', component: NewMonthlySalaryComponent, canActivate: [AuthGuard] },
      { path: 'newmonthlysalary/edit/:id', component: NewMonthlySalaryComponent, canActivate: [AuthGuard] },
      { path: 'newmonthlysalary/view/:id', component: NewMonthlySalaryComponent, canActivate: [AuthGuard] },
      { path: 'daMonthlysalaryEdit/view/:id', component: DaMonthlysalaryEditComponent, canActivate: [AuthGuard] },
      { path: 'daMonthlysalaryEdit/edit/:id', component: DaMonthlysalaryEditComponent, canActivate: [AuthGuard] },     //Da Monthly salary 
      { path: 'popupmonthlysalary', component: PopupMonthlySalaryComponent, canActivate: [AuthGuard] },
      { path: 'reports', component: ReportsPageComponent, canActivate: [AuthGuard] },
      { path: 'taxcalculationAdd', component: TaxCalculationsComponent, canActivate: [AuthGuard] },
      { path: 'taxcalculationAdd/:id', component: TaxCalculationsComponent, canActivate: [AuthGuard] },
      { path: 'professionalEdit/:id', component: ProfessionalTaxeditComponent, canActivate: [AuthGuard] },
      { path: 'incomeTaxEdit/:id', component: IncometaxEditComponent, canActivate: [AuthGuard] },
      { path: 'dallowanceEdit/:id', component: DallowanceEditComponent, canActivate: [AuthGuard] },
      { path: 'professionTax', component: ProfessionalTaxListComponent, canActivate: [AuthGuard] },
      { path: 'incomeTax', component: IncomeTaxListComponent, canActivate: [AuthGuard] },
      { path: 'Dallowance', component: DallowanceComponent, canActivate: [AuthGuard] },
      { path: 'commonfields', component: CommonfieldsComponent, canActivate: [AuthGuard] },
      { path: 'percentage', component: PercentagesComponent, canActivate: [AuthGuard] },
      { path: 'hraList', component: HraListComponent, canActivate: [AuthGuard] },
      { path: 'hraEdit/:id', component: HraEditComponent, canActivate: [AuthGuard] },
      { path: 'ccaList', component: CcaListComponent, canActivate: [AuthGuard] },
      { path: 'ccaEdit/:id', component: CcaEditComponent, canActivate: [AuthGuard] },
      { path: 'payArrear', component: ArrearComponent, canActivate: [AuthGuard] },
      { path: 'arrearFields', component: ArrearFieldsComponent, canActivate: [AuthGuard] },
      { path: 'arrearFields/:id', component: ArrearFieldsComponent, canActivate: [AuthGuard] },
      { path: 'daArrear', component: DaArrearComponent, canActivate: [AuthGuard] },
      { path: 'concessional', component: ConcessionalTableComponent, canActivate: [AuthGuard] },
      { path: 'concessionalEdit/:id', component: ConcessionalEditComponent, canActivate: [AuthGuard] },
      { path: 'elSurrender', component: ELsurrenderComponent, canActivate: [AuthGuard] },
      { path: 'payslip', component: PayslipComponent, canActivate: [AuthGuard] },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
