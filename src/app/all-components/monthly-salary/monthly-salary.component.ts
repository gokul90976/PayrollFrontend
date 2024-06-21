import { Component, OnInit, ViewChild } from '@angular/core';
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
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-monthly-salary',
  templateUrl: './monthly-salary.component.html',
  styleUrl: './monthly-salary.component.css',
})
export class MonthlySalaryComponent implements OnInit {

  panelOpenState = false;
  isDisabled = true

  allApplicationDataSource = new MatTableDataSource<any>([]);
  // allApplicationDataSource = data;
  schemesTableColumns: string[] = ['sno', 'voucherNo', 'paymentType', 'month', 'total_earning', 'total_deductions', 'net_salary', 'ACTION', 'status'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  allDatas: any;
  monthlyData: any[];
  yearData: any;
  selectedOption: string;
  excelData: any[]

  ngAfterViewInit() {
    this.allApplicationDataSource.paginator = this.paginator;
  }


  assitantForms: FormGroup;
  divisionAsstForm: FormGroup;
  aoForm: FormGroup;
  dcaoForm: FormGroup
  faForm: FormGroup
  years: number[] = [];
  role: string;
  @ViewChild(MatSelect) matSelect!: MatSelect;
  Months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(private apiCall: ApiService, private router: Router, public dialog: MatDialog, private snackbar: MatSnackBar, private fb: FormBuilder) {

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      this.years.push(i);
    }
    console.log(this.years, "years")

  }

  ngOnInit(): void {
    this.assitantForms = this.fb.group({
      remark: [''],
      signature: [''],
      date: ['']
    })
    this.divisionAsstForm = this.fb.group({
      remark: [''],
      signature: [''],
      date: ['']
    })
    this.aoForm = this.fb.group({
      remark: [''],
      signature: [''],
      date: ['']
    })
    this.dcaoForm = this.fb.group({
      remark: [''],
      bankCode: [''],
      signature: [''],
      date: ['']
    })
    this.faForm = this.fb.group({
      remark: [''],
      signature: [''],
      date: ['']
    })

    this.role = sessionStorage.getItem('userName');
    this.getMonSalList()

  }



  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  filteredDataSource!: MatTableDataSource<[]>;

  getMonSalList(): void {

    const payload = {
      "id": 1
    }

    this.apiCall.apiPostCall(payload, 'getAllMonthlySalary').subscribe(data => {
      this.allApplicationDataSource.data = data.data;
      this.monthlyData = this.allApplicationDataSource.data
      this.allApplicationDataSource = new MatTableDataSource(this.monthlyData);
      console.log(this.allApplicationDataSource, "106")
      this.filteredDataSource = new MatTableDataSource(this.monthlyData);
      console.log(this.filteredDataSource, "109")

      if (this.role == 'DCAO') {
        this.allApplicationDataSource.data = this.allApplicationDataSource.data.filter(scheme => {
          return scheme.statusDCAO === 'Approved' || scheme.statusDCAO === 'Pending' || scheme.statusDCAO === 'Active';
        });
      } else if (this.role == 'FA') {
        this.allApplicationDataSource.data = this.allApplicationDataSource.data.filter(scheme => {
          return scheme.statusFA === 'Approved' || scheme.statusFA === 'Pending';
        });
      }
      this.allDatas = this.allApplicationDataSource.data
      console.log(this.allDatas, "data")
    })
  }

  edit(type, id) {
    this.router.navigate(['/payroll/daMonthlysalaryEdit/' + type, id]);
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
            this.getMonSalList();
          }
        })
      }
    })
  }

  filterDataSearch(event: any) {
    console.log(event)
    let filterValue: any = event.target.value
    console.log(filterValue)
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDataSearchDCAO(event: any) {
    console.log(event)
    let filterValue: any = event.target.value
    console.log(filterValue)
    this.allApplicationDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDataSearchFA(event: any) {
    console.log(event)
    let filterValue: any = event.target.value
    console.log(filterValue)
    this.allApplicationDataSource.filter = filterValue.trim().toLowerCase();
  }

  yearFilterdata: any = []

  onYearSelect() {
    const selectedYear = this.matSelect.value;
    console.log(selectedYear, "selectedYear")
    if (selectedYear != '') {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
    let filterValue = selectedYear.toString()
    console.log(this.allApplicationDataSource.data, "this.allApplicationDataSource.data",filterValue)
    if (filterValue && filterValue.length > 0) {
      this.filteredDataSource.data = this.allApplicationDataSource.data.filter(data => filterValue.includes(data.year));
      console.log(this.filteredDataSource.data, "fdgd")
      // this.allDatas
      this.yearFilterdata = this.filteredDataSource.data
      console.log(this.yearFilterdata, "year")

    } else {
      // If no options are selected, display all data
      this.filteredDataSource.data = this.allApplicationDataSource.data;
    }
  }

  selectedMonths: any[] = [];

  onMonthSelect() {
    const selectedMonth = this.selectedMonths;
    console.log(selectedMonth, "selectedMonth")
    let filterValue = selectedMonth.toString()
    console.log(filterValue, "filterValue")
    if (selectedMonth && selectedMonth.length > 0) {
      this.filteredDataSource.data = this.yearFilterdata.filter(data => selectedMonth.includes(data.month));
      console.log(this.filteredDataSource.data)
    } else {
      // If no options are selected, display all data

      this.filteredDataSource.data = this.yearFilterdata;
      console.log(this.filteredDataSource.data, "months")
    }
  }


  downloadPDF() {
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
      fileName = 'Salaries Lists';
      headerName = [
        'S.No',
        'Paybill No',
        'Payment Type',
        'Financial Year & Date',
        'Total Earning',
        'Total Deductions',
        'Net Salary',
      ];

      this.filteredDataSource.data.forEach((element:any, index:any) => {
        let data = [
          index + 1,
          element.voucherNo,
          element.paymentType,
          element.finacionalYearDate,
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

  downloadExcel(): void {
    this.excelData = this.filteredDataSource.data.map((item:any, index:any) => ({
      'S.No': index + 1,
      'Paybill No ': item.voucherNo,
      'Payment Type': item.paymentType,
      'Financial Year & Date': item.finacionalYearDate,
      'Total Earning': item.totalEarning,
      'Total Deductions': item.totalDeductions,
      'Net Salary': item.netPay,

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
}
