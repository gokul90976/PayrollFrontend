import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-recoveryadditions',
  templateUrl: './recoveryadditions.component.html',
  styleUrl: './recoveryadditions.component.css'
})
export class RecoveryadditionsComponent {
  allRecoveryadditionDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  currentPageOffset = 0;
  RecoveryadditionTableColumns: string[] = ['Sno', 'Empid', 'Empname', 'Bp', 'recoriesList', 'totalDemand', 'ACTION'];
  excelData: any[]

  ngAfterViewInit() {
    this.allRecoveryadditionDataSource.paginator = this.paginator;
  }

  getSno(recoveryadditions, index) {
    return index + 1 + this.currentPageOffset * this.paginator.pageSize;
  }

  constructor(private apiCall: ApiService, private router: Router, public dialog: MatDialog, private snackbar: MatSnackBar, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getRecList()
  }

  personalDatas: any
  recoveryDatas: any
  getRecList(): void {
    this.spinner.show()
    const payload = {}
    this.apiCall.apiPostCall(payload, 'getAllRecoveryData').subscribe(data => {
      // this.allRecoveryadditionDataSource.data = data.data;
      this.recoveryDatas = data.data;

      console.log(this.recoveryDatas, "recoverydata")

      // const employeeIds = this.recoveryDatas.map(item => item.employeeId);

      // console.log(employeeIds);
    })

    this.apiCall.personel_apiPostCall({ id: 1 }, 'getAllPayRollDetails').subscribe(data => {
      this.personalDatas = data.data;
      console.log(this.personalDatas, "personaldata")

      if (this.recoveryDatas) {
        const mergedData = this.recoveryDatas.map(recoveryItem => {
          const correspondingPayrollItem = this.personalDatas.find(payrollItem => payrollItem.employeeId === recoveryItem.employeeId);
          return {
            ...correspondingPayrollItem,
            ...recoveryItem,
          };
        });
        this.allRecoveryadditionDataSource.data = mergedData;
        this.spinner.hide()
        console.log(mergedData);
        console.log(this.allRecoveryadditionDataSource.data, "fgbdfg")
      } else {
        console.log("Recovery data is undefined or null");
        this.spinner.hide()
      }

    })
  }

  edit(type, id, empId) {
    this.router.navigate(['/payroll/newrecoveryaddition/' + type, id, empId]);
  }

  filterData(event: any) {
    let filterValue = event.target.value
    this.allRecoveryadditionDataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(empValue) {
    console.log(empValue, "empValue")
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        from: "delete",
      }
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        const payload = {
          "recoveryId": empValue.recoveryId
        }
        this.apiCall.apiPostCall(payload, 'deleteRecoveryDataAndAddById').subscribe(response => {
          if (response.message.includes('Succesfully')) {
            this.toastr.error("Deleted Successfully")
            this.getRecList();
          }
        })
      }
    })
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
      fileName = 'Concessional Percentages';
      headerName = [
        'S.No',
        'Emp ID',
        'Emp Name',
        'Basic Pay',
        'Recoveries List',
        'Total Demand',
      ];

      this.allRecoveryadditionDataSource.data.forEach((element, index) => {
        const recoveriesList = element.recoveryDataAdd.map(recovery => recovery.recovery).join(', ');
        const totalDemand = element.recoveryDataAdd.map(recovery => recovery.totalDemand).join(', ');
        let data = [
          index + 1,
          element.employeeId,
          element.employeeName,
          element.basicPay,
          recoveriesList,
          totalDemand,
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
    this.excelData = this.allRecoveryadditionDataSource.data.map((item, index) => {
      const recoveriesList = item.recoveryDataAdd.map(recovery => recovery.recovery).join(', ');
      const totalDemand = item.recoveryDataAdd.map(recovery => recovery.totalDemand).join(', ');

      return {
        'S.No': index + 1,
        'Emp ID': item.employeeId,
        'Emp Name': item.employeeName,
        'Basic Pay': item.basicPay,
        'Recoveries List': recoveriesList,
        'Total Demand': totalDemand,
      };
    });

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
    FileSaver.saveAs(data, 'Recovery Addition Lists.xlsx');
  }

}
