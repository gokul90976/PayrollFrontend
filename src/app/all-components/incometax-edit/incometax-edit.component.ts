import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-incometax-edit',
  templateUrl: './incometax-edit.component.html',
  styleUrl: './incometax-edit.component.css'
})
export class IncometaxEditComponent {

  id: any;
  ITeditForm: FormGroup;
  resData: any
  constructor(
    private apiCall: ApiService,
    private router: Router,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.id = data['id'];
      if (this.id) {
        console.log('ID:', this.id);
      }
    });

    this.ITeditForm = this.formBuilder.group({
      'from': new FormControl('', [Validators.required]),
      'to': new FormControl('', [Validators.required]),
      'values': new FormControl('', [Validators.required])
    })

    this.getIDvalues()
  }

  getIDvalues() {
    const id = this.id
    this.apiCall.apiPostCall({ id }, 'getIncomeTaxById').subscribe(data => {
      this.resData = data.data
      this.ITeditForm.patchValue({
        'id': this.resData.id,
        'from': this.resData.from,
        'to': this.resData.to,
        'values': this.resData.values
      })
    })
  }

  saveIncomeTax() {
    let payload = this.ITeditForm.value
    this.ITeditForm.value.id = this.resData.id;
    this.apiCall.apiPostCall(payload, 'updatedIncomeTaxById').subscribe(data => {
      if (data.status) {
        this.ITeditForm.reset()
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: 'Updated Successfully',
        // });
        this.toastr.success("Updated Successfully");

        this.router.navigate(['/payroll/incomeTax'])
      } else {
        console.log("Something went wrong")
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: 'Something went wrong',
        // });
        this.toastr.error("Something went wrong");

      }
    })
  }
}
