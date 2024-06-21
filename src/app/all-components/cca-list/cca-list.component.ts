

import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-cca-list',
  templateUrl: './cca-list.component.html',
  styleUrl: './cca-list.component.css'
})
export class CcaListComponent {
  ngForm: any
  proftax: any = {}
  // updateForm !: FormGroup;
  updateForm: FormGroup = new FormGroup({})
  displayedColumns: string[] = ['id', 'ccaFromPay', 'ccaToPay', 'ccaFirstValue', 'ccaSecondValue', 'actions'];
  ccaListSource = new MatTableDataSource<any>([]);
  excelData: any[]

  constructor(private apiCall: ApiService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private snackbar: MatSnackBar, public dialog: MatDialog, private toastr: ToastrService) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.ccaListSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      'ccaFromPay': new FormControl('', [Validators.required]),
      'ccaToPay': new FormControl(),
      'ccaFirstValue': new FormControl('', [Validators.required]),
      'ccaSecondValue': new FormControl('', [Validators.required])
    })
    this.get_CcaList()
  }

  get_CcaList(): void {
    const payload = { "id": 1 }
    this.apiCall.apiPostCall(payload, 'getAllCcaData').subscribe(data => {
      this.ccaListSource.data = data.data;
    })
  }

  ccaDataSave() {
    let payload = this.updateForm.value
    this.apiCall.apiPostCall(payload, 'saveCca').subscribe(data => {
      if (data.status) {
        this.updateForm.reset();
        this.toastr.success("CCA Created Successfully");
      } else {
        this.toastr.success("CCA Created Successfully");
      }
      this.get_CcaList()
    })
  }

  goToTaxCrud(id: any) {
    this.router.navigate(['/payroll/ccaEdit', id]);
  }

  deleteData(id) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        from: "delete",
      }
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        const payload = { id }
        this.apiCall.apiDeleteCall(payload, 'deleteCcaById').subscribe(data => {
          this.ccaListSource.data = data.data;
          if (data.result == true) {
            this.toastr.success("CCA Deleted Successfully");
            this.get_CcaList()
          } else {
            this.toastr.error("CCA Deleted Successfully");
            this.get_CcaList()
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
      fileName = 'CCA Percentages';
      headerName = [
        'S.No',
        'Pay Range From',
        'Pay Range To',
        '1',
        '2',
      ];

      this.ccaListSource.data.forEach((element, index) => {
        let data = [
          index + 1,
          element.ccaFromPay,
          element.ccaToPay,
          element.ccaFirstValue,
          element.ccaSecondValue,
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
    this.excelData = this.ccaListSource.data.map((item, index) => ({
      'S.No': index + 1,
      'Pay Range From ': item.ccaFromPay,
      'Pay Range To': item.ccaToPay,
      '1': item.ccaFirstValue,
      '2': item.ccaSecondValue,

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
    FileSaver.saveAs(data, 'CcaPercentages.xlsx');
  }
}

