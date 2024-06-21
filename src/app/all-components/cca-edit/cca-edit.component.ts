import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cca-edit',
  templateUrl: './cca-edit.component.html',
  styleUrl: './cca-edit.component.css'
})
export class CcaEditComponent {

  id: any;
  editForm: FormGroup;
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
    this.editForm = this.formBuilder.group({
      'ccaFromPay': new FormControl('', [Validators.required]),
      'ccaToPay': new FormControl(),
      'ccaFirstValue': new FormControl('', [Validators.required]),
      'ccaSecondValue': new FormControl('', [Validators.required])
    })
    this.getIDvalues()
  }

  getIDvalues() {
    const ccaId = +this.id
    this.apiCall.apiPostCall({ ccaId }, 'getCcaId').subscribe(data => {
      this.resData = data.data
      this.editForm.patchValue({
        'ccaFromPay': this.resData.ccaFromPay,
        'ccaToPay': this.resData.ccaToPay,
        'ccaFirstValue': this.resData.ccaFirstValue,
        'ccaSecondValue': this.resData.ccaSecondValue
      })
    })
  }

  updateCcaValue() {
    let payload = this.editForm.value
    this.editForm.value.ccaId = this.resData.ccaId;
    this.apiCall.apiPostCall(payload, 'saveCca').subscribe(data => {
      if (data.status) {
        this.editForm.reset()
        this.toastr.success("CCA Edited Successfully");
        this.router.navigate(['/payroll/ccaList'])
      } else {
        this.toastr.error("Something Went Wrong");
        this.router.navigate(['/payroll/ccaList'])
      }
    })
  }
}

