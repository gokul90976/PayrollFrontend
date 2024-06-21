

import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { HttpService } from '../../services/http.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-popup-da-edit',
  templateUrl: './popup-da-edit.component.html',
  styleUrl: './popup-da-edit.component.css'
})
export class PopupDaEditComponent {

  employeeForm!: FormGroup;
  earningForm!: FormGroup;
  deductionForm!: FormGroup;
  totalEarning!: number;
  earningCFForm: FormGroup;
  deductionCFForm: FormGroup;
  empId: any;
  edit = false;
  view = false;
  nid = null;
  getData: any;
  empJoingDate: any;
  specialPFApplicable: boolean
  idData: any;
  joiningDate: any;
  basicPayValue: any;
  isMD: boolean
  hrrValue: any;
  percentages: any
  isPF: boolean
  daStatus: boolean
  rentType: boolean = true
  rentstatus: any;
  cpsValue: number;
  gpfValue: any;
  hbfValue: any;
  cessValue: any
  id: any;

    // getEmployeePayRollByEmployeeId =>edit
  // getAllEmployeeByEmpId  =>Add
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupDaEditComponent>, private fb: FormBuilder,
    private httpservice: HttpService, private activeRoute: ActivatedRoute, private apiCall: ApiService, private snackbar: MatSnackBar) {
    if (this.data) {
      console.log(this.data,"dataaaaaaaaaa")
      this.empId = data.empId
      this.getEmployeeData();
    }
    if (this.data.type === 'edit') {
      this.edit = true;
    } else {
      this.view = true;
    }

  }

  close() {
    this.dialogRef.close();
  }
  getEmployeeData() {
    const payload = {
      "id": 1
    }
    this.apiCall.apiPostCall(payload, 'getMonthlySalaryNewById').subscribe((data:any) => {
      this.getData = data.data.officeName
          this.empJoingDate = data.data.dateOfJoiningService
          console.log(this.empJoingDate, "getData")

          // let employeeJoiningDate = this.empJoingDate
          // console.log(employeeJoiningDate,"dateeeeeeeeee")

          let joiningDate: Date = new Date('1996-03-01');
          console.log(joiningDate, "276")
          this.specialPFApplicable = this.apiCall.calculateSpecialPF(joiningDate)
          console.log(this.specialPFApplicable, "status")

          this.idData = data.data.differentlyAbled
          this.joiningDate = data.data.dateOfJoiningService
          this.basicPayValue = +data.data.basicPay
          // this.hrrValue = (this.basicPayValue * (this.percentages.hrrPercentage / 100)).toFixed(2)
          // this.earningForm.patchValue({ hrr: this.hrrValue })
          // this.earningForm.get('hrr')!.disable();
          if (this.getData == 'Managing Director') {
            this.isMD = true
            this.hrrValue = (this.basicPayValue * (this.percentages.hrrPercentage / 100)).toFixed(2)
            this.earningForm.patchValue({ hrr: this.hrrValue })
            this.earningForm.get('hrr')!.disable();
          } else {
            this.isMD = false
          }
          if (this.joiningDate > "01-04-2003") {
            this.employeeForm.patchValue({ pfcps: "CPS" });
            this.isPF = false
            // this.get_DA('CPS')
            // let da = 500     //static value for now
            // let da = this.earningForm.get('da').value;
            // console.log("da",da)
            // let cps_Value = this.basicPayValue + da
            // this.cpsValue = cps_Value * (this.percentages.cpsPercentage / 100)
            // this.deductionForm.patchValue({ cps: this.cpsValue })
            // this.deductionForm.get('cps')!.disable();
          } else {
            this.employeeForm.patchValue({ pfcps: "PF" });
            this.isPF = true
            // this.get_DA('PF')
            // let da = 500     //static value for now
            // let da = this.earningForm.get('da').value;
            // console.log("da",da)
            // let gpf_Value = this.basicPayValue + da
            // this.gpfValue = gpf_Value * (this.percentages.gpfPercentage / 100)
            // this.deductionForm.patchValue({ gpfSub: this.gpfValue })
            // this.deductionForm.get('gpfSub')!.disable();
          }
          if (this.idData == "No") {
            this.daStatus = true
          } else {
            this.daStatus = false
          }

      if (data.message.includes('not found')) {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: data.message,
        });
      } else {
        this.employeeForm.patchValue(data.data);
        this.earningForm.patchValue(data.data);
        this.deductionForm.patchValue(data.data);
        this.nid = data.data.nid;
        const earningsCustomFields: any = data.data;
        console.log(earningsCustomFields,"dgfd")
        if (earningsCustomFields.length > 0) {
          this.items.length = 0;
          earningsCustomFields.forEach((fam, i) => {
            this.addItem();
            const expansionPanel = this.items.at(i) as FormGroup;
            expansionPanel.patchValue({
              employeeId: earningsCustomFields[i].employeeId,
              fieldType: earningsCustomFields[i].fieldType,
              familyMemDob: earningsCustomFields[i].familyMemDob,
              customFieldName: earningsCustomFields[i].customFieldName,
              customFieldValue: earningsCustomFields[i].customFieldValue,
              nId: earningsCustomFields[i].nid,
            });
          })
        }
        const deductionCustomFields: any = data.data;
        console.log(deductionCustomFields,"deductionCustomFields")
        if (deductionCustomFields.length > 0) {
          this.itemsDeduct.length = 0;
          deductionCustomFields.forEach((fam, i) => {
            this.addDeductButton();
            const expansionPanel = this.itemsDeduct.at(i) as FormGroup;
            expansionPanel.patchValue({
              employeeId: deductionCustomFields[i].employeeId,
              fieldType: deductionCustomFields[i].fieldType,
              familyMemDob: deductionCustomFields[i].familyMemDob,
              customFieldName: deductionCustomFields[i].customFieldName,
              customFieldValue: deductionCustomFields[i].customFieldValue,
              nId: deductionCustomFields[i].nid,
            });
          })
        }
        if (this.view === true) {
          this.employeeForm.disable();
          this.earningForm.disable();
          this.deductionForm.disable();
        }
      }
    })
  }



  fetchData() {
    if (this.employeeForm.controls['employeeId'].valid) {
      const payload = {
        "employeeId": this.employeeForm.controls['employeeId'].value
      }
      this.empId = this.employeeForm.controls['employeeId'].value;
      this.apiCall.apiPostCall(payload, 'getAllEmployeeByEmpId').subscribe(data => {
        if (data.message.includes('not found')) {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: data.message,
          });
        } else if (data.data.employeeId !== null) {
          this.employeeForm.patchValue(data.data)
        } else {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: 'No data found -' + ' ' + `${this.empId}`,
          });
        }
      }, error => {
        this.snackbar.open('An error occurred while saving data. Please try again later.', 'Dismiss', {
          duration: 3000, // Adjust the duration as needed
        });
      })

    } else {
      this.employeeForm.controls['employeeId'].markAsTouched();
      this.employeeForm.updateValueAndValidity()
      return;
    }

  }
  postNewEmployee() {
    const data = {
      "employeeId": this.employeeForm.controls['employeeId'].value,
      "employeeName": this.employeeForm.controls['employeeName'].value,
      "officeCode": this.employeeForm.controls['officeCode'].value,
      "officeName": this.employeeForm.controls['officeName'].value,
      "designationCode": this.employeeForm.controls['designationCode'].value,
      "designationName": this.employeeForm.controls['designationName'].value,
      "panNo": this.employeeForm.controls['panNo'].value,
      "aadharNo": this.employeeForm.controls['aadharNo'].value,
      "mobileNo": this.employeeForm.controls['mobileNo'].value,
      "emailId": this.employeeForm.controls['emailId'].value,
      "differentlyAbled": Number(this.employeeForm.controls['differentlyAbled'].value),
      "dateOfJoiningService": Number(this.employeeForm.controls['dateOfJoiningService'].value),
      "scaleOfPay": Number(this.employeeForm.controls['scaleOfPay'].value),
      "basicPay": this.employeeForm.controls['basicPay'].value,
      "levelAsPerPayMatrix": this.employeeForm.controls['levelAsPerPayMatrix'].value,
      "levelAsPerCellMatrix": this.employeeForm.controls['levelAsPerCellMatrix'].value,
      "incrementDueDate": Number(this.employeeForm.controls['incrementDueDate'].value),
      "dateOfRetirement": this.employeeForm.controls['dateOfRetirement'].value,
      "transferOfficeCode": this.employeeForm.controls['transferOfficeCode'].value,
      "transferOfficeName": this.employeeForm.controls['transferOfficeName'].value,
      "dateOfJoiningTransfer": this.employeeForm.controls['dateOfJoiningTransfer'].value,
      "conveyanceAllowance": this.employeeForm.controls['conveyanceAllowance'].value,
      "rent": Number(this.employeeForm.controls['rent'].value),
      "bankName": this.employeeForm.controls['bankName'].value,
      "bankBranchName": this.employeeForm.controls['bankBranchName'].value,
      "bankAcNo": this.employeeForm.controls['bankAcNo'].value,
      "bankIFSC": this.employeeForm.controls['bankIFSC'].value,
      "payStatus": this.employeeForm.controls['payStatus'].value,
      // "hraGrade": Number(this.employeeForm.controls['hraGrade'].value),
      // "ccaGrade": Number(this.employeeForm.controls['ccaGrade'].value),
      // "dapercentage": Number(this.employeeForm.controls['daPercentage'].value),
      // "pfpercentage": Number(this.employeeForm.controls['pfPercentage'].value),
      // "cpsPercentage": Number(this.employeeForm.controls['cpsPercentage'].value).toString(),


      "basicPayEarning": Number(this.earningForm.controls['basicPayEarning'].value),
      "specialPay": Number(this.earningForm.controls['specialPay'].value),
      "da": Number(this.earningForm.controls['da'].value),
      "hra": Number(this.earningForm.controls['hra'].value),
      "cca": Number(this.earningForm.controls['cca'].value),
      "medicalAllowance": Number(this.earningForm.controls['medicalAllowance'].value),
      "fta": Number(this.earningForm.controls['fta'].value),
      "hillAllowance": Number(this.earningForm.controls['hillAllowance'].value),
      "winterAllowance": Number(this.earningForm.controls['winterAllowance'].value),
      "washingAllowance": Number(this.earningForm.controls['washingAllowance'].value),
      "conveyanceAllowanceEarnings": Number(this.earningForm.controls['conveyanceAllowanceEarnings'].value),
      "cashAllowance": Number(this.earningForm.controls['cashAllowance'].value),
      "interimRelief": Number(this.earningForm.controls['interimRelief'].value),
      "misc1": Number(this.earningForm.controls['misc1'].value),
      "misc2": Number(this.earningForm.controls['misc2'].value),
      "misc3": Number(this.earningForm.controls['misc3'].value),
      "misc4": Number(this.earningForm.controls['misc4'].value),
      "misc5": Number(this.earningForm.controls['misc5'].value),
      "personalPay": Number(this.earningForm.controls['personalPay'].value),
      "totalEarning": Number(this.earningForm.controls['totalEarning'].value),

      "gpfSub": Number(this.deductionForm.controls['gpfSub'].value),
      "vpf": Number(this.deductionForm.controls['vpf'].value),
      "cps": Number(this.deductionForm.controls['cps'].value),
      "fbf": Number(this.deductionForm.controls['fbf'].value),
      "nhis": Number(this.deductionForm.controls['nhis'].value),
      "specialPf": Number(this.deductionForm.controls['specialPf'].value),
      "hba": Number(this.deductionForm.controls['hba'].value),
      "hbf": Number(this.deductionForm.controls['hbf'].value),
      "rentDeductions": Number(this.deductionForm.controls['rentDeductions'].value),
      "waterCharges": Number(this.deductionForm.controls['waterCharges'].value),
      "professionalTax": Number(this.deductionForm.controls['professionalTax'].value),
      "oneDayRecovery": Number(this.deductionForm.controls['oneDayRecovery'].value),
      "incomeTax": Number(this.deductionForm.controls['incomeTax'].value),
      "incomeTaxCess": Number(this.deductionForm.controls['incomeTaxCess'].value),
      "eoe": Number(this.deductionForm.controls['eoe'].value),
      "hrr": Number(this.deductionForm.controls['hrr'].value),
      "gpfloan": Number(this.deductionForm.controls['gpfloan'].value),
      "gpfarrear": Number(this.deductionForm.controls['gpfarrear'].value),
      "cpsArrear": Number(this.deductionForm.controls['cpsArrear'].value),
      "festivalAdvance": Number(this.deductionForm.controls['festivalAdvance'].value),
      "conveyanceAdvance": Number(this.deductionForm.controls['conveyanceAdvance'].value),
      "educationAdvance": Number(this.deductionForm.controls['educationAdvance'].value),
      "marriageAdvance": Number(this.deductionForm.controls['marriageAdvance'].value),
      "payAdvance": Number(this.deductionForm.controls['payAdvance'].value),
      "netPay": Number(this.deductionForm.controls['netPay'].value),
      "miscDeduction1": Number(this.deductionForm.controls['miscDeduction1'].value),
      "miscDeduction2": Number(this.deductionForm.controls['miscDeduction2'].value),
      "miscDeduction3": Number(this.deductionForm.controls['miscDeduction3'].value),
      "miscDeduction4": Number(this.deductionForm.controls['miscDeduction4'].value),
      "miscDeduction5": Number(this.deductionForm.controls['miscDeduction5'].value),
      "earningsCustomFields": this.earningCFForm.value.items,
      "deductionCustomFields": this.deductionCFForm.value.itemsDeduct,
      "nid": this.nid,
    }
    this.dialogRef.close(data)
  }


  ngOnInit() {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeName: [''],
      officeCode: [''],
      officeName: [''],
      designationCode: [''],
      designationName: [''],
      panNo: [''],
      aadharNo: [''],
      mobileNo: [''],
      emailId: [''],
      differentlyAbled: [''],
      dateOfJoiningService: [''],
      dateOfBirth: [''],
      scaleOfPay: [''],
      basicPay: [''],
      levelAsPerPayMatrix: [''],
      levelAsPerCellMatrix: [''],
      incrementDueDate: ['', Validators.required],
      dateOfRetirement: ['', Validators.required],
      transferOfficeCode: ['', Validators.required],
      transferOfficeName: ['', Validators.required],
      dateOfJoiningTransfer: ['', Validators.required],
      conveyanceAllowance: ['', Validators.required],
      rent: ['', Validators.required],
      bankName: ['', Validators.required],
      bankBranchName: ['', Validators.required],
      bankAcNo: ['', Validators.required],
      bankIFSC: ['', Validators.required],
      payStatus: ['', Validators.required],
      pfcps: ['', Validators.required],
      // hraGrade: ['', Validators.required],
      // ccaGrade: ['', Validators.required],
      // daPercentage: ['', Validators.required],
      // pfPercentage: ['', Validators.required],
      // cpsPercentage: ['', Validators.required]

    });
    this.employeeForm.get('employeeName')!.disable();
    this.employeeForm.get('officeCode')!.disable();
    this.employeeForm.get('officeName')!.disable();
    this.employeeForm.get('designationCode')!.disable();
    this.employeeForm.get('designationName')!.disable();
    this.employeeForm.get('panNo')!.disable();
    this.employeeForm.get('aadharNo')!.disable();
    this.employeeForm.get('mobileNo')!.disable();
    this.employeeForm.get('emailId')!.disable();
    this.employeeForm.get('differentlyAbled')!.disable();
    this.employeeForm.get('dateOfJoiningService')!.disable();
    this.employeeForm.get('dateOfBirth')!.disable();
    this.employeeForm.get('scaleOfPay')!.disable();
    this.employeeForm.get('basicPay')!.disable();
    this.employeeForm.get('levelAsPerPayMatrix')!.disable();
    this.employeeForm.get('levelAsPerCellMatrix')!.disable();
    this.employeeForm.get('incrementDueDate')!.disable();
    this.employeeForm.get('dateOfRetirement')!.disable();
    this.employeeForm.get('transferOfficeCode')!.disable();
    this.employeeForm.get('transferOfficeName')!.disable();
    this.employeeForm.get('dateOfJoiningTransfer')!.disable();
    this.employeeForm.get('conveyanceAllowance')!.disable();

    // this.employeeForm.get('disability')?.valueChanges.subscribe((disabilityvalue) => {
    //   const pfControl = this.employeeForm.get('PF');
    //   // Enable or disable the 'pf' control based on the 'disability' value
    //   if (disabilityvalue == 'Yes' || disabilityvalue == 'yes') {
    //     pfControl?.disable();
    //   } else {
    //     pfControl?.enable();
    //   }
    // });

    // this.employeeForm.get('pfcps')?.valueChanges.subscribe((selectedValue) => {
    //   const pfControl = this.employeeForm.get('PF');
    //   const cpsControl = this.employeeForm.get('CPS');
    //   console.log(selectedValue);


    //   // Enable/disable PF and CPS fields based on the selection
    //   if (selectedValue == 'PF') {
    //     pfControl?.enable();
    //     cpsControl?.disable();
    //   } else {
    //     pfControl?.disable();
    //     cpsControl?.enable();
    //   }
    // });




    this.earningForm = this.fb.group({
      basicPayEarning: ['', Validators.required],
      specialPay: ['', Validators.required],
      da: ['', Validators.required],
      hra: ['', Validators.required],
      cca: ['', Validators.required],
      medicalAllowance: ['', Validators.required],
      fta: ['', Validators.required],
      hillAllowance: ['', Validators.required],
      winterAllowance: ['', Validators.required],
      washingAllowance: ['', Validators.required],
      conveyanceAllowanceEarnings: ['', Validators.required],
      interimRelief: ['', Validators.required],
      cashAllowance: ['', Validators.required],
      misc1: ['', Validators.required],
      misc2: ['', Validators.required],
      misc3: ['', Validators.required],
      misc4: ['', Validators.required],
      misc5: ['', Validators.required],
      personalPay: ['', Validators.required],
      // earncustomLabel: ['', Validators.required],
      // earncustomValue: ['', Validators.required],
      totalEarning: []
    })

    this.earningForm.valueChanges.subscribe((data) => {
      if (data) {
        this.calculateTotalEarnings();
      }
    });



    this.deductionForm = this.fb.group({
      gpfSub: ['', Validators.required],
      vpf: ['', Validators.required],
      cps: ['', Validators.required],
      fbf: ['', Validators.required],
      nhis: ['', Validators.required],
      specialPf: ['', Validators.required],
      hba: ['', Validators.required],
      hbf: ['', Validators.required],
      rentDeductions: ['', Validators.required],
      waterCharges: ['', Validators.required],
      professionalTax: ['', Validators.required],
      oneDayRecovery: ['', Validators.required],
      incomeTax: ['', Validators.required],
      incomeTaxCess: ['', Validators.required],
      eoe: ['', Validators.required],
      hrr: ['', Validators.required],
      gpfloan: ['', Validators.required],
      gpfarrear: ['', Validators.required],
      cpsArrear: ['', Validators.required],
      festivalAdvance: ['', Validators.required],
      conveyanceAdvance: ['', Validators.required],
      educationAdvance: ['', Validators.required],
      marriageAdvance: ['', Validators.required],
      payAdvance: ['', Validators.required],
      miscDeduction1: ['', Validators.required],
      miscDeduction2: ['', Validators.required],
      miscDeduction3: ['', Validators.required],
      miscDeduction4: ['', Validators.required],
      miscDeduction5: ['', Validators.required],
      deductcustomLabel: ['', Validators.required],
      deductcustomValue: ['', Validators.required],
      totalDeductions: [''],
      netPay: [''],

    })

    this.deductionForm.valueChanges.subscribe((data) => {
      if (data) {
        this.calculateTotalDeductions();
      }
    })
    this.earningCFForm = this.fb.group({
      items: this.fb.array([])
    });

    this.deductionCFForm = this.fb.group({
      itemsDeduct: this.fb.array([])
    });

    // this.addItem();
    // this.addDeductButton()

  }

  calculateTotalEarnings() {
    // Get values from form controls and sum them up
    this.earningForm.valueChanges.pipe(take(1)).subscribe(() => {
      const earnFields = [
        'basicPayEarning', 'personalPay', 'specialPay', 'da', 'hra', 'cca', 'medicalAllowance', 'fta', 'winterAllowance',
        'hillAllowance', 'washingAllowance', 'conveyanceAllowanceEarnings', 'cashAllowance','interimRelief', 'misc1', 'misc2', 'misc3', 'misc4', 'misc5', 'earncustomValue'
      ];
      const totalEarning = earnFields
        .map(field => parseFloat(this.earningForm.get(field)?.value || 0))
        .reduce((sum, value) => sum + value, 0);

      if (totalEarning !== this.earningForm.get('totalEarning')?.value) {
        this.earningForm.get('totalEarning')?.setValue(totalEarning);
      }
    })

  }
  createItem(): FormGroup {
    return this.fb.group({
      employeeId: [this.empId],
      fieldType: ['earnings'],
      customFieldName: [''],
      customFieldValue: [''],
      nId: [''],
    });
  }

  createDeductItem(): FormGroup {
    return this.fb.group({
      employeeId: [this.empId],
      fieldType: ['deductions'],
      customFieldName: [''],
      customFieldValue: [''],
      nId: [''],
    });
  }


  addDeductButton() {
    const itemsFormArray = this.deductionCFForm.get('itemsDeduct') as FormArray;
    const newItem = this.createDeductItem();
    itemsFormArray.push(newItem);

  }
  addItem() {
    const itemsFormArray = this.earningCFForm.get('items') as FormArray;
    const newItem = this.createItem();
    itemsFormArray.push(newItem);
  }


  get items() {
    return (this.earningCFForm.get('items') as FormArray).controls;
  }

  get itemsDeduct() {
    return (this.deductionCFForm.get('itemsDeduct') as FormArray).controls;
  }

  deleteEarnButton(i: number, item) {
    const itemsFormArray = this.earningCFForm.get('items') as FormArray;
    const nid = itemsFormArray.value[i].nId;
    if (nid) {
      const payload = {
        "nId": nid
      }
      this.apiCall.apiPostCall(payload, 'deleteEmpCustomFields').subscribe({
        next: (response: any) => {
          if (response?.message && (response?.message.includes("SuccesFully"))) {
            itemsFormArray.removeAt(i);
          }
        }
      })
    } else {
      itemsFormArray.removeAt(i);
    }
  }

  deletedeductButton(i: number) {
    const itemsFormArray = this.deductionCFForm.get('itemsDeduct') as FormArray;
    const nid = itemsFormArray.value[i].nId;
    if (nid) {
      const payload = {
        "nId": nid
      }
      this.apiCall.apiPostCall(payload, 'deleteEmpCustomFields').subscribe({
        next: (response: any) => {
          if (response?.message && (response?.message.includes("SuccesFully"))) {
            itemsFormArray.removeAt(i);
          }
        }
      })
    } else {
      itemsFormArray.removeAt(i);
    }
  }

  // ------------------------------------



  isCalculating = false;
  calculateTotalDeductions() {
    this.deductionForm.valueChanges.pipe(take(1)).subscribe(() => {
      const deductionFields = [
        'pfSub', 'pfArrear', 'cps', 'vpf', 'fbf', 'spf', 'mrf', 'hba', 'hbf', 'rentTNGRHS',
        'rentBoard', 'waterCharges', 'lic', 'pli', 'rdpo', 'profTax', 'eoe', 'societySubs',
        'societyLoan', 'hrr', 'it', 'cess', 'miscDeduction1', 'pfLoan', 'cpsLoan', 'fa',
        'conveyanceAdvance', 'marriageAdvance', 'educationalAdvance', 'otherAdvance',
        'payAdvance', 'bankLoan', 'securityDeposite', 'excessPay', 'count', 'miscDeductions',
        'deductcustomLabel', 'deductcustomValue'
      ];
      const totalDeductions = deductionFields
        .map(field => parseFloat(this.deductionForm.get(field)?.value || 0))
        .reduce((sum, value) => sum + value, 0);

      // Check if the value has changed before updating the form control
      if (totalDeductions !== this.deductionForm.get('totalDeductions')?.value) {
        this.deductionForm.get('totalDeductions')?.setValue(totalDeductions);
      }

      // Use a setTimeout to delay netPay calculation
      setTimeout(() => {
        const totalEarn = +this.earningForm.get('totalEarning').value || 0;
        const totaldeduction = +this.deductionForm.get('totalDeductions').value || 0;
        const netpay = totalEarn - totaldeduction;

        // Set netPay value
        this.deductionForm.get('netPay')?.setValue(netpay);
      }, 5000);
    });
  }

  rentStatus(event: any) {
    console.log(event.target.value)
    this.rentstatus = event.target.value
    if (this.rentstatus == 'no') {
      this.rentType = false
    } else if (this.rentstatus == 'notional') {
      this.rentType = true
      this.deductionForm.get('rentDeductions')!.enable();
      this.deductionForm.controls['rentDeductions'].reset()
    } else if (this.rentstatus == 'concessional') {
      //calculationasss
      this.rentType = true
      this.deductionForm.controls['rentDeductions'].reset()
      this.deductionForm.patchValue({ rentDeductions: 'calc' })
      this.deductionForm.get('rentDeductions')!.disable();
    }
  }

  get_DA(event: any) {
    if (this.joiningDate > "01-04-2003") {   //CPS
      // let da = this.earningForm.get('da').value;
      let da = +event.target.value;
      let cps_Value = this.basicPayValue + da
      let cpsPreValue = cps_Value * (this.percentages.cpsPercentage / 100)
      this.cpsValue = Math.ceil(cpsPreValue)
      this.deductionForm.patchValue({ cps: this.cpsValue })
      this.deductionForm.get('cps')!.disable();
    } else {                                                        //PF
      // let da = this.earningForm.get('da').value;
      let da = +event.target.value;
      let gpf_Value = this.basicPayValue + da
      let gpfprevValue = gpf_Value * (this.percentages.gpfPercentage / 100)
      this.gpfValue = Math.ceil(gpfprevValue / 100) * 100;
      this.deductionForm.patchValue({ gpfSub: this.gpfValue })
      this.deductionForm.get('gpfSub')!.disable();
    }

    // if(data == 'CPS'){
    //   let da = this.earningForm.get('da').value;
    //       console.log("da",da)
    //       let cps_Value = this.basicPayValue + da
    //       this.cpsValue = cps_Value * (this.percentages.cpsPercentage / 100)
    //       this.deductionForm.patchValue({ cps: this.cpsValue })
    //       this.deductionForm.get('cps')!.disable();
    // }else{
    //   let da = this.earningForm.get('da').value;
    //       console.log("da",da)
    //       let gpf_Value = this.basicPayValue + da
    //       this.gpfValue = gpf_Value * (this.percentages.gpfPercentage / 100)
    //       this.deductionForm.patchValue({ gpfSub: this.gpfValue })
    //       this.deductionForm.get('gpfSub')!.disable();
    // }
  }

  onKeyHBA(event) {
    let hbaValue = event.target.value
    this.hbfValue = hbaValue * Math.round(this.percentages.hbfPercentage) / 100
    // let roundedInteger: number = Math.round(num);
    // let ceiledInteger: number = Math.ceil(num);
    this.deductionForm.patchValue({ hbf: this.hbfValue });
    this.deductionForm.get('hbf')!.disable();
  }

  onKeyIT(event) {
    let itValue = event.target.value
    //  this.cessValue = itValue *  (this.percentages.itcPercentage / 100)
    this.cessValue = itValue * Math.round(this.percentages.itcPercentage) / 100
    this.deductionForm.patchValue({ incomeTaxCess: this.cessValue });
    this.deductionForm.get('incomeTaxCess')!.disable();
  }

}


