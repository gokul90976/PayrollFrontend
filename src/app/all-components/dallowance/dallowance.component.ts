import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-dallowance',
  templateUrl: './dallowance.component.html',
  styleUrl: './dallowance.component.css'
})
export class DallowanceComponent {

  updateForm : FormGroup = new FormGroup({})
  displayedColumns: string[] = ['id','paycommission','dafrom','dato','davalues','actions'];
  excelData: any[]
  dAllowanceDataSource = new MatTableDataSource<any>([]);

    
    constructor(private toastr: ToastrService,private apiCall: ApiService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private formBuilder:FormBuilder,private snackbar: MatSnackBar,public dialog: MatDialog,) {}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dAllowanceDataSource.paginator = this.paginator;

  }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      'payCommission':new FormControl('',[Validators.required]),
      'from':new FormControl('',[Validators.required]),
      'to':new FormControl(),
      'daPercentage':new FormControl('',[Validators.required])
    })

    this.getDallowanceRecList()

  }

  getDallowanceRecList(): void {
    const payload = {"id":1}
    this.apiCall.apiPostCall(payload, 'getAllDaTax').subscribe(data => {
      console.log(data,"DAdatatattata")
      this.dAllowanceDataSource.data = data.data; 
    })
  }

  dAllowanceTax() {
      let payload = this.updateForm.value
      console.log(payload,"payload")
      this.apiCall.apiPostCall(payload, 'saveDaTax').subscribe(data => {
        console.log("saved response", data);
        if (data.status) {
          this.updateForm.reset();
          // this.snackbar.openFromComponent(SnackbarComponent, {
          //   data: 'DA Created Successfully',
          // });
        this.toastr.success("DA Created Successfully");

        } else {
          console.log("Something went wrong")
          // this.snackbar.openFromComponent(SnackbarComponent, {
          //   data: 'Something Went Wrong',
          // });
        this.toastr.error("Something Went Wrong");

        }
        this.getDallowanceRecList()
        // this.router.navigate(['/payroll/Addtaxcalculation'])
  
      })
    
  }

  goToTaxCrud(id : any){
    console.log(id)
    this.router.navigate(['/payroll/dallowanceEdit', id]);
  }

  deleteDAdata(id){
    const payload = { id }
    // this.apiCall.apiDeleteCall(payload, 'deleteDaTaxById').subscribe(data => {
    //   this.dAllowanceDataSource.data = data.data;
    //   if(data.result == true){
    //     this.snackbar.openFromComponent(SnackbarComponent, {
    //       data: 'Deleted Successfully',
    //     });
    //   this.getDallowanceRecList()
    //   }else{
    //     this.snackbar.openFromComponent(SnackbarComponent, {
    //       data: 'Something went wrong',
    //     });
    //   this.getDallowanceRecList()
    //   }
    // })


    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        from: "delete",
      }
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        const payload = {id}
        this.apiCall.apiDeleteCall(payload, 'deleteDaTaxById').subscribe(data => {
          this.dAllowanceDataSource.data = data.data;
          if(data.result == true){
            // this.snackbar.openFromComponent(SnackbarComponent, {
            //   data: 'Deleted Successfully',
            // });
        this.toastr.success("Deleted Successfully");


          this.getDallowanceRecList()
          }else{
            // this.snackbar.openFromComponent(SnackbarComponent, {
            //   data: 'Something went wrong',
            // });
        this.toastr.error("Something went wrong");

          this.getDallowanceRecList()
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
      fileName = 'DA Percentages';
      headerName = [
        'S.No',
        'Pay Commission',
        'DA From',
        'DA To',
        'DA Values',
      ];

      this.dAllowanceDataSource.data.forEach((element, index) => {
        let data = [
          index + 1,
          element.payCommission,
          element.from,
          element.to,
          element.daPercentage,

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
    this.excelData = this.dAllowanceDataSource.data.map((item, index) => ({
      'S.No': index + 1,
      'Pay Commission ': item.payCommission,
      'DA From ': item.from,
      'DA To': item.to,
      'DA Values': item.daPercentage,
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
    FileSaver.saveAs(data, 'DaPercentages.xlsx');
  }
}
