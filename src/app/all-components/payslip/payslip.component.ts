import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { MatSelect } from '@angular/material/select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrl: './payslip.component.css'
})

export class PayslipComponent {

  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild(MatSelect) matSelect!: MatSelect;
  getPaySlip: any
  payArrearPaySlip: any
  getPaySlipEarnings: any[] = [];
  getPaySlipDeduction: any[] = [];
  userId: string;
  details: any;
  name: any;
  designation: any;
  id: any;
  joinDate: any;
  panNumber: any;
  currentMonthValue: any;
  currentMonth: string;
  pfNum: any;
  getMonth: any;
  getYear: any;
  currentMonthName: string;
  paySlipGen: boolean
  words: any
  dropDown: boolean = true
  idDropdown: boolean = false
  generateButton: boolean = false
  paidDays: any
  lopDays: any
  years: number[] = [];
  Months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  personalDatas: any
  originalData: any[] = [];
  payrollData: any;
  combinedArray = [];
  employeeIDs: any
  selectedYear: any
  selectedMonth: any
  selectedEmployeeIds: any
  selectedEmployeeid: string = '';
  payMonth: any
  NetPay: any;
  netPayInWords: any;
  selectAll = false; // Variable to track whether "Select All" is selected
  searchTerm: string;
  inputId = true
  bankName: any
  bankBranchName: any
  bankAccNo: any
  bankIFSC: any
  officeCode: any

  constructor(
    private apiCall: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) {

    console.log(sessionStorage.getItem("userId"));
    this.userId = sessionStorage.getItem("userId");
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      this.years.push(i);
    }
    console.log(this.years, "years")

  }

  generatePDF(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const content = this.content.nativeElement;

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // width of A4 in mm
      const pageHeight = 297; // height of A4 in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('Document.pdf');
    });
  }




  ngOnInit(): void {
    // this.getData()
    // this.getPayslip();
    this.getData();
    // this.month();
    this.currentMonth = this.getCurrentMonth();
  }

  generateNext() {
    this.paySlipGen = false
    this.generateButton = false
    this.dropDown = false
    this.idDropdown = false
    this.inputId = true
    this.selectedEmployeeid = '';
    this.selectedYear = '';
    this.selectedMonth = '';
    this.searchText = '';
  }
  filteredEmployeeIDs: any
  async getData() {
    this.spinner.show()
    const payload = { 'id': 1 }

    this.apiCall.apiPostCall(payload, 'getAllEmployeePayRoll').subscribe(data => {
      this.payrollData = data.data;
    })
    await this.apiCall.personel_apiPostCall({ id: 1 }, 'getAllPayRollDetails').subscribe(async response => {
      // this.allDatas = response['data'];
      this.personalDatas = response['data'];
      const mergedData = this.personalDatas.map(personalItem => {
        const correspondingPayrollItem = this.payrollData.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
        return {
          ...correspondingPayrollItem,
          ...personalItem,
        };
      });
      console.log(mergedData)
      this.employeeIDs = mergedData
      this.filteredEmployeeIDs = this.employeeIDs
      console.log(this.employeeIDs, "employee ids")
      if (response.status) {
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    });
  }

  month() {
    this.currentMonthValue = new Date().getMonth().toString();
    console.log(this.currentMonthValue, 'vvyvgtfcvt');
  }

  getCurrentMonth(): string {
    const date = new Date();
    return this.datePipe.transform(date, 'MMMM')!;
  }

  getPayslip() {
    console.log(this.selectedEmployeeid, this.getMonth, this.getYear)
    this.spinner.show()
    this.apiCall.getPayslipData('getPaySlip', this.selectedEmployeeid, this.getMonth, this.getYear).subscribe(
      (res: any) => {
        this.getPaySlip = res.data[0];
        console.log(this.getPaySlip, "this.getPaySlip")
        if (res.status) {
          this.apiCall.getPayslipData('payArrears', this.selectedEmployeeid, this.getMonth, this.getYear).subscribe((payArrearRes: any) => {
            let firstData = this.getPaySlip;
            console.log(firstData, "firstData")
            let secondData = payArrearRes;
            console.log(secondData, "secondData")
            console.log(secondData[0].basicPayEarning, "dfdfbv")

            firstData.basicPayEarning += Math.abs(secondData[0].basicPayEarning) || 0;
            firstData.personalPay += Math.abs(secondData[0].personalPays) || 0;
            firstData.specialPay += Math.abs(secondData[0].specialPays) || 0;
            firstData.cca += Math.abs(secondData[0].cca) || 0;
            firstData.hra += Math.abs(secondData[0].hra) || 0;
            firstData.da += Math.abs(secondData[0].da) || 0;
            firstData.gpfSub += Math.abs(secondData[0].gpfsub) || 0;
            firstData.misc1 += Math.abs(secondData[0].misc1) || 0;

            firstData.totalEarning += Math.abs(secondData[0].totalEarning) || 0;
            firstData.totalDeductions += Math.abs(secondData[0].totalDeductions) || 0;
            firstData.misc1 += Math.abs(secondData[0].misc1) || 0;
            console.log(firstData, "firstDatafirstData");

            this.calculateValues(firstData)
          })
          this.name = res.data[0].employeeName;
          this.designation = res.data[0].designationName;
          this.id = res.data[0].employeeId;
          let date = res.data[0].dateOfJoiningService.split('-')[2];
          let month = res.data[0].dateOfJoiningService.split('-')[1];
          let year = res.data[0].dateOfJoiningService.split('-')[0];
          this.panNumber = res.data[0].panNo;

          this.bankName = res.data[0].bankName;
          this.bankBranchName = res.data[0].bankBranchName;
          this.bankAccNo = res.data[0].bankAcNo;
          this.bankIFSC = res.data[0].bankIFSC;
          this.officeCode = res.data[0].officeCode;

          this.pfNum = res.data[0].employeeId;
          this.paidDays = res.data[0].totalDays
          this.lopDays = res.data[0].difference
          let Employee_JoinDate = date + '-' + month + '-' + year;
          this.joinDate = this.datePipe.transform(Employee_JoinDate, 'dd-MM-yyyy');
          this.NetPay = res.data[0].netPay
        
          this.paySlipGen = true
          this.dropDown = true
          this.idDropdown = true
          this.generateButton = true
          this.inputId = false
          this.spinner.hide()

        } else {
          this.spinner.hide()
        }

      }, (err) => {
        console.error(err.message);
      }
    )
  }

  earningSums:any
  deductionValues:any
  totalNetpayValue:any
  calculateValues(data:any){
    this.earningSums = data.basicPayEarning + data.personalPay + data.specialPay + data.da + data.hra + data.cca + data.medicalAllowance + data.fta + data.hillAllowance + data.winterAllowance + data.washingAllowance + data.conveyanceAllowanceEarnings +data.cashAllowance + data.interimRelief + data.misc1 + data.hrr

    this.deductionValues = data.gpfSub + data.vpf + data.cps + data.fbf + data.nhis + data.specialPf + data.hba + data.hbf + data.rentDeductions + data.waterCharges + data.professionalTax + data.oneDayRecovery + data.incomeTax + data.incomeTaxCess + data.eoe + data.gpfLoan + data.gpfArrear + data.cpsArrear + data.festivalAdvance + data.conveyanceAdvance + data.educationAdvance + data.marriageAdvance + data.payAdvance + data.miscDeduction1 + data.miscDeduction2

    this.totalNetpayValue = this.earningSums - this.deductionValues
    const words = this.apiCall.numberToWords(this.totalNetpayValue);
    this.words = this.apiCall.capitalizeFirstLetters(words);
  }

  onYearSelect(event: any) {
    this.getYear = event.target.value;
    console.log(this.getYear);

  }

  searchText: string = '';
  filterEmployeeIDs() {
    this.filteredEmployeeIDs = this.employeeIDs.filter(employee =>
      employee.employeeId.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  employeeId(event: any) {
    this.selectedEmployeeid = event.target.value;
    console.log(this.selectedEmployeeid);
    if (this.selectedEmployeeid != '') {
      this.dropDown = false
    }
  }

  onMonthSelect(event: any) {
    this.getMonth = event.target.value;
    let monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    for (let i = 0; i < monthNames.length; i++) {
      // if (monthNames[i] == this.currentMonth) {
      //   console.log(i + '----gcghfyjg---', monthNames[i]);
      //   this.payMonth = monthNames[i];
      //   console.log(this.payMonth + '-' + monthNames[i]);

      // }
      console.log('not in');

      if (i == this.getMonth) {
        console.log('i am in');

        console.log(i + '----gcghfyjg---', monthNames[i]);
        this.payMonth = monthNames[i - 1];
        console.log(this.payMonth + '-' + monthNames[i]);
      }
    }
    console.log(this.getMonth);
    this.getPayslip()
  }

  applyTableEmpIdFilter(event) {
    // this.selectedEmployeeIds = event.value
    // console.log(this.selectedEmployeeIds)
    // console.log(this.searchTerm)
  }

}
