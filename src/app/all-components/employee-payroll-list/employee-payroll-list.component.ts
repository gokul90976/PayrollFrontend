import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatSort } from '@angular/material/sort';
import _ from 'lodash';

@Component({
  selector: 'app-employee-payroll-list',
  templateUrl: './employee-payroll-list.component.html',
  styleUrl: './employee-payroll-list.component.css'
})

export class EmployeePayrollListComponent implements OnInit {

  allDatas = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['Sno', 'Date', 'Empcode', 'Empname', 'designationName', 'GrossPay', 'Deductions', 'ACTION'];
  id: any

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  payrollData: any;
  combinedArray = [];
  allEmployeePayrollListDataSource: any
  saved: boolean
  personalDatas: any
  originalData: any[] = [];

 

  constructor(private apiCall: ApiService, private router: Router, public dialog: MatDialog, private snackbar: MatSnackBar, private spinner: NgxSpinnerService) {
    this.allDatas = new MatTableDataSource<any>([]);
    this.getEmpList()
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    // this.calculateMonthsFromDate('01-03-1996', 148)
  }
  
  ngAfterViewInit() {
    // this.allDatas.paginator = this.paginator;
    this.allDatas.sort = this.sort;

  }

  async getEmpList() {
    this.spinner.show();
    const payload = { 'id': 1 }
    this.apiCall.apiPostCall(payload, 'getAllEmployeePayRoll').subscribe(data => {
      this.payrollData = data.data;
    })
    await this.apiCall.personel_apiPostCall({ id: 1 }, 'getAllPayRollDetails').subscribe(async response => {
      // this.allDatas = response['data'];
      this.personalDatas = response['data'];
      this.spinner.hide();
      const mergedData = this.personalDatas.map(personalItem => {
        const correspondingPayrollItem = this.payrollData.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
        return {
          ...correspondingPayrollItem,
          ...personalItem,
        };
      });

      const modifiedData = []; // Create a new array to hold modified data

      mergedData.forEach(element => {
        let getData = { ...element }; // Clone the element
        if (getData.officeCode != '' && getData.officeCode != null && getData.officeCode != undefined) {
          getData.parseofficeCode = typeof getData.officeCode == 'string' ? parseInt(getData.officeCode) : getData.officeCode;
        }
        if (getData.employeeId != '' && getData.employeeId != null && getData.employeeId != undefined) {
          getData.parseEmployeeId = typeof getData.employeeId == 'string' ? parseInt(getData.employeeId) : getData.employeeId;
        }
        modifiedData.push(getData); // Push modified data into new array
      });

      this.allDatas.data = _.orderBy(modifiedData, ['parseofficeCode', 'parseEmployeeId'], ['asc', 'asc']);
      console.log(this.allDatas.data, "alldatasss");
      this.originalData = _.orderBy(modifiedData, ['parseofficeCode', 'parseEmployeeId'], ['asc', 'asc']);
      console.log(this.originalData,"original data")
    });
  }


  filterData(event: any) {
    let filterValue = event.target.value.trim().toLowerCase();
    const filteredData = this.originalData.filter(data =>
      data.employeeName.toLowerCase().includes(filterValue) ||
      data.employeeId.toLowerCase().includes(filterValue) ||
      data.designationName.toLowerCase().includes(filterValue)
    );
    this.allDatas = new MatTableDataSource(filteredData);
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

  // calculateMonthsFromDate(dateString: string, monthsToAdd: number): any {
  //   // Parse the input date string to get the year, month, and day components
  //   const [day, month, year] = dateString.split('-').map(Number);

  //   // Create a new Date object using the provided year, month, and day
  //   const initialDate = new Date(year, month - 1, day); // month - 1 because months are zero-based

  //   // Add the specified number of months to the initial date
  //   initialDate.setMonth(initialDate.getMonth() + monthsToAdd);

  //   // Retrieve the year, month, and day components of the resulting date
  //   const resultYear = initialDate.getFullYear();
  //   const resultMonth = initialDate.getMonth() + 1; // Add 1 because months are zero-based
  //   const resultDay = initialDate.getDate();

  //   // Format the date components to ensure that single-digit values are padded with a leading zero if necessary
  //   const formattedMonth = resultMonth < 10 ? '0' + resultMonth : '' + resultMonth;
  //   const formattedDay = resultDay < 10 ? '0' + resultDay : '' + resultDay;

  //   // Construct the final date string in the format dd-MM-yyyy
  //   let result = `${formattedDay}-${formattedMonth}-${resultYear}`;
  // }
  // @ViewChild('content') content: ElementRef;
  // generatePDF(): void {
  //   const doc = new jspdf.jsPDF();
  //   const content = this.content.nativeElement;

  //   const headerImg = new Image();
  //   headerImg.src = 'assets/TNHB.jpg'; // Make sure this path is correct
  //   headerImg.onload = () => {
  //     const headerImgWidth = 180;
  //     const headerImgHeight = (headerImg.height * headerImgWidth) / headerImg.width;
  //     const headerImgX = (doc.internal.pageSize.getWidth() - headerImgWidth) / 2;

  //     // Add header image first
  //     doc.addImage(headerImg, 'JPEG', headerImgX, 10, headerImgWidth, headerImgHeight);

  //     // Then capture the table content
  //     html2canvas(content).then((canvas) => {
  //       const tableImgData = canvas.toDataURL('image/png');
  //       const desiredWidth = 130;
  //       const imgHeight = (canvas.height * desiredWidth) / canvas.width;
  //       const tableImgX = (doc.internal.pageSize.getWidth() - desiredWidth) / 2;
  //       const tableImgY = 45;
  //       doc.addImage(tableImgData, tableImgX, tableImgY, desiredWidth, imgHeight);

  //       // Save the PDF after both images are added
  //       doc.save('Document.pdf');
  //     });
  //   };
  // }

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
      fileName = 'EmployeeList';
      headerName = [
        'S.No',
        'Ofc Code',
        'Emp Id',
        'Emp Name',
        'Designation Name',
        'Basic Pay',
        'Scale of Pay',
      ];

      this.allDatas.data.forEach((element, index) => {
        let data = [
          index + 1,
          element.officeCode,
          element.employeeId,
          element.employeeName,
          element.designationName,
          element.basicPay,
          element.scaleOfPay,

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
          // doc.addImage(imageUrl, 'png', 0, 0, 200, 30);
          doc.addImage(imageUrl, 'png', 20, 0, 250, 30);

          doc.setTextColor(14, 31, 83);
          // let titleX = this.selectedDate != 5 ? 70 : 90
          let titleY = 33;
          // doc.text(fileName, 0, 0, { align: "center" });
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
    const fileName = 'Employee Lists.xlsx';
    // Get the array of items from the MatTableDataSource
    console.log(this.originalData, "this.allDatas")
    const data = this.originalData.map(employees => [
      employees.officeCode,
      employees.employeeId,
      employees.employeeName,
      employees.designationName,
      employees.basicPay,
      employees.scaleOfPay,
    ]);

    // Create a new workbook (export to excel)
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Lists');
    XLSX.writeFile(workbook, fileName);
  }
  //   const startDate = '01-03-1996';
  // const monthsToAdd = 148;

  // const resultDate = calculateMonthsFromDate('01-03-1996', 148);
}
