import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared-module/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-income-tax-list',
  templateUrl: './income-tax-list.component.html',
  styleUrl: './income-tax-list.component.css'
})
export class IncomeTaxListComponent {

  updateForm: FormGroup = new FormGroup({})

  displayedColumns: string[] = ['id', 'itfrom', 'itto', 'itvalues', 'actions'];

  incomeTaxDataSource = new MatTableDataSource<any>([]);


  constructor(private apiCall: ApiService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,public dialog: MatDialog, private formBuilder: FormBuilder, private snackbar: MatSnackBar, private toastr: ToastrService) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit() {
    this.incomeTaxDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      'from': new FormControl('', [Validators.required]),
      'to': new FormControl('', [Validators.required]),
      'values': new FormControl('', [Validators.required])
    })
    this.getIncomeTaxRecList()
  }

  getIncomeTaxRecList(): void {
    const payload = { "id": 1 }
    this.apiCall.apiPostCall(payload, 'getAllIncomeTax').subscribe(data => {
      this.incomeTaxDataSource.data = data.data;
    })
  }

  saveIncomeTax() {
    let payload = this.updateForm.value
    this.apiCall.apiPostCall(payload, 'saveIncomeTax').subscribe(data => {
      if (data.status) {
        this.updateForm.reset();
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: 'IT Created Successfully',
        // });
        this.toastr.success('IT Created Successfully')
      } else {
        console.log("Something went wrong")
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: 'Something went wrong',
        // });
        this.toastr.error('Something went wrong')

      }
      this.getIncomeTaxRecList()
    })
  }

  goToTaxCrud(id: any) {
    console.log(id)
    this.router.navigate(['/payroll/incomeTaxEdit', id]);
  }

  deleteIncomeData(id) {
    console.log(id);
    const payload = { id }
    // this.apiCall.apiDeleteCall(payload, 'deleteIncomeTaxById').subscribe(data => {
    //   this.incomeTaxDataSource.data = data.data;
    //   if (data.result == true) {
    //     this.toastr.success('Deleted Successfully')
    //     this.getIncomeTaxRecList()
    //   } else {
    //     this.toastr.error('Something went wrong')
    //     this.getIncomeTaxRecList()
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
        this.apiCall.apiDeleteCall(payload, 'deleteIncomeTaxById').subscribe(data => {
          this.incomeTaxDataSource.data = data.data;
          if (data.result == true) {
            this.toastr.success('Deleted Successfully')
            this.getIncomeTaxRecList()
          } else {
            this.toastr.error('Something went wrong')
            this.getIncomeTaxRecList()
          }
        })
      }
    })
  }
}
