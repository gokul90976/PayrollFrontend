import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dallowance-edit',
  templateUrl: './dallowance-edit.component.html',
  styleUrl: './dallowance-edit.component.css'
})

export class DallowanceEditComponent {

  id: any;
  DAeditForm: FormGroup;
  resData: any
  currentDate = new Date();

  constructor(
    private apiCall: ApiService,
    private router: Router,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
   
   }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.id = data['id'];
      if (this.id) {
        console.log('ID:', this.id);
      }
    });

    this.DAeditForm = this.formBuilder.group({
      'from': new FormControl('', [Validators.required]),
      'to': new FormControl(),
      'daPercentage': new FormControl('', [Validators.required]),
      'payCommission': new FormControl('', [Validators.required])

    })
    this.getIDvalues()
  }

  getIDvalues() {
    const id = this.id
    this.apiCall.apiPostCall({ id }, 'getDaTaxById').subscribe(data => {
      this.resData = data.data
      this.DAeditForm.patchValue({
        'payCommission': this.resData.payCommission,
        'from': this.resData.from,
        'to': this.resData.to,
        'daPercentage': this.resData.daPercentage
      })
    })
  }

  saveDallowanceTax() {
    let payload = this.DAeditForm.value
    this.DAeditForm.value.id = this.resData.id;
    this.apiCall.apiPostCall(payload, 'updateDaTaxById').subscribe(data => {
      if (data.status) {
        this.DAeditForm.reset()
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: 'DA Updated Successfully',
        // });
        this.toastr.success("DA Updated Successfully");
        this.router.navigate(['/payroll/Dallowance'])
      } else {
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: data.message,
        // });
        this.toastr.error(data.message);
        this.router.navigate(['/payroll/Dallowance'])
      }
    })
  }
}
