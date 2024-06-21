import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-professional-taxedit',
  templateUrl: './professional-taxedit.component.html',
  styleUrl: './professional-taxedit.component.css'
})
export class ProfessionalTaxeditComponent {

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
      'from': new FormControl('', [Validators.required]),
      'to': new FormControl('', [Validators.required]),
      'values': new FormControl('', [Validators.required])
    })

    this.getIDvalues()
  }

  getIDvalues() {
    const id = +this.id
    this.apiCall.apiPostCall({ id }, 'getProfessionalById').subscribe(data => {
      console.log(data, "data")
      this.resData = data.data
      console.log(this.resData.id, "response data")
      this.editForm.patchValue({
        'from': this.resData.from,
        'to': this.resData.to,
        'values': this.resData.values
      })
    })
  }

  saveProfessionalTax() {
    let payload = this.editForm.value
    this.editForm.value.id = this.resData.id;
    this.apiCall.apiPostCall(payload, 'updatedProfessionalTaxById').subscribe(data => {
      if (data.status) {
        this.editForm.reset()
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: 'Professional Taxes Updated Successfully',
        // });
        this.toastr.success('Professional Taxes Updated Successfully!');
        this.router.navigate(['/payroll/professionTax'])
      } else {
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: data.message,
        // });
        this.toastr.error(data.message);
        this.router.navigate(['/payroll/professionTax'])
      }
    })
  }
}
