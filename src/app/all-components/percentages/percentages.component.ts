import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-percentages',
  templateUrl: './percentages.component.html',
  styleUrl: './percentages.component.css'
})
export class PercentagesComponent {

  percentageForm: FormGroup = new FormGroup({})
  updatePercentage: any;
  getPercentage: any

  constructor(private apiCall: ApiService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private formBuilder: FormBuilder, private snackbar: MatSnackBar) {

  }

  ngOnInit() {
    this.percentageForm = this.formBuilder.group({
      'hrrPercentage': new FormControl('', [Validators.required]),
      'gpfPercentage': new FormControl('', [Validators.required]),
      'cpsPercentage': new FormControl('', [Validators.required]),
      'hbfPercentage': new FormControl('', [Validators.required]),
      'itcPercentage': new FormControl('', [Validators.required]),
      // 'interimReliefPercentage': new FormControl('', [Validators.required]),
    })
    this.getPercentages()
  }

  onSubmit() {

    let payload = this.percentageForm.value
    this.apiCall.apiPostCall(payload, "update/" + 1).subscribe(result => {
      this.updatePercentage = result.data.percentageId
      if (result.message == "Success") {
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data:,
        // });
        // this.toastr.success('Percenatge Updated Successfully!');
        this.toastr.success('Percenatge Updated Successfully!', '', {
          timeOut: 3000,
        });
        this.getPercentages()
      } else {
        // this.snackbar.openFromComponent(SnackbarComponent, {
        //   data: "",
        // });
        this.toastr.error('Failed to Update the Percentage!','',{
          timeOut: 3000,
        });

      }
    })
  }

  getPercentages() {
    this.apiCall.apiPostCall({ percentageId: 1 }, 'percentage').subscribe(data => {
      console.log(data, "resulttttttt")
      this.percentageForm.patchValue(data.data);
    })
  }

 


}
