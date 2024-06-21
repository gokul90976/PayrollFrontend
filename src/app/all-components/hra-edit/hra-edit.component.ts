
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';

@Component({
  selector: 'app-hra-edit',
  templateUrl: './hra-edit.component.html',
  styleUrl: './hra-edit.component.css'
})
export class HraEditComponent {

  id: any;
  editForm: FormGroup;
  resData: any

  constructor(
    private apiCall: ApiService,
    private router: Router,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.id = data['id'];
      if (this.id) {
        console.log('ID:', this.id);
      }
    });

    this.editForm = this.formBuilder.group({
      'payRangeFrom': new FormControl('', [Validators.required]),
      'payRangeTo': new FormControl(),
      'grade01': new FormControl('', [Validators.required]),
      'grade02': new FormControl('', [Validators.required]),
      'grade03': new FormControl('', [Validators.required]),
      'grade04': new FormControl('', [Validators.required]),
      'grade05': new FormControl('', [Validators.required]),
    })

    this.getIDvalues()
  }

  getIDvalues() {
    const hraId = +this.id
    this.apiCall.apiPostCall({ hraId }, 'getHrayId').subscribe(data => {
      console.log(data, "data")
      this.resData = data.data
      console.log(this.resData.id, "response data")
      this.editForm.patchValue({
        // 'from': this.resData.from,
        // 'to': this.resData.to,
        // 'values': this.resData.values

      'payRangeFrom': this.resData.payRangeFrom,
      'payRangeTo': this.resData.payRangeTo,
      'grade01': this.resData.grade01,
      'grade02': this.resData.grade02,
      'grade03': this.resData.grade03,
      'grade04': this.resData.grade04,
      'grade05': this.resData.grade05
      })
    })
  }

  updateHraValues() {
    let payload = this.editForm.value
    this.editForm.value.hraId = this.resData.hraId;
    this.apiCall.apiPostCall(payload, 'saveHra').subscribe(data => {
      if (data.status) {
        this.editForm.reset()
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: 'Hra Updated Successfully',
        });
        this.router.navigate(['/payroll/hraList'])
      } else {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: data.message,
        });
        this.router.navigate(['/payroll/hraList'])
      }
    })
  }
}
