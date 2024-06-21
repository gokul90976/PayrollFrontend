import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PopupEmpDetComponent } from '../popup-emp-det/popup-emp-det.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupDaEditComponent } from '../popup-da-edit/popup-da-edit.component';
import { ArrearFieldsComponent } from '../arrear-fields/arrear-fields.component';
import { DaArrearFieldsComponent } from '../da-arrear-fields/da-arrear-fields.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-da-monthlysalary-edit',
  templateUrl: './da-monthlysalary-edit.component.html',
  styleUrl: './da-monthlysalary-edit.component.css'
})
export class DaMonthlysalaryEditComponent {
  isDisabled: boolean;
  formattedDate: string;
  form!: FormGroup
  EditRemarksForm!: FormGroup;
  EditRemarksFormAO!: FormGroup;
  EditRemarksFormDCAO!: FormGroup;
  EditRemarksFormFA!: FormGroup;
  nid: any;
  salaryValue: any;
  submit: boolean;
  roleName: any
  payload: any;
  filteredDataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  totalGross: any
  allEmployeeData: any
  totalEarningtotal: any
  totalDeduction: any
  totalNetpay: any
  panelOpenState = false;
  apiDate: any;
  daDatas: any[] = [];
  excelData: any[]


  employeeTableColumns: string[] = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'officeName', 'totalEarning', 'totaltotalDeductions', 'netPay', 'action'];

  eLtableColumns: string[] = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'designationName', 'eLMonth', 'eLNoOfdays', 'eLbasicPay', 'eLsplPay', 'eLda', 'eLhra', 'eLcca', 'grossTotal'];

  daTableColumns: string[] = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'designationName', 'dAgrossTotal', 'cps', 'netTotal'];
  @ViewChild(MatSelect) matSelect!: MatSelect;
  voucherNo: any
  selectedEmployeeIds: any[] = [];
  allArray: any[];
  uniqueObjects: any[];
  isRevert: boolean = false
  newData: any;
  isView: boolean
  payRollDet: any;
  allEmployeeDataSource!: MatTableDataSource<any>;
  selectedID: any = []
  currentDate = new Date();
  paymentType: any
  isElEdit: boolean

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


  constructor(private fb: FormBuilder, private activeRoute: ActivatedRoute, private router: Router, private apiCall: ApiService, private datePipe: DatePipe, private toastr: ToastrService, private matDialog: MatDialog) {
    // this.getIdDetails()
    this.activeRoute.paramMap.subscribe(params => {
      this.nid = params.get('id');
      this.roleName = sessionStorage.getItem('userName')
      let todayDate = this.datePipe.transform(this.currentDate, 'dd-MM-yyyy');
      if (this.roleName === 'DA') {
        this.EditRemarksForm = this.fb.group({
          id: [''],
          remarksforDA: ['', Validators.required],
          signature: ['', Validators.required],
          // bankCode: ['',Validators.required],
          date: new FormControl(todayDate),
          totalEarning: ['', Validators.required],
          totalDeductions: ['', Validators.required],
          netPay: ['', Validators.required],

        })

        this.form = this.fb.group({
          from: ['', Validators.required],
          to: ['', Validators.required],
          daDiff: ['', Validators.required],
        })
        if (this.router.url.includes('view')) {
          this.EditRemarksForm.disable()
          this.form.disable()
          this.getIdDetails()
          this.submit = false
          this.isDisabled = true;
          this.isView = true
          this.isElEdit = false
        } else if (this.router.url.includes('edit')) {
          this.getIdDetails()
          this.isDisabled = false;
          this.submit = true
          this.isView = false
          this.isElEdit = true

        }
      } else if (this.roleName === 'AO') {

        if (this.router.url.includes('view')) {
          console.log("value")

          this.EditRemarksForm = this.fb.group({
            id: [''],
            remarksforDA: ['', Validators.required],
            signature: ['', Validators.required],
            // bankCode: ['',Validators.required],
            date: [''],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],

          })
          this.form = this.fb.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            daDiff: ['', Validators.required],
          })
          let todayDate = this.datePipe.transform(this.currentDate, 'dd-MM-yyyy');
          let dateOfAOControl = new FormControl(todayDate);
          this.EditRemarksFormAO = this.fb.group({
            remarksforAO: ['', Validators.required],
            signatureForAO: ['', Validators.required],
            dateOfAO: dateOfAOControl,
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],
          })
          console.log(this.EditRemarksFormAO.value)
          this.getIdDetails()
          this.submit = true
          this.isRevert = true
          this.isView = true
          this.isElEdit = false

        } else {
          this.isView = false
          this.isElEdit = true

        }
      } else if (this.roleName === 'DCAO') {
        if (this.router.url.includes('view')) {
          this.EditRemarksForm = this.fb.group({
            id: [''],
            remarksforDA: ['', Validators.required],
            signature: ['', Validators.required],
            // bankCode: ['',Validators.required],
            date: [this.getTodayDate()],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],

          })

          this.EditRemarksFormAO = this.fb.group({
            remarksforAO: ['', Validators.required],
            signatureForAO: ['', Validators.required],
            dateOfAO: [this.getTodayDate()],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],
          })
          this.EditRemarksFormDCAO = this.fb.group({
            remarksforDCAO: ['', Validators.required],
            signatureForDCAO: ['', Validators.required],
            dateOfDCAO: [this.getTodayDate()],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],
          })
          this.form = this.fb.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            daDiff: ['', Validators.required],
          })
          this.getIdDetails()
          this.submit = true
          this.isView = true
        } else {
          this.isView = false
        }
      } else {
        if (this.router.url.includes('view')) {
          this.EditRemarksForm = this.fb.group({
            id: [''],
            remarksforDA: ['', Validators.required],
            signature: ['', Validators.required],
            // bankCode: ['',Validators.required],
            date: [this.getTodayDate()],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],

          })
          this.EditRemarksFormAO = this.fb.group({
            remarksforAO: ['', Validators.required],
            signatureForAO: ['', Validators.required],
            dateOfAO: [this.getTodayDate()],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],
          })
          this.EditRemarksFormDCAO = this.fb.group({
            remarksforDCAO: ['', Validators.required],
            signatureForDCAO: ['', Validators.required],
            dateOfDCAO: [this.getTodayDate()],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],
          })
          this.EditRemarksFormFA = this.fb.group({
            remarksforFA: ['', Validators.required],
            signatureForFA: ['', Validators.required],
            dateOfFA: [this.getTodayDate()],
            totalEarning: ['', Validators.required],
            totalDeductions: ['', Validators.required],
            netPay: ['', Validators.required],
          })
          this.form = this.fb.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            daDiff: ['', Validators.required],
          })
          this.getIdDetails()
          this.submit = true
          this.isView = true
        } else {
          this.isView = false
        }
      }

    })
  }

  ngOnInit(): void {

  }

  selectedMonth: any
  onMonthChange(employeepayroll: any, event: any) {
    // this.selectedMonth = event.name

    const year = new Date().getFullYear(); // Use the current year
    const month = employeepayroll.selectedMonth;
    employeepayroll.daysInMonth = this.getDaysInMonth(year, month);
    const monthName = this.months.find(m => m.value === employeepayroll.selectedMonth);
    console.log(monthName.name, "monthName")
    this.selectedMonth = monthName.name
    return month ? month.name : '';
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  openDialog(type, id) {
    const dialogRef = this.matDialog.open(PopupEmpDetComponent, {
      width: 'auto',
      height: 'autos',
      maxHeight: '45vw',
      data: {
        type: type,
        empId: id
      }
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.payRollDet = data
        console.log(this.payRollDet, "payrooll det")
      }
    })
  }

  openDialogPayArrear(type, id, name, designationName, officeName, voucherNo, ofcCode, joingDate) {
    console.log(id, type)
    const dialogRef = this.matDialog.open(ArrearFieldsComponent, {
      width: 'auto',
      height: 'autos',
      maxHeight: '45vw',
      data: {
        type: type,
        empId: id,
        empName: name,
        desgName: designationName,
        ofcName: officeName,
        voucherNo: voucherNo,
        ofcCode: ofcCode,
        joingDate: joingDate
      }
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.payRollDet = data
        console.log(this.payRollDet, "payrooll det")
      }
    })
  }

  openDialogDaArrear(type, id) {
    console.log(id, type)
    const dialogRef = this.matDialog.open(DaArrearFieldsComponent, {
      width: 'auto',
      height: 'autos',
      maxHeight: '45vw',
      data: {
        type: type,
        empId: id
      }
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.payRollDet = data
        console.log(this.payRollDet, "payrooll det")
      }
    })
  }

  dynamicColumns: string[] = [];

  getIdDetails() {
    const payload = { voucherNo: this.nid }
    this.apiCall.apiPostCall(payload, 'getMonthlySalaryByVoucherNo').subscribe(data => {
      this.paymentType = data.data[0].paymentType
      console.log(this.paymentType, "this.paymentType")
      console.log(data.data, "data")
      this.salaryValue = data.data[0]
      console.log(this.salaryValue)
      this.payRollDet = data.data[0].employeeTableData;
      console.log(' this.payRollDet', this.payRollDet);

      if (this.roleName == 'DA') {
        this.EditRemarksForm.patchValue(this.salaryValue)
        this.form.patchValue(this.salaryValue)
        // this.form.disable()

        // if(data.data[0].status == "Pending"  && data.data[0].status == "Waiting for FA Approval"){
        //   data.data[0].status = "Active"
        // }
      } else if (this.roleName == 'AO') {
        console.log("vhnf")
        this.EditRemarksForm.patchValue(this.salaryValue)
        this.form.patchValue(this.salaryValue)
        this.form.disable()
        this.EditRemarksForm.disable()
        this.EditRemarksFormAO.patchValue(this.salaryValue)
        if (data.data[0].statusAO == "Active" || data.data[0].statusAO == "Approved") {
          console.log("pending if")
          this.isRevert = false
          this.submit = false
          this.EditRemarksFormAO.disable()
        } else if (data.data[0].statusAO == "Pending") {
          this.isRevert = true
          this.submit = true
          // this.EditRemarksFormAO.disable()
        } else if (data.data[0].statusAO == "Reverted") {
          this.isRevert = false
          this.submit = false
          this.EditRemarksFormAO.disable()
        }
      } else if (this.roleName == 'DCAO') {
        this.EditRemarksForm.patchValue(this.salaryValue)
        this.EditRemarksForm.disable()
        this.form.patchValue(this.salaryValue)
        this.form.disable()
        this.EditRemarksFormAO.patchValue(this.salaryValue)
        this.EditRemarksFormAO.disable()
        this.EditRemarksFormDCAO.patchValue(this.salaryValue)
        if (data.data[0].statusDCAO == "Pending") {
          console.log("FA approval if")
          this.submit = true
        } else if (data.data[0].statusDCAO == "Active" || data.data[0].statusDCAO == "Approved") {
          this.submit = false
          this.EditRemarksFormDCAO.disable()
        }
      } else if (this.roleName == 'FA') {
        this.EditRemarksForm.patchValue(this.salaryValue)
        this.EditRemarksForm.disable()
        this.form.patchValue(this.salaryValue)
        this.form.disable()
        this.EditRemarksFormAO.patchValue(this.salaryValue)
        this.EditRemarksFormAO.disable()
        this.EditRemarksFormDCAO.patchValue(this.salaryValue)
        this.EditRemarksFormDCAO.disable()
        this.EditRemarksFormFA.patchValue(this.salaryValue)
        if (data.data[0].statusFA == "Approved") {
          console.log("FA approval if")
          this.submit = false
          this.EditRemarksFormFA.disable()
        }
      }
      console.log(this.payRollDet, "this.payRollDet")
      let filteredEmployeeId = Array.from(new Set(this.payRollDet.map(employee => employee.employeeId)))
      console.log(filteredEmployeeId, "filteredEmployeeId")
      this.selectedEmployeeIds = filteredEmployeeId
      console.log(this.selectedEmployeeIds, "this.selectedEmployeeIds ")
      this.voucherNo = data.data[0].voucherNo
      this.formattedDate = data.data[0].finacionalYearDate
      // this.apiDate = this.datePipe.transform(this.formattedDate, 'dd/MM/yyyy');
      // this.allEmployeeDataSource.data = data.data;
      const dateString = this.formattedDate;
      console.log(dateString, "dateString")

      this.apiDate = dateString
      console.log(this.apiDate, "api date")

      const parsedDate = this.apiCall.parseDate(this.apiDate);
      this.day = parsedDate.date;
      this.month = parsedDate.month;
      this.year = parsedDate.year;
      console.log(this.day, this.month, this.year)
      this.allEmployeeDataSource = new MatTableDataSource(this.payRollDet);
      console.log(this.allEmployeeDataSource, "178")
      this.filteredDataSource = new MatTableDataSource(this.payRollDet);
      console.log(this.filteredDataSource, "180")
      this.allEmployeeData = this.allEmployeeDataSource.data
      this.extractDynamicColumns(this.payRollDet);
      this.updateDisplayedColumns();

      console.log("check pay type")
      this.getTotal();
      this.getTotal_Deduct()
      this.getTotal_Netpay()

      console.log(this.filteredDataSource.data, "dfdgbd")
      const payload = { id: 1 }
      // this.apiCall.apiPostCall(payload, 'getAllEmployeePayRoll').subscribe(data => {
      //   this.allEmployeeData = data.data
      //   console.log(this.allEmployeeData, "dfbdfb")
      // })
      const arrayFields: any = data.data[0].employeeTableData
      arrayFields.forEach((fam, i) => {
        console.log(fam)
      })

      if (this.router.url.includes('view')) {

      }
    })
  }

  extractDynamicColumns(data: any) {
    const dynamicColumnsSet = new Set<string>();
    const monthRegex = /^(january|february|march|april|may|june|july|august|september|october|november|december)(Diff)?$/;

    console.log(data, "data")
    data.forEach(employee => {
      Object.keys(employee).forEach(key => {
        if (monthRegex.test(key) && employee[key] !== null && employee[key] !== undefined && employee[key] !== "") {
          dynamicColumnsSet.add(key);
        }
      });
    });

    this.dynamicColumns = Array.from(dynamicColumnsSet);
  }
  displayedColumns: string[] = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'designationName', 'grossTotal', 'cps', 'netTotal'];
  updateDisplayedColumns() {
    this.displayedColumns = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'designationName', ...this.dynamicColumns, 'grossTotal', 'cps', 'netTotal'];
  }



  getTodayDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: string | number = today.getMonth() + 1;
    let dd: string | number = today.getDate();

    // Add leading zero if month/day is less than 10
    mm = mm < 10 ? '0' + mm : mm;
    dd = dd < 10 ? '0' + dd : dd;

    return `${yyyy}-${mm}-${dd}`;
  }

  applyTableEmpIdFilter(newID): any {
    const selectedEmployeeIds = this.matSelect.value;
    if (selectedEmployeeIds && selectedEmployeeIds.length > 0) {
      this.filteredDataSource.data = this.allEmployeeData.filter(employee => selectedEmployeeIds.includes(employee.employeeId));
      let newArray = []
      this.uniqueObjects = this.filteredDataSource.data.filter(obj2 => !this.payRollDet.find(obj1 => obj1.employeeId === obj2.employeeId));
      newArray.push(this.uniqueObjects)
      this.newData = newArray[0]
    } else {
      // If no options are selected, display all data
      this.filteredDataSource.data = this.allEmployeeData;
    }
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
  }




  isSelected(employeeId: string): boolean {
    return this.selectedEmployeeIds.includes(employeeId);
  }

  applyTableDivisionFilter(event) {
    const selectedDivisions: any = event.value;
    console.log(selectedDivisions, "selectedDivisions")
    if (selectedDivisions && selectedDivisions.length > 0) {
      this.filteredDataSource.data = this.allEmployeeData.filter(employee => selectedDivisions.includes(employee.officeName));
      console.log(this.filteredDataSource.data)
    } else {
      // If no options are selected, display all data
      this.filteredDataSource.data = this.allEmployeeData;
    }
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
  }

  //monthly salary calculations
  getTotal() {
    if (this.paymentType == 'EL Surrender') {
      console.log(this.filteredDataSource.data, "dfvdfv");
      this.totalEarningtotal = this.filteredDataSource.data
        .map(t => Number(t.grossTotal) || 0)
        .reduce((acc, value) => acc + value, 0);
      console.log(this.totalEarningtotal, "gross");
    } else if (this.paymentType == 'DA Arrear') {
      this.totalEarningtotal = this.filteredDataSource.data.map(t => t.grossTotal).reduce((acc, value) => acc + value, 0);
    } else {
      console.log(this.filteredDataSource.data, "dfdgbd")
      this.totalEarningtotal = this.filteredDataSource.data.map(t => t.totalEarning).reduce((acc, value) => acc + value, 0);
      console.log(this.totalEarningtotal, "total Earning")
    }
  }

  getTotal_Deduct() {

    if (this.paymentType == 'DA Arrear') {
      this.totalDeduction = this.filteredDataSource.data.map(t => t.cps).reduce((acc, value) => acc + value, 0);

    } else {
      this.totalDeduction = this.filteredDataSource.data.map(t => t.totalDeductions).reduce((acc, value) => acc + value, 0);
      console.log(this.totalDeduction, "total totalDeduction")
    }


  }

  getTotal_Netpay() {
    console.log(this.filteredDataSource.data, "dataa filter")
    if (this.paymentType == 'DA Arrear') {
      this.totalNetpay = this.filteredDataSource.data.map(t => t.netTotal).reduce((acc, value) => acc + value, 0);

    } else {
      this.totalNetpay = this.filteredDataSource.data.map(t => t.netPay).reduce((acc, value) => acc + value, 0);
      console.log(this.totalNetpay, "total totalNetpay")
    }

  }

  //arrear calculations

  toBeDrawnTotal: any
  alreadyDrawnTotal: any
  differenceTotal: any

  tobeDrawn_Total() {
    console.log(this.filteredDataSource, "cal value tobedrawn")
    this.toBeDrawnTotal = this.filteredDataSource.data.map(t => t.totalEarning).reduce((acc, value) => acc + value, 0);
    console.log(this.toBeDrawnTotal, "this.toBeDrawnTotal")
  }

  alreadyDrawn_Total() {
    this.alreadyDrawnTotal = this.filteredDataSource.data.map(t => t.totalDeductions).reduce((acc, value) => acc + value, 0);
    console.log(this.alreadyDrawnTotal, "this.alreadyDrawnTotal")
  }

  difference_Total() {
    this.differenceTotal = this.filteredDataSource.data.map(t => t.netPay).reduce((acc, value) => acc + value, 0);
    console.log(this.differenceTotal, "this.differenceTotal")
  }

  day: string;
  month: string;
  year: string;

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
    // this.day = parts[0];
    // this.month = parts[1];
    // this.year = parts[2];
    console.log(this.day, this.month, this.year)

  }

  monthlySalaryEdit() {
    if (this.roleName == "DA") {
      this.payload = {
        "employeeTableData": this.newData,
        "remarksforDA": this.EditRemarksForm.controls['remarksforDA'].value,
        "signature": this.EditRemarksForm.controls['signature'].value,
        "date": this.EditRemarksForm.controls['date'].value,
        "nid": this.nid,
        "voucherNo": this.salaryValue.voucherNo,
        "totalEarning": this.salaryValue.totalEarning,
        "totalDeductions": this.salaryValue.totalDeductions,
        "netPay": this.salaryValue.netPay,
        "finacionalYearDate": this.salaryValue.finacionalYearDate,
        "year": this.year,
        "month": this.month,
        "day": this.day,
        "paymentType": this.paymentType,
        "from": this.form.controls['from'].value,
        "to": this.form.controls['to'].value,
        "daDiff": this.form.controls['daDiff'].value,
        "statusDA": "Active",
        "statusAO": "Pending",
        "statusDCAO": "",
        "statusFA": ""

      }
      console.log(this.payload, "DA")
      this.apiCall.apiPostCall(this.payload, 'saveMonthlySalary').subscribe(data => {
        console.log(data, "data")
        this.EditRemarksForm.patchValue(data.data[0])
        if (data.status) {
          this.router.navigate(['/payroll/monthlysalary']);
          this.toastr.success("Submitted Successfully");
        } else {
          this.toastr.error("Submit is Unsuccessful");
        }
      })
    } else if (this.roleName == "AO") {
      this.payload = {
        "employeeTableData": this.filteredDataSource.data,
        "remarksforDA": this.EditRemarksForm.controls['remarksforDA'].value,
        "signature": this.EditRemarksForm.controls['signature'].value,
        "date": this.EditRemarksForm.controls['date'].value,
        "remarksforAO": this.EditRemarksFormAO.controls['remarksforAO'].value,
        "signatureForAO": this.EditRemarksFormAO.controls['signatureForAO'].value,
        "dateOfAO": this.EditRemarksFormAO.controls['dateOfAO'].value,
        "nid": this.nid,
        "voucherNo": this.salaryValue.voucherNo,
        "totalEarning": this.salaryValue.totalEarning,
        "totalDeductions": this.salaryValue.totalDeductions,
        "netPay": this.salaryValue.netPay,
        "finacionalYearDate": this.salaryValue.finacionalYearDate,
        "year": this.year,
        "month": this.month,
        "day": this.day,
        "paymentType": this.paymentType,
        "from": this.form.controls['from'].value,
        "to": this.form.controls['to'].value,
        "daDiff": this.form.controls['daDiff'].value,
        "statusDA": "Active",
        "statusAO": "Active",
        "statusDCAO": "Pending",
        "statusFA": ""
      }
      console.log(this.payload, "AO")
      this.apiCall.apiPostCall(this.payload, 'saveMonthlySalary').subscribe(data => {
        console.log(data, "data")
        this.EditRemarksFormAO.patchValue(data.data[0])
        if (data.status) {
          this.router.navigate(['/payroll/monthlysalary']);
          this.toastr.success("Submitted Successfully");
        } else {
          this.toastr.error("Submit is Unsuccessful");
        }
      })
    } else if (this.roleName == "DCAO") {
      this.payload = {
        "employeeTableData": this.filteredDataSource.data,
        "remarksforDA": this.EditRemarksForm.controls['remarksforDA'].value,
        "signature": this.EditRemarksForm.controls['signature'].value,
        "date": this.EditRemarksForm.controls['date'].value,
        "remarksforAO": this.EditRemarksFormAO.controls['remarksforAO'].value,
        "signatureForAO": this.EditRemarksFormAO.controls['signatureForAO'].value,
        "dateOfAO": this.EditRemarksFormAO.controls['dateOfAO'].value,
        "remarksforDCAO": this.EditRemarksFormDCAO.controls['remarksforDCAO'].value,
        "signatureForDCAO": this.EditRemarksFormDCAO.controls['signatureForDCAO'].value,
        "dateOfDCAO": this.EditRemarksFormDCAO.controls['dateOfDCAO'].value,
        "nid": this.nid,
        "voucherNo": this.salaryValue.voucherNo,
        "totalEarning": this.salaryValue.totalEarning,
        "totalDeductions": this.salaryValue.totalDeductions,
        "netPay": this.salaryValue.netPay,
        "finacionalYearDate": this.salaryValue.finacionalYearDate,
        "year": this.year,
        "month": this.month,
        "day": this.day,
        "paymentType": this.paymentType,
        "from": this.form.controls['from'].value,
        "to": this.form.controls['to'].value,
        "daDiff": this.form.controls['daDiff'].value,
        "statusDA": "Active",
        "statusAO": "Active",
        "statusDCAO": "Active",
        "statusFA": "Pending"
      }
      console.log(this.payload, "DCAO")
      this.apiCall.apiPostCall(this.payload, 'saveMonthlySalary').subscribe(data => {
        console.log(data, "data")
        this.EditRemarksFormDCAO.patchValue(data.data[0])
        if (data.status) {
          this.router.navigate(['/payroll/monthlysalary']);
          this.toastr.success("Submitted Successfully");
        } else {
          this.toastr.error("Submit is Unsuccessful");
        }
      })
    } else {
      this.payload = {
        "employeeTableData": this.filteredDataSource.data,
        "remarksforDA": this.EditRemarksForm.controls['remarksforDA'].value,
        "signature": this.EditRemarksForm.controls['signature'].value,
        "date": this.EditRemarksForm.controls['date'].value,
        "remarksforAO": this.EditRemarksFormAO.controls['remarksforAO'].value,
        "signatureForAO": this.EditRemarksFormAO.controls['signatureForAO'].value,
        "dateOfAO": this.EditRemarksFormAO.controls['dateOfAO'].value,
        "remarksforDCAO": this.EditRemarksFormDCAO.controls['remarksforDCAO'].value,
        "signatureForDCAO": this.EditRemarksFormDCAO.controls['signatureForDCAO'].value,
        "dateOfDCAO": this.EditRemarksFormDCAO.controls['dateOfDCAO'].value,
        "remarksforFA": this.EditRemarksFormFA.controls['remarksforFA'].value,
        "signatureForFA": this.EditRemarksFormFA.controls['signatureForFA'].value,
        "dateOfFA": this.EditRemarksFormFA.controls['dateOfFA'].value,
        "nid": this.nid,
        "voucherNo": this.salaryValue.voucherNo,
        "totalEarning": this.salaryValue.totalEarning,
        "totalDeductions": this.salaryValue.totalDeductions,
        "netPay": this.salaryValue.netPay,
        "finacionalYearDate": this.salaryValue.finacionalYearDate,
        "year": this.year,
        "month": this.month,
        "day": this.day,
        "paymentType": this.paymentType,
        "from": this.form.controls['from'].value,
        "to": this.form.controls['to'].value,
        "daDiff": this.form.controls['daDiff'].value,
        "statusDA": "Approved",
        "statusAO": "Approved",
        "statusDCAO": "Approved",
        "statusFA": "Approved"
      }

      console.log(this.payload, "FA")
      this.apiCall.apiPostCall(this.payload, 'saveMonthlySalary').subscribe(data => {
        console.log(data, "data")
        this.EditRemarksFormDCAO.patchValue(data.data[0])
        if (data.status) {
          this.router.navigate(['/payroll/monthlysalary']);
          this.toastr.success("Submitted Successfully");
        } else {
          this.toastr.error("Submit is Unsuccessful");
        }
      })
    }


  }

  revertTerm() {
    let payload = {
      "remarksforDA": this.EditRemarksForm.controls['remarksforDA'].value,
      "signature": this.EditRemarksForm.controls['signature'].value,
      "date": this.EditRemarksForm.controls['date'].value,
      "remarksforAO": this.EditRemarksFormAO.controls['remarksforAO'].value,
      "employeeTableData": this.filteredDataSource.data,
      "signatureForAO": this.EditRemarksFormAO.controls['signatureForAO'].value,
      "dateOfAO": this.EditRemarksFormAO.controls['dateOfAO'].value,
      "nid": this.nid,
      "voucherNo": this.salaryValue.voucherNo,
      "totalEarning": this.salaryValue.totalEarning,
      "totalDeductions": this.salaryValue.totalDeductions,
      "netPay": this.salaryValue.netPay,
      "finacionalYearDate": this.salaryValue.finacionalYearDate,
      "year": this.year,
      "month": this.month,
      "day": this.day,
      "paymentType": this.paymentType,
      "from": this.form.controls['from'].value,
      "to": this.form.controls['to'].value,
      "daDiff": this.form.controls['daDiff'].value,
      // "status": "Reverted",
      "statusDA": "Reverted",
      "statusAO": "Reverted",
      "statusDCAO": "",
      "statusFA": ""
    }
    console.log(payload, "revert term")
    this.apiCall.apiPostCall(payload, 'updateMonthlySalaryById').subscribe(data => {
      console.log(data, "data")
      this.EditRemarksForm.patchValue(data.data)
      if (data.status) {
        this.router.navigate(['/payroll/monthlysalary']);
        this.toastr.success("Reverted Successfully");

      } else {

      }
    })
  }

  onSubmit() {
    const formValues = this.form.value;
    const formattedFromDate = this.formatDate(formValues.from);
    const formattedToDate = this.formatDate(formValues.to);
    const daDifference = this.form.value.daDiff;

    this.apiCall.getDaData('employee-details', formattedFromDate, formattedToDate, daDifference).subscribe((res: any) => {
      console.log(res, "API Response");
      this.daDatas = res[0].data;
      this.generateDynamicColumns();
      this.calculateGrossTotal(); // Calculate grossTotal
      this.calculateCpsAndNetTotal(); // Calculate CPS and netTotal
      this.filteredDataSource.data = this.daDatas;
      console.log(this.filteredDataSource.data, "Filtered Data Source");
      this.getTotal();
      this.getTotal_Deduct()
      this.getTotal_Netpay()
    });
  }

  calculateGrossTotal() {
    this.daDatas.forEach(element => {
      let total = 0;
      this.dynamicColumns.forEach(column => {
        if (column.endsWith('DaDiff')) {
          const baseColumn = column.replace('DaDiff', '');
          total += element[`${baseColumn}Diff`] || 0;
        }
      });
      element['grossTotal'] = total;
    });
  }

  calculateCpsAndNetTotal() {
    this.daDatas.forEach(element => {
      if (element.pfCps === 'CPS') {
        element['cps'] = element.grossTotal * 0.1;
      } else {
        element['cps'] = 0;
      }
      element['netTotal'] = element.grossTotal - element.cps;
    });
  }

  generateDynamicColumns() {
    if (this.daDatas.length === 0) return;

    const sampleData = this.daDatas[0];
    const months = Object.keys(sampleData).filter(key =>
      (key.endsWith('Diff') || (key.length === 3 && sampleData[key] != null)) && key !== 'Sno'
    );

    this.dynamicColumns = months.reduce((acc, month) => {
      const baseMonth = month.replace('Diff', '');
      if (!acc.includes(`${baseMonth}Pay`) && baseMonth !== 'Sno') {
        acc.push(`${baseMonth}Pay`);
        acc.push(`${baseMonth}DaDiff`);
      }
      return acc;
    }, []);

    this.displayedColumns = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'designationName'].concat(this.dynamicColumns, ['grossTotal', 'cps', 'netTotal']);
  }

  getColumnValue(element: any, column: string): any {
    if (column === 'Sno') {
      return this.daDatas.indexOf(element) + 1;
    }
    if (column.endsWith('Pay')) {
      const baseColumn = column.replace('Pay', '');
      return element[baseColumn] ?? 'N/A';
    }
    if (column.endsWith('DaDiff')) {
      const baseColumn = column.replace('DaDiff', '');
      return element[`${baseColumn}Diff`] ?? 'N/A';
    }
    return element[column] ?? 'N/A';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  totalNoOfDays: any
  calculatePay(employeepayroll: any): void {
    const daysInMonth = employeepayroll.daysInMonth
    employeepayroll.elMonth = this.selectedMonth

    console.log(employeepayroll, "employeepayroll", daysInMonth, "171");
    this.totalNoOfDays = employeepayroll.noOfDays
    if (employeepayroll.noOfDays && employeepayroll.noOfDays > 0) {
      employeepayroll.basicPay = this.calculateAmount(employeepayroll.originalBasicPay, employeepayroll.noOfDays, daysInMonth);
      employeepayroll.specialPay = this.calculateAmount(employeepayroll.originalSpecialPay, employeepayroll.noOfDays, daysInMonth);
      employeepayroll.da = this.calculateAmount(employeepayroll.originalDa, employeepayroll.noOfDays, daysInMonth);
      employeepayroll.hra = this.calculateAmount(employeepayroll.originalHra, employeepayroll.noOfDays, daysInMonth);
      employeepayroll.cca = this.calculateAmount(employeepayroll.originalCca, employeepayroll.noOfDays, daysInMonth);
      console.log(employeepayroll.cca, "cca employee")
      employeepayroll.elBasicPay = employeepayroll.basicPay
      employeepayroll.elSpecialPay = employeepayroll.specialPay
      employeepayroll.elDa = employeepayroll.da
      employeepayroll.elHra = employeepayroll.hra
      employeepayroll.elCca = employeepayroll.cca

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
    console.log(this.totalGross, "grosssssssssssss")
    this.getTotal()
  }

  calculateAmount(originalAmount: number, noOfDays: number, daysInMonth: number): number {
    console.log(originalAmount, noOfDays, daysInMonth);
    // Calculate proportionate pay based on number of days worked in the month
    const amount = (originalAmount * noOfDays) / daysInMonth;
    return parseFloat(amount.toFixed(2));
  }

  monthlySalary_downloadExcel(){
    this.excelData = this.filteredDataSource.data.map((item:any, index:any) => ({
      'S.No': index + 1,
      'Date':this.apiDate,
      'Employee ID ': item.employeeId,
      'Employee Name': item.employeeName,
      'Designation Name': item.designationName,
      'Office Name': item.officeName,
      'Total Earnings':item.totalEarning,
      'Total Deductions': item.totalDeductions,
      'Net Pay': item.netPay,

    }));
    console.log(this.excelData, ' this.excelData');

    const worksheet = XLSX.utils.json_to_sheet(this.excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(data, 'Salaries List.xlsx');
  }

  monthlySalary_downloadPDF() {
    var columnStyle: any;
    let currentdate = new Date();
    let formaateDate =
      currentdate.getFullYear() +
      '-' +
      (currentdate.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      currentdate.getDate().toString().padStart(2, '0') +
      ' ' +
      currentdate.getHours().toString().padStart(2, '0') +
      ':' +
      currentdate.getMinutes().toString().padStart(2, '0');
    console.log('formate', formaateDate);

    try {
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);

      let getExportdata: any = [];
      var fileName: any;
      let headerName: any = [];
      let selectedDatetype: any;

      columnStyle = {
        // 0: { halign: "center" },
        // 1: { halign: "right" },
        // 2: { halign: "right" },
        // 3: { halign: "right" },
        // 4: { halign: "right" },
      };
      fileName = 'Monthly Salary';
      headerName = [
        'S.No',
        'Date',
        'Employee ID',
        'Employee Name',
        'Designation Name',
        'Office Name',
        'Total Earnings',
        'Total Deductions',
        'Net Pay',
      ];

      this.filteredDataSource.data.forEach((element:any, index:any) => {
        let data = [
          index + 1,
          this.apiDate,
          element.employeeId,
          element.employeeName,
          element.designationName,
          element.officeName,
          element.totalEarning,
          element.totalDeductions,
          element.netPay,
        ];
        getExportdata.push(data);
      });

      const doc = new jsPDF('landscape');
      const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
      // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
      const imageWidth = 25; // Adjust the image width as needed
      const pdfWidth = doc.internal.pageSize.getWidth();
      const imageX = 10;

      const imageY = 5; // Adjust the top margin as needed

      autoTable(doc, {
        head: [headerName],
        body: getExportdata,
        theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
        headStyles: {
          fillColor: [14, 31, 83],
          // Header background color
          textColor: 255, // Header text color
          // textColor: '#0E1F5',
          fontSize: 5, // Header font size
        },
        bodyStyles: {
          textColor: 0, // Body text color
          fontSize: 5, // Body font size
        },
        // columnStyles: columnStyle,
        alternateRowStyles: {
          fillColor: [255, 255, 255], // Alternate row background color
        },
        // columnStyles: cellWidth,
        margin: { top: 45 },
        pageBreak: 'auto',
        didDrawPage: (data) => {
          // console.log('data', data.pageCount);
          doc.addImage(imageUrl, 'png', 20, 0, 250, 30);

          doc.setTextColor(14, 31, 83);
          let titleY = 33;
          doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
            align: 'center',
          });

          doc.setFontSize(10);
          doc.text(
            'Page:' +
            ' ' +
            data.pageNumber +
            ', ' +
            'Generated on: ' +
            formaateDate,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        },
      });

      if (getExportdata.length > 0) {
        setTimeout(() => {
          doc.save(fileName + '.pdf');
        }, 100);
      } else {
      }
    } catch (error) {
      console.log('error', error);
    }
  }
}
