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
import { DaArrearFieldsComponent } from '../da-arrear-fields/da-arrear-fields.component';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import _ from 'lodash';

@Component({
  selector: 'app-da-arrear',
  templateUrl: './da-arrear.component.html',
  styleUrl: './da-arrear.component.css'
})
export class DaArrearComponent {
  allEmployeeDataSource!: MatTableDataSource<any>;
  filteredDataSource: any[] = [];
  allEmployeeData: any[] = [];
  daDatas: any[] = [];
  displayedColumns: string[] = ['Sno', 'employeeId', 'employeeName', 'designationCode', 'designationName'];
  // filteredDataSource = new MatTableDataSource<any>();
  // filteredDataSource = new MatTableDataSource<any>();
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
  selectedOption: string = 'DA Arrear'; // Initially no option is selected
  empList: any
  totalDeduction: any;
  financialDate: Date;
  formattedDate: string;
  currentDate = new Date();
  remarksForm: FormGroup
  salaryForm: FormGroup
  fieldchooseForm: FormGroup
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
  day: string;
  month: string;
  year: string;
  dateForm: FormGroup;
  daForm: FormGroup;
  form: FormGroup;
  isDisabled: boolean = true

  // ngAfterViewInit() {
  //   this.allEmployeeDataSource.paginator = this.paginator;
  // }

  constructor(private matDialog: MatDialog, private apiCall: ApiService, private fb: FormBuilder, private snackbar: MatSnackBar, private numberingService: NumberingService, private datePipe: DatePipe, private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService) {

    let todayDate = this.datePipe.transform(this.currentDate, 'dd-MM-yyyy');
   
    this.salaryForm = this.fb.group({
      voucherNo: ['', Validators.required],
      date: new FormControl(todayDate),
      empId: ['', Validators.required],
    });
    // this.voucherNo = this.numberingService.getNextNumber();
    this.apiCall.apiGetCall('next-nid-sequence').subscribe((seqNo: any) => {
      this.voucherNo = seqNo
    })
    this.filteredDataSource = [];

    const today = new Date();
    this.minDate = this.formatDateCUrr(today); 
    this.maxDate = this.formatDateCUrr(today);
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

    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      daDifference: ['', Validators.required]
    });

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

  formatDateCUrr(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const dd = String(date.getDate()).padStart(2, '0');
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

  dynamicColumns: any[] = [];

  employeeIds: any
  onSubmit() {
    this.spinner.show()
    const formValues = this.form.value;
    const formattedFromDate = this.formatDate(formValues.fromDate);
    const formattedToDate = this.formatDate(formValues.toDate);
    const daDifference = this.form.value.daDifference;

    this.apiCall.getDaData('employee-details', formattedFromDate, formattedToDate, daDifference).subscribe((res: any) => {
      console.log(res, "API Response");
      this.daDatas = res.data[0].data;
      console.log(this.daDatas, "da Datas")
      if (res.status) {
        this.generateDynamicColumns();
        this.calculateGrossTotal(); // Calculate grossTotal
        this.calculateCpsAndNetTotal(); // Calculate CPS and netTotal
        this.allEmployeeData = this.daDatas
        this.tableDataSource = this.daDatas
        console.log(this.filteredDataSource, "Filtered Data Source");

        const modifiedData = []; // Create a new array to hold modified data

        this.daDatas.forEach(element => {
          let getData = { ...element }; // Clone the element
          if (getData.employeeId != '' && getData.employeeId != null && getData.employeeId != undefined) {
            getData.parseEmployeeId = typeof getData.employeeId == 'string' ? parseInt(getData.employeeId) : getData.employeeId;
          }
          modifiedData.push(getData); // Push modified data into new array
        });
  
        this.filteredDataSource = _.orderBy(modifiedData, ['parseEmployeeId'], ['asc', 'asc']);

        const officeNames = this.filteredDataSource.map(employee => employee.designationName);
        const uniqueOfficeNamesSet = new Set(officeNames);
        this.uniqueOfficeNames = Array.from(uniqueOfficeNamesSet);
        console.log(this.uniqueOfficeNames);
        
        this.employeeIds = this.filteredDataSource.map(employee => employee.employeeId);
        console.log(this.employeeIds); // Output: ["20015", "10326"]
        this.isDisabled = false
        this.toastr.success("Data Fetched Successfully")
        this.spinner.hide()

      } else {
        this.isDisabled = false
        this.toastr.error("Something went Wrong")
        this.spinner.hide()

      }

      this.getTotal();
      this.getTotal_Deduct()
      this.getTotal_Netpay()
    });
  }

  resetTodate() {
    this.form.get('toDate')!.reset();
    this.isDisabled = true
    this.filteredDataSource = []
    this.getTotal();
    this.getTotal_Deduct();
    this.getTotal_Netpay();
  }

  filterByEmployeeId(event: any) {
    const selectedIds = event.value; // Get the selected IDs array
    console.log(selectedIds, "Selected IDs"); // Debugging log

    if (selectedIds && selectedIds.length > 0) {
      if (selectedIds.includes('selectAll')) {
        // If "All" is selected, set filteredDataSource to allEmployeeData
        this.filteredDataSource = this.allEmployeeData.slice(); // Copy the array to avoid mutating the original
      } else {
        // Filter based on selected IDs
        this.filteredDataSource = this.allEmployeeData.filter(employee => selectedIds.includes(employee.employeeId));
      }
    } else {
      // If no IDs are selected, reset filteredDataSource
      this.filteredDataSource = this.allEmployeeData.slice(); // Reset to the original data
      this.onSubmit();
    }

    // Recalculate totals
    this.getTotal();
    this.getTotal_Deduct();
    this.getTotal_Netpay();
  }


  applySearchFilter(event: any) {
    let searchValue = event.target.value
    console.log(searchValue, "searchValue")
    if (searchValue == '') {
      this.filteredDataSource = this.allEmployeeData.slice(); // Reset to the original data
      this.onSubmit();
    } else {
      // this.filteredDataSource = this.allEmployeeDataSource.data.filter(employee => {
      this.findData = this.allEmployeeData.filter(employee => {

        // Filter by employee ID
        const employeeIdMatch = employee.employeeId.toLowerCase().includes(searchValue.toLowerCase());
        return employeeIdMatch;
      });
      console.log(this.findData, "this.findData")
      const payload = {
        "employeeId": searchValue
      }
      this.apiCall.personel_apiPostCall(payload, 'getPayRollDetailsByEmpId').subscribe(response => {
        console.log(response, "response")
        this.personalEmployees = response.data
        console.log(this.personalEmployees, "this.personalEmployees");
        let arrayData = [this.personalEmployees]
        const mergedData = arrayData.map(personalItem => {
          const correspondingPayrollItem = this.findData.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
          return {
            ...correspondingPayrollItem,
            ...personalItem,
          };
        })
        this.filteredDataSource = mergedData
        console.log(mergedData, "mergedData")
      })
    }
    this.getTotal();
    this.getTotal_Deduct();
    this.getTotal_Netpay();
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
        element['cps'] = Math.round(element.grossTotal * 0.1);
        console.log(element['cps'], "cpssss")
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

  getEmpList(): void {
    console.log("get emplist")
    // this.spinner.show()
    const payload = { id: 1 }
    this.apiCall.apiPostCall(payload, 'getAllEmployeePayRoll').subscribe(data => {
      this.payrollDatas = data.data
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
      console.log(this.payrollDatas, "1811111")


      this.allEmployeeDataSource = new MatTableDataSource(this.payRollDet);
      // this.filteredDataSource = new MatTableDataSource(this.payRollDet);
      // this.spinner.hide()
    })
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()
  }

  openDialog(type, id, name, designationCode, officeName, pfcps, basicPay, personalPay, voucherNo) {
    const dialogRef = this.matDialog.open(DaArrearFieldsComponent, {
      width: 'auto',
      height: 'autos',
      maxHeight: '45vw',
      data: {
        type: type,
        empId: id,
        empName: name,
        desgCode: designationCode,
        ofcName: officeName,
        pfcps: pfcps,
        basicPay: basicPay,
        personalPay: personalPay,
        voucherNo: voucherNo
      }
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.payRollDet = data
        console.log(this.payRollDet)
        this.filteredDataSource = this.payRollDet
        this.getTotal();
        this.getTotal_Deduct();
        this.getTotal_Netpay();
      }
    })
  }

  getTotal() {
    this.totalEarningtotal = this.filteredDataSource.map(t => t.grossTotal).reduce((acc, value) => acc + value, 0);
  }

  getTotal_Deduct() {
    this.totalDeduction = this.filteredDataSource.map(t => t.cps).reduce((acc, value) => acc + value, 0);
  }

  getTotal_Netpay() {
    this.totalNetpay = this.filteredDataSource.map(t => t.netTotal).reduce((acc, value) => acc + value, 0);
  }

  applyTableDivisionFilter(event) {
    const selectedDivisions: any = event.value;
    console.log(this.tableDataSource,"this.tableDataSource")
    if (selectedDivisions && selectedDivisions.length > 0) {
      this.filteredDataSource = this.tableDataSource.filter(employee => selectedDivisions.includes(employee.designationName));
    } else {
      // If no options are selected, display all data
      // this.filteredDataSource = this.allEmployeeDataSource.data;
      this.filteredDataSource = this.tableDataSource;
    }
    this.getTotal();
    this.getTotal_Deduct()
    this.getTotal_Netpay()  
  }

  selectAll = false; // Variable to track whether "Select All" is selected
  personalEmployees: any
  findData: any


  personalData: any
  personalDatas: any
  payrollDetails: any
  tableDataSource:any
  uniqueOfficeNames: any[] = [];

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

        const officeNames = this.filteredDataSource.map(employee => employee.designationName);
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
      this.apiCall.apiPostCall(selectedEmployeeIds, 'getDaEmployeeData').subscribe(res => {
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

          const officeNames = this.filteredDataSource.map(employee => employee.designationName);
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
    const empData = {}
    if (this.payRollDet && this.formattedDate != undefined) {
      this.spinner.show()
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
        "totalEarning": this.totalEarningtotal,
        "totalDeductions": this.totalDeduction,
        "netPay": this.totalNetpay,
        "finacionalYearDate": this.formattedDate,
        "year": this.year,
        "month": this.month,
        "day": this.day,
        "paymentType": this.selectedOption,
        "from": this.form.controls['fromDate'].value,
        "to": this.form.controls['toDate'].value,
        "daDiff": this.form.controls['daDifference'].value,
      }

      console.log(payload, "payloadpayloadpayload")
      this.apiCall.apiPostCall(payload, 'saveMonthlySalary').subscribe(data => {
        if (data.status) {

          // this.apiCall.apiPostCall(payload,'').subscribe((res:any) => {

          // })
          this.toastr.success(" Details Saved Successfully");
          this.router.navigate(['/payroll/monthlysalary/']);
          this.spinner.hide()

        } else {
          this.spinner.hide()
          this.toastr.error("Something Went Wrong");
        }
      })
    } else {
      this.toastr.error("Please Choose Date")
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