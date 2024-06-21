
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
  selector: 'app-arrear-fields',
  templateUrl: './arrear-fields.component.html',
  styleUrl: './arrear-fields.component.css'
})
export class ArrearFieldsComponent implements OnInit {

  payArrearForm!: FormGroup
  form!: FormGroup
  myForm: FormGroup;
  empId: any;
  edit = false;
  view = false;
  id = null;
  getData: any;
  data_Id: any;
  mergedData: any = {};
  delete: boolean
  toBeDrawnTotal: number;
  alreadyDrawnValue: number;
  employeeId: any
  dataType: any;
  selectedFromDate: any;
  selectedToDate: any;
  voucherNo: any
  ofcCode: any
  empName: any
  desgName: any
  joiningDate: any
  isPF: boolean
  percentagesSetup: any

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ArrearFieldsComponent>, private apiCall: ApiService, private router: Router, private snackbar: MatSnackBar, private activeRoute: ActivatedRoute, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data, "dataaaadxfhsrthbsrta");
    this.dataType = data.type
    this.employeeId = data.empId
    this.empName = data.empName
    this.voucherNo = data.voucherNo
    this.ofcCode = data.ofcCode
    this.desgName = data.desgName
    this.joiningDate = data.joingDate
    console.log(this.joiningDate, "joing date")
    console.log(this.ofcCode, "ofc code")
    console.log(this.voucherNo, "voucher no")

    const dateToCheck = this.joiningDate

    const parts = dateToCheck.split("-");

    // Rearrange the parts to form the desired format "yyyy-mm-dd"
    const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

    console.log(formattedDate, "formattedDate");

    const referenceDate = '2003-04-01';
    console.log(referenceDate)
    let checkDate = dateToCheck > referenceDate
    if (checkDate == true) {
      // this.employeeForm.patchValue({ pfcps: "CPS" });
      this.isPF = false
      console.log("cps")
    } else {
      // this.employeeForm.patchValue({ pfcps: "PF" });
      this.isPF = true
      console.log("pf")

    }
    this.getRecoveryData()

  }

  ngOnInit(): void {

    this.payArrearForm = this.fb.group({
      itemsRec: this.fb.array([]),
      // fromDate: ['', Validators.required],
      // toDate: ['', Validators.required],
      basicPay: ['', Validators.required],
      personalPay: ['', Validators.required],
      specialPay: ['', Validators.required],
      daArrear: ['', Validators.required],
      hraArrear: ['', Validators.required],
      ccaArrear: ['', Validators.required],
      toBemisc1: ['', Validators.required],
      totalEarning: ['', Validators.required],

      alreadyBasicPay: ['', Validators.required],
      alreadyPersonalPay: ['', Validators.required],
      alreadySpecialPay: ['', Validators.required],
      alreadyDaArrear: ['', Validators.required],
      alreadyHraArrear: ['', Validators.required],
      alreadyCcaArrear: ['', Validators.required],
      alreadyMisc1: ['', Validators.required],
      totalDeductions: ['', Validators.required],
      netPay: ['', Validators.required],
      totalDifferenceArrear: ['', Validators.required],
      cpsPercent: ['', Validators.required],
      gpfPercent: ['', Validators.required],
      totalNetpay: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      cpsValue: [null],
      // "payArrearDataAdd": this.recoveryDynamicForm.value.itemsRec

    });

    this.myForm = this.fb.group({
      totalDifferenceArrear: [{ value: null, disabled: true }, Validators.required],
      cpsPercent: [{ value: null, disabled: true }],
      gpfPercent: [{ value: null, disabled: true }],
      totalNetpay: [{ value: null, disabled: true }, Validators.required]
    });
    // If you want to enable cpsPercent or gpfPercent based on some condition (isPF)
    this.myForm.get('cpsPercent').disable(); // or enable() based on isPF
    this.myForm.get('gpfPercent').disable(); // or enable() based on isPF
    this.addRecoveryButton();
    this.getPercentages();
  }

  resetTodate(i: any) {
    const itemsFormArray = this.payArrearForm.get('itemsRec') as FormArray;
    itemsFormArray.at(i).get('toDate')?.reset();
  }

  closeDialog(): void {
    // Close the dialog
    this.dialogRef.close();
  }

  getRecoveryData() {
    this.apiCall.getPayArrearData('getPayArrearData', this.employeeId, this.voucherNo).subscribe((data: any) => {
      console.log(data)
      this.getData = data.data[0]

      console.log(this.getData, "get data")
      if (data.message.includes('not found')) {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: data.message,
        });
      } else {
        this.id = data.data.arrearId;
        const earningsCustomFields = data.data;
        console.log(earningsCustomFields)
        if (earningsCustomFields.length > 0) {
          this.itemsRec.length = 0;
          earningsCustomFields.forEach((fieldData, i) => {
            this.addRecoveryButton(); // Add a new FormGroup to the FormArray
            const expansionPanel = this.itemsRec.at(i) as FormGroup;
            expansionPanel.patchValue({
              fromDate: this.formatDate(earningsCustomFields[i].fromDate), // Assign fromDate directly
              toDate: this.formatDate(earningsCustomFields[i].toDate),
              basicPay: earningsCustomFields[i].basicPay,
              personalPay: earningsCustomFields[i].personalPay,
              specialPay: earningsCustomFields[i].specialPay,
              daArrear: earningsCustomFields[i].daArrear,
              hraArrear: earningsCustomFields[i].hraArrear,
              ccaArrear: earningsCustomFields[i].ccaArrear,
              toBemisc1: earningsCustomFields[i].toBemisc1,
              totalEarning: earningsCustomFields[i].totalEarning,
              alreadyBasicPay: earningsCustomFields[i].alreadyBasicPay,
              alreadyPersonalPay: earningsCustomFields[i].alreadyPersonalPay,
              alreadySpecialPay: earningsCustomFields[i].alreadySpecialPay,
              alreadyDaArrear: earningsCustomFields[i].alreadyDaArrear,
              alreadyHraArrear: earningsCustomFields[i].alreadyHraArrear,
              alreadyCcaArrear: earningsCustomFields[i].alreadyCcaArrear,
              alreadyMisc1: earningsCustomFields[i].alreadyMisc1,
              totalDeductions: earningsCustomFields[i].totalDeductions,
              netPay: earningsCustomFields[i].netPay,
              totalDifferenceArrear: earningsCustomFields[i].totalDifferenceArrear,
              arrearId: earningsCustomFields[i].arrearId,
            });
          });
        }

        if (this.dataType === 'view') {
          // this.recoveryForm.disable();
          this.view = true
          this.payArrearForm.get('totalDifferenceArrear').setValue(this.getData.totalDifferenceArrear)
          this.payArrearForm.get('cpsPercent').setValue(this.getData.cpsPercent)
          this.payArrearForm.get('gpfPercent').setValue(this.getData.gpfPercent)
          this.payArrearForm.get('totalNetpay').setValue(this.getData.totalNetpay)
          this.payArrearForm.disable()
        }
      }
    });
  }

  to_Date: any
  from_Date: any
  onSubmit(i) {
    let indexValues = i;
    // const formValues = this.form.value;
    const itemsFormArray = this.payArrearForm.get('itemsRec') as FormArray;
    this.from_Date = itemsFormArray.at(i).get('fromDate').value
    this.to_Date = itemsFormArray.at(i).get('toDate').value
    const formattedFromDate = this.formatDate(itemsFormArray.at(i).get('fromDate').value);
    const formattedToDate = this.formatDate(itemsFormArray.at(i).get('toDate').value);
    const fromdate = this.formatDate_dd(itemsFormArray.at(i).get('fromDate').value)
    const todate = this.formatDate_dd(itemsFormArray.at(i).get('toDate').value)

    let EmployeeId = this.employeeId;
    console.log(formattedFromDate, formattedToDate)
    // Fetch DA percentage
    this.apiCall.getDaPercent("daPercentage-pay-arrear", itemsFormArray.at(i).get('fromDate').value, itemsFormArray.at(i).get('toDate').value).subscribe((res: any) => {
      this.daPercentage = res;
    });

    // Fetch pay arrear data
    this.apiCall.getPayArrearDataByRange('employee/monthly-salary', fromdate, todate, EmployeeId).subscribe((res: any) => {
      console.log('API Response:', res); // Log the API response
      if (res.status) {
        const control = this.itemsRec.at(i);
        if (control) {
          control.patchValue(res.data[0]);
        }
        this.toastr.success(res.message)
      } else {
        this.toastr.error(res.message)
      }
    });
  }

  formatDate_dd(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  getPercentages() {
    this.apiCall.apiPostCall({ percentageId: 1 }, 'percentage').subscribe(data => {
      console.log(data, "resulttttttt")
      this.percentagesSetup = data.data
      console.log(this.percentagesSetup, "percentagesSetup")
    })
  }

  onFromDateSelect(event: Event, i: any): void {
    // Get the value from the input field
    this.selectedFromDate = (event.target as HTMLInputElement).value;
    console.log('selectedFromDate:', this.selectedFromDate);
    this.apiCall.getDaPercent("daPercentage-pay-arrear", this.selectedFromDate, this.selectedToDate).subscribe((res: any) => {
      console.log(res, "resssssss")
    })
  }

  daPercentage: any
  onToDateSelect(event: Event, i: any) {
    this.selectedToDate = (event.target as HTMLInputElement).value;
    console.log('selectedToDate:', this.selectedToDate);
    console.log(this.selectedFromDate, this.selectedToDate)
    this.apiCall.getDaPercent("daPercentage-pay-arrear", this.selectedFromDate, this.selectedToDate).subscribe((res: any) => {
      console.log(res, "resssssss")
      this.daPercentage = res
    })
  }

  createRec(): FormGroup {
    return this.fb.group({
      arrearId: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      basicPay: ['', Validators.required],
      personalPay: ['', Validators.required],
      specialPay: ['', Validators.required],
      daArrear: ['', Validators.required],
      hraArrear: ['', Validators.required],
      ccaArrear: ['', Validators.required],
      toBemisc1: ['', Validators.required],
      alreadyBasicPay: ['', Validators.required],
      alreadyPersonalPay: ['', Validators.required],
      alreadySpecialPay: ['', Validators.required],
      alreadyDaArrear: ['', Validators.required],
      alreadyHraArrear: ['', Validators.required],
      alreadyCcaArrear: ['', Validators.required],
      alreadyMisc1: ['', Validators.required],
      totalEarning: ['', Validators.required],
      totalDeductions: ['', Validators.required],
      netPay: ['', Validators.required],
      // totalDifferenceArrear: ['', Validators.required],
    });
  }

  get itemsRec() {
    return (this.payArrearForm.get('itemsRec') as FormArray).controls;
  }

  addRecoveryButton() {
    const itemsFormArray = this.payArrearForm.get('itemsRec') as FormArray;
    const newItem = this.createRec();
    itemsFormArray.push(newItem);
  }

  saveRecovery() {
    // if (this.payArrearForm.valid && this.myForm.valid) {
    // if (this.router.url.includes('edit')) {
    const payload = {
      "voucherNo": this.voucherNo,
      "payArrearDataAdd": this.payArrearForm.value.itemsRec,
      // "arrearId": +this.empId
    }
    const itemsFormArray = this.payArrearForm.get('itemsRec') as FormArray;
    // const formValues = this.form.value;
    console.log(this.payArrearForm.value, "values")

    let payArrearDataAdd = this.payArrearForm.value.itemsRec.map((item: any) => {
      console.log(item, "itemmmmmm")
      return {
        ...item,
        employeeId: this.employeeId,
        employeeName: this.data.empName,
        designationName: this.data.desgName,
        officeName: this.data.ofcName,
        voucherNo: this.voucherNo,
        fromDate: this.from_Date,
        toDate: this.to_Date,
        dateOfJoiningService: this.joiningDate,
        officeCode: this.ofcCode,
        totalDifferenceArrear: this.payArrearForm.get('totalDifferenceArrear').value,
        cpsPercent: this.payArrearForm.get('cpsPercent').value,
        gpfPercent: this.payArrearForm.get('gpfPercent').value,
        totalNetpay: this.payArrearForm.get('totalNetpay').value,
      };
    });

    console.log(payArrearDataAdd, "payArrearDataAdd")

    this.apiCall.apiPostCall(payArrearDataAdd, "savePayArrear").subscribe((response: any) => {
      console.log(response, "response")

      if (response.status) {
        this.toastr.success(" Submitted Successfully");
        console.log(response, "response")
        this.dialogRef.close(response.data);

      } else {
        this.toastr.error(response.message);
        this.dialogRef.close(response.data);

      }
    })
    // }else{
    //   this.payArrearForm.markAllAsTouched();
    //    this.myForm.markAllAsTouched();
    // }
  }

  deleteRecoveryButton(i: number) {

    console.log(i, "iiiiiiiii")
    const itemsFormArray = this.payArrearForm.get('itemsRec') as FormArray;
    const nid = itemsFormArray.value[i];

    if (nid.arrearId) {
      const payload = {
        "id": nid.arrearId
      }
      this.apiCall.apiPostCall(payload, 'deletePayArrearById').subscribe({
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

      console.log(itemsFormArray, "itemsFormArray")
      let basicpay = +itemsFormArray.at(i).get('basicPay').value
      let drawnBasicpay = +itemsFormArray.at(i).get('alreadyBasicPay').value

      itemsFormArray.removeAt(i);

      let totalDifference = 0;
      for (const item of this.itemsRec) {
        totalDifference += item.get('netPay').value ? parseFloat(item.get('netPay').value) : 0;
        // basicPay += parseFloat(item.get('basicPay').value);
        // drawnBasicpay += parseFloat(item.get('basicPay').value)
      }
      console.log(totalDifference, "totalNetPaytotalNetPay")
      this.payArrearForm.get('totalDifferenceArrear').setValue(totalDifference)
      console.log(basicpay, drawnBasicpay, "bascic pay datas")
      let totalCpsValue = 0;
      for (let j = 0; j < itemsFormArray.length; j++) {
        let cpsBasicpay = +itemsFormArray.at(j).get('basicPay').value;
        let cpsDrawnBasicpay = +itemsFormArray.at(j).get('alreadyBasicPay').value;
        let cpsDa = +itemsFormArray.at(j).get('daArrear').value;
        let cpsDrawnDa = +itemsFormArray.at(j).get('alreadyDaArrear').value;
        let toBe = cpsBasicpay + cpsDa;
        let already = cpsDrawnBasicpay + cpsDrawnDa;
        totalCpsValue += (toBe - already) * 0.10;
      }
      console.log(totalCpsValue, "totalCpsValue")
      console.log(totalCpsValue * 0.10, "totalCpsValue divided")
      this.payArrearForm.get('cpsPercent').patchValue(totalCpsValue)
      let totalNetPay = totalDifference - totalCpsValue;
      this.payArrearForm.get('totalNetpay').setValue(totalNetPay);
    } else {
      itemsFormArray.removeAt(i);
    }

    // return totalNetPay;

    if (this.isPF == false) {
      this.cpsCal()
    }
  }

  daPercent: any
  basicpay: any
  drawnBasicpay: any
  alreadyDaPercent: any

  tobeDrawn(i: any) {
    let formArray = this.payArrearForm.get('itemsRec') as FormArray;
    console.log(this.daPercentage, "da percent");

    let fromDate = formArray.at(i).get('fromDate').value;
    let toDate = formArray.at(i).get('toDate').value;

    this.apiCall.getDaPercent("daPercentage-pay-arrear", fromDate, toDate).subscribe((res: any) => {
      this.daPercentage = res;

      // To be Drawn
      let basicpay = +formArray.at(i).get('basicPay').value;
      this.basicpay = basicpay;
      let personalpay = +formArray.at(i).get('personalPay').value;
      let specialpay = +formArray.at(i).get('specialPay').value;
      let hra = +formArray.at(i).get('hraArrear').value;
      let cca = +formArray.at(i).get('ccaArrear').value;
      let toBemisc1 = +formArray.at(i).get('toBemisc1').value; // Miscellaneous

      this.daPercent = basicpay * this.daPercentage / 100;
      formArray.at(i).get("daArrear").setValue(Math.round(this.daPercent));

      console.log(basicpay, personalpay, specialpay, Math.round(this.daPercent), hra, cca, toBemisc1, "details");

      this.toBeDrawnTotal = basicpay + personalpay + specialpay + Math.round(this.daPercent) + hra + cca + toBemisc1;
      formArray.at(i).get("totalEarning").setValue(this.toBeDrawnTotal);

      // Already Drawn
      let drawnBasicpay = +formArray.at(i).get('alreadyBasicPay').value;
      this.drawnBasicpay = drawnBasicpay;
      let drawnPersonalpay = +formArray.at(i).get('alreadyPersonalPay').value;
      let drawnSpecialpay = +formArray.at(i).get('alreadySpecialPay').value;
      let drawnHra = +formArray.at(i).get('alreadyHraArrear').value;
      let drawnCca = +formArray.at(i).get('alreadyCcaArrear').value;
      let drawnMisc = +formArray.at(i).get('alreadyMisc1').value;
      this.alreadyDaPercent = (drawnBasicpay + drawnPersonalpay) * this.daPercentage / 100;
      formArray.at(i).get("alreadyDaArrear").setValue(Math.round(this.alreadyDaPercent));
      this.alreadyDrawnValue = drawnBasicpay + drawnPersonalpay + drawnSpecialpay + Math.round(this.alreadyDaPercent) + drawnHra + drawnCca + drawnMisc;
      formArray.at(i).get("totalDeductions").setValue(this.alreadyDrawnValue);

      // Difference
      let difference = this.toBeDrawnTotal - this.alreadyDrawnValue;
      formArray.at(i).get("netPay").setValue(difference);
      let totalDifference = 0;
      for (const item of this.itemsRec) {
        totalDifference += item.get('netPay').value ? parseFloat(item.get('netPay').value) : 0;
      }
      this.payArrearForm.get('totalDifferenceArrear').setValue(totalDifference);
      // CPS Calculation for the current item
      console.log(basicpay, Math.round(this.daPercent), drawnBasicpay, Math.round(this.alreadyDaPercent))
      let cpsToBeDrawn = basicpay + Math.round(this.daPercent);
      console.log(cpsToBeDrawn, "cpsToBeDrawn")
      let cpsAlreadyDrawn = drawnBasicpay + Math.round(this.alreadyDaPercent);
      console.log(cpsAlreadyDrawn, "cpsAlreadyDrawn")

      let cpsDifference = cpsToBeDrawn - cpsAlreadyDrawn;
      console.log(cpsDifference, "cpsDifference")
      let cpsValue = cpsDifference * 0.10; // Calculating 10%
      console.log(cpsValue, "cpsValue")
      // formArray.at(i).get('cpsPercent').setValue(cpsValue);
      this.payArrearForm.get('cpsPercent').patchValue(cpsValue)

      let totalCpsValue = 0;
      for (let j = 0; j < formArray.length; j++) {
        let cpsBasicpay = +formArray.at(j).get('basicPay').value;
        let cpsDrawnBasicpay = +formArray.at(j).get('alreadyBasicPay').value;
        let cpsDa = +formArray.at(j).get('daArrear').value;
        let cpsDrawnDa = +formArray.at(j).get('alreadyDaArrear').value;
        let toBe = cpsBasicpay + cpsDa;
        let already = cpsDrawnBasicpay + cpsDrawnDa;
        totalCpsValue += (toBe - already) * 0.10;
      }
      console.log(totalCpsValue, "totalCpsValue")
      console.log(totalCpsValue * 0.10, "totalCpsValue divided")
      this.payArrearForm.get('cpsPercent').patchValue(totalCpsValue)
      let totalNetPay = totalDifference - totalCpsValue;
      this.payArrearForm.get('totalNetpay').setValue(totalNetPay);
    });

    if (this.isPF == false) {
      this.cpsCal();
    }
  }

  cpsCal() {

    const itemsFormArray = this.payArrearForm.get('itemsRec') as FormArray;
    console.log(itemsFormArray, "itemsFormArray")
    let totalDifference = 0;
    let basicPay = 0;
    let drawnBasicpay = 0;
    for (const item of this.itemsRec) {
      totalDifference += item.get('netPay').value ? parseFloat(item.get('netPay').value) : 0;
      // basicPay += parseFloat(item.get('basicPay').value);
      // drawnBasicpay += parseFloat(item.get('basicPay').value);
    }

    let totalCpsValue = 0;
    for (let j = 0; j < itemsFormArray.length; j++) {
      let cpsBasicpay = +itemsFormArray.at(j).get('basicPay').value;
      let cpsDrawnBasicpay = +itemsFormArray.at(j).get('alreadyBasicPay').value;
      let cpsDa = +itemsFormArray.at(j).get('daArrear').value;
      let cpsDrawnDa = +itemsFormArray.at(j).get('alreadyDaArrear').value;
      let toBe = cpsBasicpay + cpsDa;
      let already = cpsDrawnBasicpay + cpsDrawnDa;
      totalCpsValue += (toBe - already) * 0.10;
    }
    console.log(totalCpsValue, "totalCpsValue")
    console.log(totalCpsValue * 0.10, "totalCpsValue divided")
    this.payArrearForm.get('cpsPercent').patchValue(totalCpsValue)
    let totalNetPay = totalDifference - totalCpsValue;
    this.payArrearForm.get('totalNetpay').setValue(totalNetPay);
  }

  gpfCal(event: any) {
    let gpf = +event.target.value
    console.log(gpf, "gpf")
    let totalDifference = 0;
    for (const item of this.itemsRec) {
      totalDifference += item.get('netPay').value ? parseFloat(item.get('netPay').value) : 0;
    }
    this.payArrearForm.get('totalDifferenceArrear').setValue(totalDifference)
    let gpfValue = totalDifference - gpf
    this.payArrearForm.get('totalNetpay').setValue(gpfValue)

    // let totalNetPay = totalDifference + cpsValue
  }

  alreadyDrawn(item: any) {
    // let drawnBasicpay = Number(item.get('alreadyBasicPay').value);
    // let drawnPersonalpay = Number(item.get('alreadyPersonalPay').value);
    // let drawnSpecialpay = Number(item.get('alreadySpecialPay').value);
    // let drawnDa = Number(item.get('alreadyDaArrear').value);
    // let drawnHra = Number(item.get('alreadyHraArrear').value);
    // let drawnCca = Number(item.get('alreadyCcaArrear').value);
    this.differenceValues(item)
  }

  totalDifference = 0;
  differenceValues(item: any) {
    console.log(typeof this.toBeDrawnTotal, typeof this.alreadyDrawnValue)
    let difference = this.toBeDrawnTotal - this.alreadyDrawnValue
    // let ingoreSymbol = Math.abs(difference)
    console.log(difference, "difference")
    item.patchValue({ netPay: difference })
    // return Math.abs(difference);
    // this.calculateTotalDifference([item])
    console.log("calcccccccccccccccc")

    let totalNetPay = 0;
    for (const item of this.itemsRec) {
      totalNetPay += item.get('netPay').value ? parseFloat(item.get('netPay').value) : 0;
    }
    console.log(totalNetPay, "totalNetPaytotalNetPay")
    this.payArrearForm.get('totalDifferenceArrear').setValue(totalNetPay)
    return totalNetPay;
  }

  //decimal codes

  decimalInput(formName: string, controlName: string, index: number) {
    console.log(formName, controlName, index)
    const formArray = this[formName].get('itemsRec') as FormArray;
    console.log(formArray, "formArray")
    const control = formArray.at(index).get(controlName);
    console.log(control, "control")
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
    console.log(formName, controlName, index, "formattoTWO ")
    const formArray = this[formName].get('itemsRec') as FormArray;
    console.log(formArray, "formArray")
    const control = formArray.at(index).get(controlName);
    console.log(control, "control")
    if (control) {
      let value = control.value;
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        control.setValue(numericValue.toFixed(2), { emitEvent: false });
      }
    }
  }
}














