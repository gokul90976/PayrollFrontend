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
import { ArrearFieldsComponent } from '../arrear-fields/arrear-fields.component';
import { PopupMonthlySalaryComponent } from '../popup-monthly-salary/popup-monthly-salary.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-arrear',
  templateUrl: './arrear.component.html',
  styleUrl: './arrear.component.css'
})

export class ArrearComponent {
  allEmployeeDataSource!: MatTableDataSource<any>;
  // filteredDataSource!: MatTableDataSource<any>;
  filteredDataSource: any[] = [];
  employeeTableColumns: string[] = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'officeName', 'totalEarning', 'totaltotalDeductions', 'netPay', 'action'];
  @ViewChild(MatSelect) matSelect!: MatSelect;
  // totalEarningtotal: any;
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
  selectedOption: string = 'Pay Arrear'; // Initially no option is selected
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
  toBeDrawnTotal: any
  alreadyDrawnTotal: any
  differenceTotal: any
  totalEarning = 0
  totalDeductions = 0
  totalNetpay = 0
  minDate: string;
  maxDate: string;
  dropdownOptions: string[] = ['Pay Arrear', 'DA Arrear', 'Monthly Salary', 'Supplementary Salary', 'EL Surrender'];
  day: string;
  month: string;
  year: string;
  // ngAfterViewInit() {
  //   this.allEmployeeDataSource.paginator = this.paginator;
  // }

  constructor(private matDialog: MatDialog, private apiCall: ApiService, private fb: FormBuilder, private snackbar: MatSnackBar, private numberingService: NumberingService, private datePipe: DatePipe, private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService) {

    let todayDate = this.datePipe.transform(this.currentDate, 'dd-MM-yyyy');
    // this.remarksForm.patchValue({ date: todayDate });
    this.salaryForm = this.fb.group({
      voucherNo: ['', Validators.required],
      date: new FormControl(todayDate),
      empId: ['', Validators.required],
    });
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

    this.filteredDataSource = [];
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
      this.filteredDataSource = this.allEmployeeDataSource.data.filter(employee => filterValue.includes(employee.employeeId));
    } else {
      // If no options are selected, display all data
      this.filteredDataSource = this.allEmployeeDataSource.data;
    }
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
  }

  payrollDatas: any
  uniqueOfficeNames: any[] = [];

  getEmpList(): void {
    console.log("get emplist")
    this.spinner.show()
    const payload = { id: 1 }
    this.apiCall.apiPostCall(payload, 'getAllEmployeePayRoll').subscribe(data => {
      // this.payRollDet = data.data
      this.payrollDatas = data.data
      // this.allEmployeeDataSource = new MatTableDataSource(this.payRollDet);
      // this.filteredDataSource = new MatTableDataSource(this.payRollDet);
    })

    this.apiCall.personel_apiPostCall({ id: 1 }, 'getAllPayRollDetails').subscribe(async response => {
      this.personalDatas = response['data'];

      const mergedData = this.payrollDatas.map(personalItem => {
        const correspondingPayrollItem = this.personalDatas.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
        return {
          ...correspondingPayrollItem,
          ...personalItem,
        };
      });
      this.payRollDet = mergedData;
      console.log(this.payRollDet, "1811111")
      this.allEmployeeDataSource = new MatTableDataSource(this.payRollDet);
      // this.filteredDataSource = new MatTableDataSource(this.payRollDet);
      this.spinner.hide()

    })
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
  }

  openDialog(type, id, name, designationName, officeName, voucherNo, ofcCode, joingDate) {
    console.log(type, id, name, designationName, officeName, voucherNo, ofcCode, joingDate)
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
        console.log(data, "data")
        this.payRollDet = data
        this.filteredDataSource = data
        console.log(this.filteredDataSource)
        this.getTotal();
        this.getTotal_Deduct()
        this.getTotal_Netpay()
      }
    })
  }

  getTotal() {
    this.toBeDrawnTotal = this.filteredDataSource.map(t => t.totalEarning).reduce((acc, value) => acc + value, 0);
  }

  getTotal_Deduct() {
    this.alreadyDrawnTotal = this.filteredDataSource.map(t => t.totalDeductions).reduce((acc, value) => acc + value, 0);
  }

  getTotal_Netpay() {
    this.differenceTotal = this.filteredDataSource.map(t => t.netPay).reduce((acc, value) => acc + value, 0);
  }

  applyTableDivisionFilter(event) {
    console.log(this.allEmployeeDataSource.data, "employee source")
    const selectedDivisions: any = event.value;
    console.log(selectedDivisions, "selectedDivisions")
    if (selectedDivisions && selectedDivisions.length > 0) {
      this.filteredDataSource = this.tableDataSource.filter(employee => selectedDivisions.includes(employee.officeName));
    } else {
      this.filteredDataSource = this.tableDataSource;
    }
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
  }

  selectAll = false; // Variable to track whether "Select All" is selected
  personalEmpData: any
  applySearchFilter(event: any) {
    let searchValue = event.target.value
    if (searchValue == '') {
      this.filteredDataSource = [];
    } else {
      let filterValue = this.allEmployeeDataSource.data.filter(employee => {
        // Filter by employee ID
        const employeeIdMatch = employee.employeeId.toLowerCase().includes(searchValue.toLowerCase());
        return employeeIdMatch;
      });
      const payload = {
        "employeeId": searchValue
      }
      this.apiCall.personel_apiPostCall(payload, 'getPayRollDetailsByEmpId').subscribe((data: any) => {
        this.personalEmpData = data.data
        let personalArray = [this.personalEmpData]
        const mergedData = personalArray.map(personalItem => {
          const correspondingPayrollItem = filterValue.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
          return {
            ...correspondingPayrollItem,
            ...personalItem,
          };
        });
        this.filteredDataSource = mergedData
        this.getTotal();
        this.getTotal_Deduct();
        this.getTotal_Netpay();
      })
    }
  }

  personalData: any
  personalDatas: any
  payrollDetails: any
  tableDataSource:any
  applyTableEmpIdFilter(event) {
    const selectedEmployeeIds = event.value;
    if (!selectedEmployeeIds || selectedEmployeeIds.includes('selectAll')) {
      // If 'selectAll' is selected or no options are selected, display all data
      this.spinner.show()
      // this.filteredDataSource = this.allEmployeeDataSource.data;
      this.payrollDetails = this.allEmployeeDataSource.data;
      this.apiCall.personel_apiPostCall({ id: 1 }, 'getAllPayRollDetails').subscribe(async response => {
        this.personalDatas = response['data'];

        const mergedData = this.payrollDetails.map(personalItem => {
          const correspondingPayrollItem = this.personalDatas.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
          return {
            ...correspondingPayrollItem,
            ...personalItem,
          };
        });
        this.filteredDataSource = mergedData;
        console.log(this.filteredDataSource, "filterdata")
          const officeNames = this.filteredDataSource.map(employee => employee.officeName);
      const uniqueOfficeNamesSet = new Set(officeNames);
      this.uniqueOfficeNames = Array.from(uniqueOfficeNamesSet);
      console.log(this.uniqueOfficeNames);

        this.spinner.hide()
        this.getTotal();
        this.getTotal_Deduct();
        this.getTotal_Netpay();
      })
    } else if (selectedEmployeeIds.length === 0) {
      // If no specific IDs are selected, clear the data
      this.filteredDataSource = [];
    } else {
      this.apiCall.apiPostCall(selectedEmployeeIds, 'getEmployeeData').subscribe(res => {
        let employeeData = res.data;
        let filterIdData = employeeData.filter(employee => selectedEmployeeIds.includes(employee.employeeId));
        this.apiCall.personel_apiPostCall(selectedEmployeeIds, "getPayRollDetailsByEmploeeData").subscribe(res => {
          this.personalData = res.data;
          const mergedData = this.personalData.map(personalItem => {
            const correspondingPayrollItem = filterIdData.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
            return {
              ...correspondingPayrollItem,
              ...personalItem,
            };
          });
          this.filteredDataSource = mergedData;
          this.tableDataSource = mergedData
          console.log(this.filteredDataSource, "uyguyguvg")
          const officeNames = this.filteredDataSource.map(employee => employee.officeName);
          const uniqueOfficeNamesSet = new Set(officeNames);
          this.uniqueOfficeNames = Array.from(uniqueOfficeNamesSet);
          console.log(this.uniqueOfficeNames);
          this.getTotal();
          this.getTotal_Deduct();
          this.getTotal_Netpay();
        });
      });
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

  postNewEmployee(type) {
    if (this.payRollDet && this.formattedDate != undefined) {
      this.spinner.show();

      const empData = {}
      const payload = {
        "voucherNo": this.voucherNo,
        "employeeTableData": this.filteredDataSource,
        "remarksforDA": this.remarksForm.controls['remarksforDA'].value,
        "signature": this.remarksForm.controls['signature'].value,
        "date": this.remarksForm.controls['date'].value,
        "statusDA": "Active",
        "statusAO": "Pending",
        "statusDCAO": "",
        "statusFA": "",
        "totalEarning": this.toBeDrawnTotal,
        "totalDeductions": this.alreadyDrawnTotal,
        "netPay": this.differenceTotal,
        "finacionalYearDate": this.formattedDate,
        "year": this.year,
        "month": this.month,
        "day": this.day,
        "paymentType": this.selectedOption
      }
      this.apiCall.apiPostCall(payload, 'saveMonthlySalary').subscribe(data => {
        if (data.status) {

          // this.apiCall.apiPostCall(payload,'').subscribe((res:any) => {

          // })
          this.toastr.success(" Details Saved Successfully");
          this.router.navigate(['/payroll/monthlysalary/']);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.error("Something Went Wrong");
        }
      })
    } else {
      this.snackbar.openFromComponent(SnackbarComponent, {
        data: 'Details are empty, Please Choose Date',
      });
    }
  }

  optionClicked(event: any) {
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

