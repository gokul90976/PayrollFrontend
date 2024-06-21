
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
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-concessional-table',
  templateUrl: './concessional-table.component.html',
  styleUrl: './concessional-table.component.css'
})
export class ConcessionalTableComponent {
  ngForm: any
  proftax: any = {}
  // updateForm !: FormGroup;
  updateForm: FormGroup = new FormGroup({})

  displayedColumns: string[] = ['id', 'payRangeFrom', 'payRangeTo', 'grade01', 'grade02',"grade03","grade04","actions"];
  excelData: any[]
  concessValuesDataSource = new MatTableDataSource<any>([]);

  constructor(private apiCall: ApiService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private snackbar: MatSnackBar,private toastr: ToastrService, public dialog: MatDialog) { }


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit() {
    this.concessValuesDataSource.paginator = this.paginator;

  }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      'payRangeFrom': new FormControl('', [Validators.required]),
      'payRangeTo': new FormControl(),
      'grade01': new FormControl('', [Validators.required]),
      'grade02': new FormControl('', [Validators.required]),
      'grade03': new FormControl('', [Validators.required]),
      'grade04': new FormControl('', [Validators.required]),

    })

    this.concessRecList()

  }

  concessRecList(): void {
    const payload = {}
    this.apiCall.apiPostCall(payload, 'getAllConcessData').subscribe(data => {
      this.concessValuesDataSource.data = data.data;
    })
  }

  saveConcessValues() {
    let payload = this.updateForm.value
    this.apiCall.apiPostCall(payload, 'saveConcess').subscribe(data => {
      if (data.status) {
        this.updateForm.reset();
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: "PT Created Successfully",
        // });
        this.toastr.success("Concessional Data Created Successfully");

      } else {
        console.log("Something went wrong")
        this.toastr.error("Something went wrong");

      }
      this.concessRecList()
      // this.router.navigate(['/payroll/Addtaxcalculation'])

    })

  }

  goToTaxCrud(id: any) {
    console.log(id)
    this.router.navigate(['/payroll/concessionalEdit', id]);
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
        // const payload = {id}
    this.apiCall.apiDeleteCall(id, 'deleteConcessById').subscribe(data => {
      this.concessValuesDataSource.data = data.data;
      if (data.result == true) {
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: data.message,
        // });
        this.toastr.success("Concessional Data Deleted Successfully");
        this.concessRecList()
      } else {
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: data.message,
        // });
        this.toastr.error("Something went wrong");
        this.concessRecList()
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
        'From',
        'To',
        'Grade 01 (a) & (b)',
        'Grade 02',
        'Grade 03',
        'Grade 04',
      ];

      this.concessValuesDataSource.data.forEach((element, index) => {
        let data = [
          index + 1,
          element.payRangeFrom,
          element.payRangeTo,
          element.grade01,
          element.grade02,
          element.grade03,
          element.grade04,
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
    this.excelData = this.concessValuesDataSource.data.map((item, index) => ({
      'S.No': index + 1,
      'From ': item.payRangeFrom,
      'To': item.payRangeTo,
      'Grade 01 (a) & (b)': item.grade01,
      'Grade 02': item.grade02,
      'Grade 03': item.grade03,
      'Grade 04': item.grade04,

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
    FileSaver.saveAs(data, 'ConcessionalPercentages.xlsx');
  }
}

