import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { PopupEmpDetComponent } from '../popup-emp-det/popup-emp-det.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NumberingService } from '../../service/numbering.service';
import { MatSelect } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PopupMonthlySalaryComponent } from '../popup-monthly-salary/popup-monthly-salary.component';
import _ from 'lodash';

@Component({
  selector: 'app-new-monthly-salary',
  templateUrl: './new-monthly-salary.component.html',
  styleUrl: './new-monthly-salary.component.css'
})

export class NewMonthlySalaryComponent {
  allEmployeeDataSource!: MatTableDataSource<any>;
  filteredDataSource!: MatTableDataSource<any>;
  allEmployeeData!: MatTableDataSource<any>;
  employeeTableColumns: string[] = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'officeName', 'totalEarning', 'totaltotalDeductions', 'netPay', 'action'];
  @ViewChild(MatSelect) matSelect!: MatSelect;
  totalEarningtotal: any;
  panelOpenState: boolean = false;
  employeeList: any = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  voucherNo: any;
  date: any
  empId: any
  role: string;
  buttonType: string;
  payRollDet: any;
  nid = null;
  submit: boolean
  approve: boolean
  selectedOption: string = 'Monthly Salary'; // Initially no option is selected
  empList: any
  totalDeduction: any;
  financialDate: Date;
  formattedDate: string;
  currentDate = new Date();
  remarksForm: FormGroup
  salaryForm: FormGroup
  employeeSelect = new FormControl();
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  totalEarning = 0
  totalDeductions = 0
  totalNetpay = 0
  minDate: string;
  maxDate: string;
  dropdownOptions: string[] = ['Pay Arrear', 'DA Arrear', 'Monthly Salary', 'Supplementary Salary', 'EL Surrender'];

  constructor(private matDialog: MatDialog, private apiCall: ApiService, private fb: FormBuilder, private snackbar: MatSnackBar, private numberingService: NumberingService, private datePipe: DatePipe, private toastr: ToastrService, private router: Router) {

    this.filteredDataSource = new MatTableDataSource<any>([]);

    let todayDate = this.datePipe.transform(this.currentDate, 'dd-MM-yyyy');
    // this.remarksForm.patchValue({ date: todayDate });
    this.salaryForm = this.fb.group({
      voucherNo: ['', Validators.required],
      date: new FormControl(todayDate),
      empId: ['', Validators.required],
    });

    // this.voucherNo = this.numberingService.getNextNumber();
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
    this.getEmpList()
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
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'employeeId',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

  onItemSelect(item: any) {
    let filterValue = item.employeeId
    this.allEmployeeDataSource.filter = filterValue.trim().toLowerCase();
  }
  onSelectAll(items: any) {
    let filterValue = items.employeeId
    this.allEmployeeDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterData(event: any) {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length > 0) {
      this.filteredDataSource.data = this.allEmployeeDataSource.data.filter(employee => filterValue.includes(employee.employeeId));
    } else {
      // If no options are selected, display all data
      this.filteredDataSource.data = this.allEmployeeDataSource.data;
    }
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
  }

  uniqueOfficeNames: any[] = [];

  getEmpList(): void {
    this.apiCall.getSalariesVary("EmployeeDataBasedOn-paymentStatus", 'Yes').subscribe((data: any) => {
      this.payRollDet = data
      const officeNames = this.payRollDet.map(employee => employee.officeName);
      const uniqueOfficeNamesSet = new Set(officeNames);
      this.uniqueOfficeNames = Array.from(uniqueOfficeNamesSet);
      console.log(this.uniqueOfficeNames);

      this.allEmployeeDataSource = new MatTableDataSource(this.payRollDet);
      // this.filteredDataSource = new MatTableDataSource(this.payRollDet);

      const modifiedData = []; // Create a new array to hold modified data

      this.payRollDet.forEach(element => {
        let getData = { ...element }; // Clone the element
        if (getData.employeeId != '' && getData.employeeId != null && getData.employeeId != undefined) {
          getData.parseEmployeeId = typeof getData.employeeId == 'string' ? parseInt(getData.employeeId) : getData.employeeId;
        }
        modifiedData.push(getData); // Push modified data into new array
      });

      this.filteredDataSource.data = _.orderBy(modifiedData, ['parseEmployeeId'], ['asc', 'asc']);

      this.dataLength = this.payRollDet.length
      this.allEmployeeData = new MatTableDataSource(this.payRollDet);
      this.getTotal();
      this.getTotal_Deduct()
      this.getTotal_Netpay()
    })
  }

  getTotal() {
    this.totalEarningtotal = this.filteredDataSource.data.map(t => t.totalEarning).reduce((acc, value) => acc + value, 0);
  }

  getTotal_Deduct() {
    this.totalDeduction = this.filteredDataSource.data.map(t => t.totalDeductions).reduce((acc, value) => acc + value, 0);
  }

  getTotal_Netpay() {
    this.totalNetpay = this.filteredDataSource.data.map(t => t.netPay).reduce((acc, value) => acc + value, 0);
  }

  selectAll = false; // Variable to track whether "Select All" is selected
  searchTerm: string;
  selectedEmployeeIds: string[] = [];
  dataLength: any
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
    console.log(this.filteredDataSource.data, "this.filteredDataSource.data")
    this.getTotal();
    this.getTotal_Deduct();
    this.getTotal_Netpay();
  }

  applyTableDivisionFilter(event) {
    const selectedDivisions: any = event.value;
    if (selectedDivisions && selectedDivisions.length > 0) {
      this.filteredDataSource.data = this.allEmployeeData.data.filter(employee => selectedDivisions.includes(employee.officeName));
    } else {
      // If no options are selected, display all data
      this.filteredDataSource.data = this.allEmployeeDataSource.data;
    }
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
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
    this.day = parts[0];
    this.month = parts[1];
    this.year = parts[2];
    console.log(this.day, this.month, this.year)
  }

  postNewEmployee(type) {
    console.log(this.formattedDate, "finance date")
    if (this.payRollDet && this.formattedDate != undefined) {
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
        "totalEarning": this.totalEarningtotal,
        "totalDeductions": this.totalDeduction,
        "netPay": this.totalNetpay,
        "finacionalYearDate": this.formattedDate,
        "year": this.year,
        "month": this.month,
        "day": this.day,
        "paymentType": this.selectedOption

      }
      console.log(payload, "payload")
      this.apiCall.apiPostCall(payload,'saveMonthlySalary').subscribe(data => {
        console.log(data, "data")
        if (data.status) {
          this.toastr.success(" Details Saved Successfully");
          this.router.navigate(['/payroll/monthlysalary/']);
        } else {
          this.toastr.error("Something Went Wrong");
        }
      })
    } else {
      this.toastr.error("Please Choose Date")
    }
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

  openDialog(type, id) {
    const dialogRef = this.matDialog.open(PopupMonthlySalaryComponent, {
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

}
