import { group } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-da-arrear-fields',
  templateUrl: './da-arrear-fields.component.html',
  styleUrl: './da-arrear-fields.component.css'
})
export class DaArrearFieldsComponent implements OnInit {

  daDynamicForm!: FormGroup
  // recoveryForm!: FormGroup
  empId: any;
  edit = false;
  view = false;
  id = null;
  getData: any;
  data_Id: any;
  mergedData: any = {};
  delete: boolean
  employeeId: any
  dataType: any;
  pfCps: any
  netDa: any
  cps: any
  basicPay: any
  personalPay: any
  voucherNo: any
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DaArrearFieldsComponent>, private apiCall: ApiService, private router: Router, private snackbar: MatSnackBar, private activeRoute: ActivatedRoute, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data, "dataaaaaa")
    this.dataType = data.type
    this.employeeId = data.empId
    this.pfCps = data.pfcps
    this.basicPay = data.basicPay
    this.personalPay = data.personalPay
    this.voucherNo = data.voucherNo
    this.getRecoveryData();
  }

  ngOnInit(): void {

    this.daDynamicForm = this.fb.group({
      itemsRec: this.fb.array([]),
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      daArrearPersonalPay: ['', Validators.required],
      daArrearBasicPay: ['', Validators.required],
      daArrearValue: ['', Validators.required],
      daDifference: ['', Validators.required],
      totalEarning: [''],
      totalDeductions: [''],
      netPay: [''],

    });
    this.addRecoveryButton();
  }

  getRecoveryData() {
    this.apiCall.getDaArrearData('getDaArrearData', this.employeeId, this.voucherNo).subscribe((data: any) => {
      this.getData = data.data[0]
      if (data.message.includes('not found')) {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: data.message,
        });
      } else {
        this.id = data.data.id;
        const earningsCustomFields: any = data.data;
        this.daDynamicForm.get('totalDeductions').setValue(earningsCustomFields[0].totalDeductions)
        this.daDynamicForm.get('totalEarning').setValue(earningsCustomFields[0].totalEarning)
        this.daDynamicForm.get('netPay').setValue(earningsCustomFields[0].netPay)
        if (earningsCustomFields.length > 0) {
          this.itemsRec.length = 0;
          earningsCustomFields.forEach((fam, i) => {
            this.addRecoveryButton();
            const expansionPanel = this.itemsRec.at(i) as FormGroup;
            expansionPanel.patchValue({
              fromDate: earningsCustomFields[i].fromDate, // Assign fromDate directly
              toDate: earningsCustomFields[i].toDate,
              daArrearPersonalPay: Number(earningsCustomFields[i].daArrearPersonalPay),
              daArrearBasicPay: Number(earningsCustomFields[i].daArrearBasicPay),
              daDifference: Number(earningsCustomFields[i].daDifference),
              daArrearValue: Number(earningsCustomFields[i].daArrearValue),
              darrearId: Number(earningsCustomFields[i].darrearId),
              totalEarning: Number(earningsCustomFields[i].totalEarning),

            });
          })
        }
        console.log(this.dataType)
        if (this.dataType === 'view') {
          this.view = true
          this.daDynamicForm.disable()
        }
      }
    })
  }



  createRec(): FormGroup {
    return this.fb.group({
      darrearId: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      daArrearPersonalPay: ['', Validators.required],
      daArrearBasicPay: ['', Validators.required],
      daArrearValue: ['', Validators.required],
      daDifference: ['', Validators.required],
      totalEarning: ['', Validators.required],
      totalDeductions: ['', Validators.required],
      netPay: ['', Validators.required],
    });
  }

  get itemsRec() {
    return (this.daDynamicForm.get('itemsRec') as FormArray).controls;
  }

  addRecoveryButton() {
    const itemsFormArray = this.daDynamicForm.get('itemsRec') as FormArray;
    const newItem = this.createRec();
    itemsFormArray.push(newItem);
  }

  saveRecovery() {
    const payload = {
      "recoveryDataAdd": this.daDynamicForm.value.itemsRec,
    }

    let payArrearDataAdd = this.daDynamicForm.value.itemsRec.map((item: any) => {
      return {
        ...item,
        employeeId: this.employeeId,
        employeeName: this.data.empName,
        designationCode: this.data.desgCode,
        officeName: this.data.ofcName,
        totalEarning: this.daDynamicForm.get('totalEarning').value,
        totalDeductions: this.daDynamicForm.get('totalDeductions').value,
        netPay: this.daDynamicForm.get('netPay').value,
        voucherNo: this.voucherNo
      };
    });
    this.apiCall.apiPostCall(payArrearDataAdd, "saveDaArrear").subscribe((response: any) => {
      if (response.status) {
        this.toastr.success(" Submitted Successfully");
        this.dialogRef.close(response.data);

      } else {
        this.toastr.error(response.message);
        this.dialogRef.close(response.data);
      }
    })
  }

  deleteRecoveryButton(i: number) {
    const itemsFormArray = this.daDynamicForm.get('itemsRec') as FormArray;
    itemsFormArray.removeAt(i);
    let totalDA = 0;
    for (const item of this.itemsRec) {
      totalDA += item.get('daArrearValue').value ? parseFloat(item.get('daArrearValue').value) : 0;
    }
    this.daDynamicForm.get('totalEarning').setValue(totalDA)
    if (this.pfCps == 'CPS') {
      this.cps = totalDA * 0.1
      this.daDynamicForm.get('totalDeductions').setValue(this.cps)
    } else {
      this.cps = 0
      this.daDynamicForm.get('totalDeductions').setValue(this.cps)
    }
    this.netDa = totalDA - this.cps
    this.daDynamicForm.get('netPay').setValue(this.netDa)
    return totalDA;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  calculateTotalDA(): number {
    let totalDA = 0;
    for (const item of this.itemsRec) {
      totalDA += item.get('daArrearValue').value ? parseFloat(item.get('daArrearValue').value) : 0;
    }
    this.daDynamicForm.get('totalEarning').setValue(totalDA)
    if (this.pfCps == 'CPS') {
      this.cps = totalDA * 0.1
      this.daDynamicForm.get('totalDeductions').setValue(this.cps)
    } else {
      this.cps = 0
      this.daDynamicForm.get('totalDeductions').setValue(this.cps)
    }
    this.netDa = totalDA - this.cps
    this.daDynamicForm.get('netPay').setValue(this.netDa)
    return totalDA;
  }

}















