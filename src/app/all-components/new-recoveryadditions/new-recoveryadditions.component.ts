import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-recoveryadditions',
  templateUrl: './new-recoveryadditions.component.html',
  styleUrl: './new-recoveryadditions.component.css'
})
export class NewRecoveryadditionsComponent implements OnInit {

  recoveryDynamicForm!: FormGroup
  recoveryForm!: FormGroup
  empId: any;
  nId: any;
  edit = false;
  view = false;
  id = null;
  getData: any;
  data_Id: any;
  finalValue: any
  mergedData: any = {};
  delete: boolean
  joiningDate: any
  isPF: boolean
  isEdit: boolean
  isDataFetch = true

  constructor(private fb: FormBuilder, private apiCall: ApiService, private router: Router, private snackbar: MatSnackBar, private activeRoute: ActivatedRoute, private toastr: ToastrService, private datePipe: DatePipe) {
    this.activeRoute.paramMap.subscribe(params => {
      this.nId = params.get('id');
      this.empId = params.get('empId');
      if (this.empId && this.router.url.includes('edit')) {
        this.edit = true;
        // this.delete = false
        this.view = false;
        // this.isEdit = true
        this.getRecoveryData();
      } else if (this.router.url.includes('view')) {
        this.view = true;
        // this.delete = true
        this.edit = false;
        this.getRecoveryData();

      }
    })
  }

  ngOnInit(): void {
    this.recoveryForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeName: [{value:'',disabled: true}],
      designationCode: [{value:'',disabled: true}],
      designationName: [{value:'',disabled: true}],
      officeCode: [{value:'',disabled: true}],
      officeName: [{value:'',disabled: true}],
      dateOfJoiningService: [{value:'',disabled: true}],
      basicPay: [{value:'',disabled: true}]
    });

    this.recoveryDynamicForm = this.fb.group({
      itemsRec: this.fb.array([this.createRecoveryItem()])
    });

    this.addRecoveryButton();
  }



  createRecoveryItem(): FormGroup {
    return this.fb.group({
      recovery: ['', Validators.required],
      totalDemand: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      perMonthDemand: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      regularMonthDemand: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      lastMonthDemand: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      date: ['', Validators.required],
      noOfMonths: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      recoverd: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      balanceAmount: [{ value: '', disabled: true }]
    });
  }

  getRecoveryData() {

    const employeepayload = {
      "employeeId": this.empId
    }

    this.apiCall.personel_apiPostCall(employeepayload, "getPayRollDetailsByEmpId").subscribe(personalData => {
      console.log(personalData, "personalData")
      this.recoveryForm.patchValue(personalData.data);
      this.recoveryForm.controls['employeeId'].disable();
      this.recoveryForm.controls['employeeName'].disable();
      this.recoveryForm.controls['designationCode'].disable();
      this.recoveryForm.controls['designationName'].disable();
      this.recoveryForm.controls['officeCode'].disable();
      this.recoveryForm.controls['officeName'].disable();
      this.recoveryForm.controls['dateOfJoiningService'].disable();
      this.recoveryForm.controls['basicPay'].disable();

      this.joiningDate = personalData.data.dateOfJoiningService
      console.log(this.joiningDate, "joining date")

      // let startDate = this.datePipe.transform(this.joiningDate, 'yyyy-MM-dd');
      // console.log(startDate,"startDate")

      const dateToCheck = this.joiningDate

      const parts = dateToCheck.split("-");

      // Rearrange the parts to form the desired format "yyyy-mm-dd"
      const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

      console.log(formattedDate, "formattedDate");

      const referenceDate = '2003-04-01';
      console.log(referenceDate)
      let checkDate = formattedDate > referenceDate
      if (checkDate == true) {
        this.isPF = false
      } else {
        this.isPF = true
      }

    })
    const payload = {
      "recoveryId": this.nId
    }
    this.apiCall.apiPostCall(payload, 'getRecoveryDataByEmpId').subscribe(data => {
      this.getData = data.data.recoveryDataAdd
      console.log(this.getData, "get data")
      if (data.message.includes('not found')) {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: data.message,
        });
      } else {
        this.id = data.data.id;
        this.recoveryForm.patchValue(data.data);
        this.recoveryForm.controls['employeeId'].disable();
        this.recoveryForm.controls['employeeName'].disable();
        this.recoveryForm.controls['designationCode'].disable();
        this.recoveryForm.controls['designationName'].disable();
        this.recoveryForm.controls['officeCode'].disable();
        this.recoveryForm.controls['officeName'].disable();
        this.recoveryForm.controls['dateOfJoiningService'].disable();
        this.recoveryForm.controls['basicPay'].disable();

        const earningsCustomFields: any = data.data.recoveryDataAdd;
        if (earningsCustomFields.length > 0) {
          this.itemsRec.length = 0;
          earningsCustomFields.forEach((fam, i) => {
            console.log(earningsCustomFields, "hdfbvjshdfb")
            this.addRecoveryButton();
            const expansionPanel = this.itemsRec.at(i) as FormGroup;
            expansionPanel.patchValue({
              // id: earningsCustomFields[i].id,
              recovery: earningsCustomFields[i].recovery,
              recoverd: earningsCustomFields[i].recoverd,
              totalDemand: Number(earningsCustomFields[i].totalDemand),
              regularMonthDemand: Number(earningsCustomFields[i].regularMonthDemand),
              perMonthDemand: Number(earningsCustomFields[i].perMonthDemand),
              lastMonthDemand: Number(earningsCustomFields[i].lastMonthDemand),
              noOfMonths: Number(earningsCustomFields[i].noOfMonths),
              // noOfMonthsBalance: earningsCustomFields[i].noOfMonthsBalance,
              // employeeId: earningsCustomFields[i].employeeId,
              // mid: earningsCustomFields[i].mid,
              balanceAmount: Number(earningsCustomFields[i].balanceAmount),
              date: earningsCustomFields[i].date,
              recoveryId: earningsCustomFields[i].recoveryId,
              recoverydataId: Number(earningsCustomFields[i].recoverydataId)
            });
            this.totalcal('recoverd', i);
            this.totalcal('totalDemand', i);
          })
        }

        if (this.view === true) {
          this.recoveryForm.disable();
          this.recoveryDynamicForm.disable()
        }
      }
    })
  }

  createRec(): FormGroup {
    return this.fb.group({
      recoverydataId: [''],
      recovery: [''],
      recoverd: [''],
      totalDemand: [''],
      regularMonthDemand: [''],
      perMonthDemand: [''],
      lastMonthDemand: [''],
      noOfMonths: [''],
      // noOfMonthsBalance: [''],
      // employeeId:[''],
      // mid: [''],
      date: [''],
      balanceAmount: [''],

    });
  }

  get itemsRec() {
    return (this.recoveryDynamicForm.get('itemsRec') as FormArray).controls;
  }

  addRecoveryButton() {
    const itemsFormArray = this.recoveryDynamicForm.get('itemsRec') as FormArray;
    const newItem = this.createRec();
    // Subscribe to value changes for recalculation
    newItem.get('recoverd').valueChanges.subscribe(() => {
      this.totalcal('recoverd', itemsFormArray.controls.indexOf(newItem));
    });
    newItem.get('totalDemand').valueChanges.subscribe(() => {
      this.totalcal('totalDemand', itemsFormArray.controls.indexOf(newItem));
    });

    itemsFormArray.push(newItem);
  }

  totalcal(controlName: string, index: number) {
    const formGroup = this.itemsRec.at(index) as FormGroup;
    const recoverd = formGroup.get('recoverd').value;
    const totalDemand = formGroup.get('totalDemand').value;
    // Perform your calculation here
    const balanceAmount = totalDemand - recoverd; // Example calculation
    // Update the balanceAmount control
    formGroup.get('balanceAmount').setValue(balanceAmount);
  }

  deleteRecoveryButton(i: number) {
    const itemsFormArray = this.recoveryDynamicForm.get('itemsRec') as FormArray;
    const nid = itemsFormArray.value[i];
    console.log(nid, "nid")
    if (nid.recoverydataId) {
      const payload = {
        "recoverydataId": nid.recoverydataId
      }
      this.apiCall.apiPostCall(payload, 'deleteRecoveryDataAddById').subscribe({
        next: (response: any) => {

          if (response.status) {
            this.toastr.success(" Details Deleted Successfully");
            this.getRecoveryData()
          } else {
            this.toastr.error(" Something went Wrong");
          }
          if (response?.message && (response?.message.includes("SuccesFully"))) {
            window.location.reload()
            itemsFormArray.removeAt(i);
          }
        }
      })
    } else {
      itemsFormArray.removeAt(i);
    }
  }

  fetchRec() {
    let employeeId = this.recoveryForm.controls['employeeId'].value

    this.apiCall.getEmployeeId('checkEmployeeId', employeeId).subscribe((res: any) => {
      console.log(res)

      if (res.result) {


        if (this.recoveryForm.controls['employeeId'].value == '' || this.recoveryForm.controls['employeeId'].value == null) {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: "Enter Employee ID",
          });
        } else {
          const payload = {
            "employeeId": this.recoveryForm.controls['employeeId'].value
          }
          this.apiCall.personel_apiPostCall(payload, 'getPayRollDetailsByEmpId').subscribe(data => {
            this.recoveryForm.patchValue(data.data);
            this.recoveryForm.get('employeeName')!.disable();
            this.recoveryForm.get('designationCode')!.disable();
            this.recoveryForm.get('designationName')!.disable();
            this.recoveryForm.get('officeCode')!.disable();
            this.recoveryForm.get('officeName')!.disable();
            this.recoveryForm.get('dateOfJoiningService')!.disable();
            this.recoveryForm.get('basicPay')!.disable();
            this.joiningDate = data.data.dateOfJoiningService
            console.log(this.joiningDate, "joining date")

            // let startDate = this.datePipe.transform(this.joiningDate, 'yyyy-MM-dd');
            // console.log(startDate,"startDate")

            const dateToCheck = this.joiningDate

            const parts = dateToCheck.split("-");

            // Rearrange the parts to form the desired format "yyyy-mm-dd"
            const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

            console.log(formattedDate, "formattedDate");

            const referenceDate = '2003-04-01';
            console.log(referenceDate)
            let checkDate = formattedDate > referenceDate
            if (checkDate == true) {
              this.isPF = false
            } else {
              this.isPF = true
            }
            if (data && data.message === 'Recovery Data Already Exist') {
              this.snackbar.openFromComponent(SnackbarComponent, {
                data: data.message,
              });
            } else {
              // this.apiCall.apiPostCall(payload, 'getAllEmployeeByEmpId').subscribe(data => {
              //   if (data.data === null) {
              //     // this.snackbar.openFromComponent(SnackbarComponent, {
              //     //   data: 'No data found -' + ' ' + ${this.recoveryForm.controls['employeeId'].value},
              //     // });
              //   } else {
              //     this.recoveryForm.patchValue(data.data);
              //   }
              // })
            }
          })
        }
      } else {
        this.toastr.error(res.message)
      }
    })


  }

  saveRecovery(): void {
    // Check if both forms are valid
    if (this.recoveryForm.valid && this.recoveryDynamicForm.valid) {
      const formValues = this.recoveryDynamicForm.value;

      // Ensure itemsRec is a valid array
      if (!formValues.itemsRec || !Array.isArray(formValues.itemsRec)) {
        console.error('itemsRec is not an array or is undefined');
        this.toastr.error("Invalid form data");
        return;
      }

      const transformedData = this.transformFormData(formValues);

      const payload: any = {
        employeeId: this.recoveryForm.get('employeeId').value,
        employeeName: this.recoveryForm.controls['employeeName'].value,
        designationCode: this.recoveryForm.controls['designationCode'].value,
        designationName: this.recoveryForm.controls['designationName'].value,
        officeCode: this.recoveryForm.controls['officeCode'].value,
        officeName: this.recoveryForm.controls['officeName'].value,
        dateOfJoiningService: this.recoveryForm.controls['dateOfJoiningService'].value,
        basicPay: this.recoveryForm.controls['basicPay'].value,
        recoveryDataAdd: transformedData
      };

      // Make the API call
      this.apiCall.apiPostCall(payload, 'saveRecoveryDataAndAdd').subscribe(
        data => {
          if (data.status) {
            this.toastr.success(this.router.url.includes('edit') ? "Details Updated Successfully" : "Submitted Successfully");
            this.router.navigate(['/payroll/recoveryaddition']);
          } else {
            this.toastr.error("Something went wrong");
          }
        },
        error => {
          console.error("API call failed:", error);
          this.toastr.error("Failed to save data");
        }
      );
    } else if (this.router.url.includes('edit')) {
      const formValues = this.recoveryDynamicForm.value;

      const transformedData = this.transformFormData(formValues);

      const payload: any = {
        employeeId: this.recoveryForm.get('employeeId').value,
        employeeName: this.recoveryForm.controls['employeeName'].value,
        designationCode: this.recoveryForm.controls['designationCode'].value,
        designationName: this.recoveryForm.controls['designationName'].value,
        officeCode: this.recoveryForm.controls['officeCode'].value,
        officeName: this.recoveryForm.controls['officeName'].value,
        dateOfJoiningService: this.recoveryForm.controls['dateOfJoiningService'].value,
        basicPay: this.recoveryForm.controls['basicPay'].value,
        recoveryDataAdd: transformedData,
        recoveryId: +this.nId

      };

      this.apiCall.apiPostCall(payload, 'saveRecoveryDataAndAdd').subscribe(
        data => {
          if (data.status) {
            this.toastr.success(this.router.url.includes('edit') ? "Details Updated Successfully" : "Submitted Successfully");
            this.router.navigate(['/payroll/recoveryaddition']);
          } else {
            this.toastr.error("Something went wrong");
          }
        },
        error => {
          console.error("API call failed:", error);
          this.toastr.error("Failed to save data");
        }
      );
    }
    else {
      this.toastr.error("Please enter all required fields");
    }
  }


  transformFormData(formData: any): any {
    if (!formData || !Array.isArray(formData.itemsRec)) {
      // Handle the case where itemsRec is not defined or not an array
      return [];
    }

    return formData.itemsRec.map(item => ({
      ...item,
      totalDemand: item.totalDemand ? parseFloat(item.totalDemand) : 0,
      perMonthDemand: item.perMonthDemand ? parseFloat(item.perMonthDemand) : 0,
      regularMonthDemand: item.regularMonthDemand ? parseFloat(item.regularMonthDemand) : 0,
      lastMonthDemand: item.lastMonthDemand ? parseFloat(item.lastMonthDemand) : 0,
      balanceAmount: item.balanceAmount ? parseFloat(item.balanceAmount) : 0,
      recoverd: item.recoverd ? parseFloat(item.recoverd) : 0,
      noOfMonths: item.noOfMonths ? parseInt(item.noOfMonths, 10) : 0
    }));
  }


  //decimal codes

  decimalInput(formName: string, controlName: string, index: number) {
    const formArray = this[formName].get('itemsRec') as FormArray;
    const control = formArray.at(index).get(controlName);
    if (control) {
      let value = control.value;
      value = value.replace(/[^0-9.]/g, '');
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value)) {
        control.setValue(value, { emitEvent: false });
      } else {
        control.setValue('', { emitEvent: false });
      }
    }
  }


  formatToTwoDecimals(formName: string, controlName: string, index: number) {
    const formArray = this[formName].get('itemsRec') as FormArray;
    const control = formArray.at(index).get(controlName);
    if (control) {
      let value = control.value;
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        control.setValue(numericValue.toFixed(2), { emitEvent: false });
      }
    }
  }


}