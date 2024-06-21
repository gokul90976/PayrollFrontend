import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';

@Component({
  selector: 'app-elsurrender',
  templateUrl: './elsurrender.component.html',
  styleUrl: './elsurrender.component.css'
})

export class ELsurrenderComponent implements OnInit {
  allEmployeeDataSource!: MatTableDataSource<any>;
  filteredDataSource!: MatTableDataSource<any>;
  allEmployeeData!: MatTableDataSource<any>;
  payRollDet : any;
  displayedColumns: string[] = ['Sno', 'Empcode', 'Empname', 'designationCode', 'designationName', 'elMonth', 'noOfDays', 'basicPay', 'splPay', 'da', 'hra', 'cca', 'grossTotal'];
  id: any
  voucherNo: any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  payrollData: any;
  combinedArray = [];
  allEmployeePayrollListDataSource: any
  saved: boolean
  personalDatas: any
  originalData: any[] = [];
  selectedOption: string = 'EL Surrender'; // Initially no option is selected
  dropdownOptions: string[] = ['Pay Arrear', 'DA Arrear', 'Monthly Salary', 'Supplementary Salary', 'EL Surrender'];
  formattedDate: string;
  day: string;
  month: string;
  year: string;
  remarksForm: FormGroup
  submit: boolean
  dataLength:any
  currentDate = new Date();
  role: string;
  totalGross:any
  minDate: string;
  maxDate: string;

  months = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 }
  ];


  ngAfterViewInit() {
    // this.allDatas.paginator = this.paginator;
  }

  constructor(private apiCall: ApiService, private router: Router, public dialog: MatDialog, private snackbar: MatSnackBar, private spinner: NgxSpinnerService,private datePipe: DatePipe,private toastr: ToastrService,private fb: FormBuilder) {
    this.filteredDataSource = new MatTableDataSource<any>([]);
    

    this.getEmpList()
    this.apiCall.apiGetCall('next-nid-sequence').subscribe((seqNo: any) => {
      this.voucherNo = seqNo
    })
    const today = new Date();
    this.minDate = this.formatDate(today); 
    this.maxDate = this.formatDate(today);
  }
  ngOnInit(): void {
    let todayDate = this.datePipe.transform(this.currentDate, 'dd-MM-yyyy');
    this.role = sessionStorage.getItem('userName');
    if (this.role === 'DA') {
      // this.buttonType = 'Submit';
      this.remarksForm = this.fb.group({
        remarksforDA: ['', Validators.required],
        signature: ['', Validators.required],
        // bankCode: ['',Validators.required],
        date: new FormControl(todayDate),

      })
      this.submit = true
      // this.approve = false

    } else {
      this.remarksForm = this.fb.group({
        remarks: ['', Validators.required],
        signature: ['', Validators.required],
        bankCode: ['', Validators.required],
        date: ['', Validators.required]
      })
      // this.buttonType = 'Approve';
      // this.approve = true
      this.submit = true
  }
}


formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async getEmpList() {
  // this.spinner.show();
  // const payload = { 'id': 1 }
  // this.apiCall.apiPostCall(payload, 'getAllEmployeePayRoll').subscribe(data => {
  //   this.payrollData = data.data;
  // })
  // await this.apiCall.personel_apiPostCall({ id: 1 }, 'getAllPayRollDetails').subscribe(async response => {
  //   // this.allDatas = response['data'];
  //   this.personalDatas = response['data'];
  //   this.spinner.hide();
  //   const mergedData = this.personalDatas.map(personalItem => {
  //     const correspondingPayrollItem = this.payrollData.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
  //     return {
  //       ...correspondingPayrollItem,
  //       ...personalItem,
  //     };
  //   });
  //   this.allDatas = mergedData
  //   console.log(this.allDatas,"merged data")

  //   this.originalData = mergedData
  //   console.log( this.originalData)
  //   this.originalData.forEach(data => {
  //     data.originalBasicPay = +data.basicPay;
  //     data.originalSpecialPay = data.specialPay;
  //     data.originalDa = data.da;
  //     data.originalHra = data.hra;
  //     data.originalCca = data.cca;
  //   });
  // })


  this.apiCall.getSalariesVary("EmployeeDataBasedOn-paymentStatus",'Yes').subscribe((data:any) => {
    // this.payRollDet = data.data
    this.payRollDet = data
    console.log(this.payRollDet, "merged data")
    this.dataLength = this.payRollDet.length
    console.log(this.dataLength, "dvsvsv");
    this.allEmployeeDataSource = new MatTableDataSource(this.payRollDet);
    this.allEmployeeData = new MatTableDataSource(this.payRollDet);
    this.filteredDataSource = new MatTableDataSource(this.payRollDet); //table data name

    this.originalData = data
    console.log(this.originalData)
    this.originalData.forEach(data => {
      data.originalBasicPay = +data.basicPay;
      data.originalSpecialPay = data.specialPay;
      data.originalDa = data.da;
      data.originalHra = data.hra;
      data.originalCca = data.cca;
    });
    // this.allEmployeeDataSource = new MatTableDataSource(this.payRollDet);
    // this.filteredDataSource = new MatTableDataSource(this.payRollDet);

    // this.allEmployeeData = new MatTableDataSource(this.payRollDet);
    // this.getTotal();
    // this.getTotal_Deduct()
    // this.getTotal_Netpay()
  })
}
selectedMonth : any
onMonthChange(employeepayroll: any,event:any) {
  // this.selectedMonth = event.name

  const year = new Date().getFullYear(); // Use the current year
  const month = employeepayroll.selectedMonth;
  // employeepayroll.daysInMonth = this.getDaysInMonth(year, month);
  employeepayroll.daysInMonth = 30 ;

  const monthName = this.months.find(m => m.value === employeepayroll.selectedMonth);
  console.log(monthName.name,"monthName")
  this.selectedMonth = monthName.name
  return month ? month.name : '';
}
totalNoOfDays:any
calculatePay(employeepayroll: any): void {
  const daysInMonth = employeepayroll.daysInMonth
  employeepayroll.elMonth = this.selectedMonth 

  console.log(employeepayroll, "employeepayroll", daysInMonth,"171");
  this.totalNoOfDays = employeepayroll.noOfDays
  if (employeepayroll.noOfDays && employeepayroll.noOfDays > 0) {
    employeepayroll.basicPay = this.calculateAmount(employeepayroll.originalBasicPay, employeepayroll.noOfDays, daysInMonth);
    employeepayroll.specialPay = this.calculateAmount(employeepayroll.originalSpecialPay, employeepayroll.noOfDays, daysInMonth);
    employeepayroll.da = this.calculateAmount(employeepayroll.originalDa, employeepayroll.noOfDays, daysInMonth);
    employeepayroll.hra = this.calculateAmount(employeepayroll.originalHra, employeepayroll.noOfDays, daysInMonth);
    employeepayroll.cca = this.calculateAmount(employeepayroll.originalCca, employeepayroll.noOfDays, daysInMonth);
    console.log(employeepayroll.cca,"cca employee")
    employeepayroll.elBasicPay =  employeepayroll.basicPay
    employeepayroll.elSpecialPay =  employeepayroll.specialPay
    employeepayroll.elDa =  employeepayroll.da
    employeepayroll.elHra =  employeepayroll.hra
    employeepayroll.elCca =  employeepayroll.cca

  } else {
    // Reset to original amounts if noOfDays is empty or zero
    employeepayroll.basicPay = employeepayroll.originalBasicPay;
    employeepayroll.specialPay = employeepayroll.originalSpecialPay;
    employeepayroll.da = employeepayroll.originalDa;
    employeepayroll.hra = employeepayroll.originalHra;
    employeepayroll.cca = employeepayroll.originalCca;
  }
  employeepayroll.grossTotal = employeepayroll.basicPay + employeepayroll.specialPay + employeepayroll.da + employeepayroll.hra + employeepayroll.cca;
  this.totalGross = employeepayroll.grossTotal 
  console.log( this.totalGross,"grosssssssssssss")
  this.getTotal()
}

calculateAmount(originalAmount: number, noOfDays: number, daysInMonth: number): number {
  console.log(originalAmount, noOfDays, daysInMonth);
  // Calculate proportionate pay based on number of days worked in the month
  const amount = (originalAmount * noOfDays) / daysInMonth;
  return parseFloat(amount.toFixed(2));
}

getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

edit(type, id) {
  this.router.navigate(['/payroll/newemployeepayroll/' + type, id]);
}

delete(empValue) {
  const dialog = this.dialog.open(ConfirmDialogComponent, {
    width: '250px',
    data: {
      from: "delete",
    }
  });
  dialog.afterClosed().subscribe(data => {
    if (data) {
      const payload = {
        "id": empValue.nid
      }
      this.apiCall.apiPostCall(payload, 'deleteEmployeePayRollBynId').subscribe(response => {
        if (response.message.includes('Success')) {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: 'Data deleted successfully',
          });
          this.getEmpList();
        }
      })
    }
  })
}
totalEarningtotal: any;

getTotal() {
  console.log(this.filteredDataSource.data, "dfvdfv");
  this.totalEarningtotal = this.filteredDataSource.data
    .map(t => Number(t.grossTotal) || 0)
    .reduce((acc, value) => acc + value, 0);
  console.log(this.totalEarningtotal, "gross");
}

Filtered_EmployeeIds:any

postNewEmployee(type) {
  console.log(this.formattedDate, "finance date")
  if (this.payRollDet && this.formattedDate != undefined) {
  this.spinner.show()

    const empData = {}
    const payload = {
      "voucherNo": this.voucherNo,
      "employeeTableData": this.filteredDataSource.data,
      "remarksforDA": this.remarksForm.controls['remarksforDA'].value,
      "signature": this.remarksForm.controls['signature'].value,
      "date": this.remarksForm.controls['date'].value,
      "statusDA": "Active",
      "statusAO": "Pending",
      "statusDCAO": "",
      "statusFA": "",
      "totalEarning":  this.totalEarningtotal,
      "totalDeductions": 0,
      "netPay": this.totalEarningtotal,
      "finacionalYearDate": this.formattedDate,
      "year": this.year,
      "month": this.month,
      "day": this.day,
      "paymentType": this.selectedOption,
      "ELmonth":this.selectedMonth,
      "noOfDays":this.totalNoOfDays,
      // "ElbasicPay":,
      // "ElSplPay":,
      // "ElDa":,
      // "ElHra":,
      // "ElCca":,


    }
    console.log(payload,"3456789")
    this.apiCall.apiPostCall(payload, 'saveMonthlySalary').subscribe((data:any) => {
      console.log(data, "data")

      console.log(data.data.employeeTableData,"fgbrfg")
      const employeeIds = data.data.employeeTableData.map(employee => employee.id);
      this.Filtered_EmployeeIds = employeeIds
      console.log(this.Filtered_EmployeeIds,"dfbdfbv")

console.log(employeeIds);
      if (data.status) {

        let payload = {
          "id": this.Filtered_EmployeeIds 
        }
        this.apiCall.apiPostCall({"id": this.Filtered_EmployeeIds },"saveAllMonthlySalaryId").subscribe((res:any)=>{
          console.log(res,"res")
          // if(){

          // }else{

          // }
          this.toastr.success(" Details Saved Successfully");
        this.router.navigate(['/payroll/monthlysalary/']);
  this.spinner.hide()
        })
        

      } else {
        // this.router.navigate(['/payroll/monthlysalary/']);
        this.toastr.error("Something Went Wrong");
  this.spinner.hide()

      }
    })
  } else {
    this.toastr.error("Please Choose Date");

  }
}

applyTableDivisionFilter(event) {
  const selectedDivisions: any = event.value;
  if (selectedDivisions && selectedDivisions.length > 0) {
    this.filteredDataSource.data = this.allEmployeeData.data.filter(employee => selectedDivisions.includes(employee.designationName));
  } else {
    // If no options are selected, display all data
    this.filteredDataSource.data = this.allEmployeeDataSource.data;
  }
}

onDateChange(event: any) {
  const selectedDate: Date = event.target.value;
  this.formattedDate = this.datePipe.transform(selectedDate, 'dd/MM/yyyy');
  console.log(this.formattedDate, "formatted date");
  const dateParts = this.formattedDate.split('/');
  const year = +dateParts[2];
  const month = +dateParts[1] - 1;
  const day = +dateParts[0];
  const formattedDate = new Date(year, month, day);
  const final = this.datePipe.transform(formattedDate, 'dd MMMM yyyy');
  const parts = final.split(' ');
  this.day = parts[0];
  this.month = parts[1];
  this.year = parts[2];
  console.log(this.day, this.month, this.year)
}

selectAll = false; // Variable to track whether "Select All" is selected
searchTerm: string;
selectedEmployeeIds: string[] = [];

applyTableEmpIdFilter() {
  let filteredData = this.allEmployeeDataSource.data;
  console.log(this.dataLength, "length")
  if (this.searchTerm && this.searchTerm.trim() !== '') {
    filteredData = filteredData.filter(employee =>
      employee.employeeId.includes(this.searchTerm)
    );
  }
  if (this.selectedEmployeeIds.length > 0 && !this.selectedEmployeeIds.includes('selectAll')) {
    filteredData = filteredData.filter(employee =>
      this.selectedEmployeeIds.includes(employee.employeeId)
    );
    console.log(filteredData, "dzfbv")
  }
  this.filteredDataSource.data = filteredData;
  this.allEmployeeData.data = filteredData;

}

optionClicked(event: any) {
  console.log('Selected Option:', this.selectedOption);
  if (this.selectedOption == 'Pay Arrear') {
    this.router.navigate(['/payroll/payArrear/']);

  } else if (this.selectedOption == 'DA Arrear') {
    this.router.navigate(['/payroll/daArrear/']);

  } else if (this.selectedOption == 'Monthly Salary') {
    this.router.navigate(['/payroll/newmonthlysalary/']);

  } else if (this.selectedOption == 'Supplementary Salary') {
    this.router.navigate(['/payroll/supplementarysalary/']);

  } else if (this.selectedOption == 'EL Surrender') {
    this.router.navigate(['/payroll/elSurrender/']);

  }
}
}
