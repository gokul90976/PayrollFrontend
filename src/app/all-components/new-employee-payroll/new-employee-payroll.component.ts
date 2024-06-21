import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { HttpService } from '../../services/http.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-new-employee-payroll',
  templateUrl: './new-employee-payroll.component.html',
  styleUrl: './new-employee-payroll.component.css'
})
export class NewEmployeePayrollComponent {

  employeeForm!: FormGroup;
  earningForm!: FormGroup;
  deductionForm!: FormGroup;
  totalEarning!: number;
  totalDeductions!: number;
  totalSubmit!: FormGroup
  earningCFForm: FormGroup;
  deductionCFForm: FormGroup;
  empId: any;
  edit = false;
  view = false;
  nid: any;
  rentstatus: any;
  consessionalEnable: boolean = false
  notionalEnable: boolean = false
  salaryDeductionRent: boolean = false
  salaryType: any;
  typeisPF: boolean
  dateFormat: Date;
  idData: any;
  daStatus: boolean
  joiningDate: any;
  payType: any;
  isPF: boolean
  rentType: boolean = false
  percentages: any
  cessValue: any
  hbfValue: any;
  gpfValue: any;
  basicPayValue: any;
  cpsValue: number;
  hrrValue: any;
  getData: any;
  isMD: boolean
  specialPFApplicable: boolean
  empJoingDate: any;
  sumValue: any;
  officeCode: any;
  gradeValue: any;
  specialPay: any;
  personalPay: any;
  basicPay: any;
  calValue: any;
  ccaGradeValue: number;
  todayDate: string;
  enteredDaValue: number;
  daValue: number;
  isJoindateValid: boolean
  checkDate: string;
  concessValue: any
  isVpf: boolean
  daysInCurrentMonth:any
  basicPayValueEarning:any
  // paymentType = "no"

  constructor(private fb: FormBuilder,
    private httpservice: HttpService, private apiCall: ApiService, private router: Router, private snackbar: MatSnackBar, private toastr: ToastrService, private activeRoute: ActivatedRoute, private datePipe: DatePipe) {
    this.getPercentages()
    // this.deductionForm.get('oneDayRecovery')!.reset();

    this.activeRoute.paramMap.subscribe(params => {
      this.empId = params.get('id');
      if (this.empId && this.router.url.includes('edit')) {
        this.edit = true;
        this.getEmployeeData();
      } else if (this.empId && this.router.url.includes('save')) {
        this.edit = true;
        this.getPersonelEmployeeData();
      } else if (this.router.url.includes('view')) {
        this.view = true;
        this.getEmployeeData();
        // this.calculateTotalEarnings()
        // this.calculateTotalDeductions()
      }
    })
  }

  ngOnInit() {

    this.totalSubmit = this.fb.group({
      totalEarningsValue: [''],
      totalDeductionsValue: [''],
      totalNetpayValue: [''],

    })

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
      rent: ['no', Validators.required],
      bankName: ['', Validators.required],
      bankBranchName: ['', Validators.required],
      bankAcNo: ['', Validators.required],
      bankIFSC: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      payStatus: ['', Validators.required],
      rentOptions: ['', Validators.required],
      paymentType: ['no', Validators.required],
      pfcps: ['', Validators.required],
      vpfInp: ['', Validators.required],

      paymentStatus: ['', Validators.required],
      numberOfWorkingDays: ['', Validators.required],
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
    this.employeeForm.get('employeeId')!.disable();
    this.employeeForm.get('basicPay')!.disable();
    this.employeeForm.get('levelAsPerPayMatrix')!.disable();
    this.employeeForm.get('levelAsPerCellMatrix')!.disable();
    this.employeeForm.get('incrementDueDate')!.disable();
    this.employeeForm.get('dateOfRetirement')!.disable();
    this.employeeForm.get('transferOfficeCode')!.disable();
    this.employeeForm.get('transferOfficeName')!.disable();
    this.employeeForm.get('dateOfJoiningTransfer')!.disable();
    this.employeeForm.get('conveyanceAllowance')!.disable();
    this.employeeForm.get('pfcps')!.disable();
    this.employeeForm.get('numberOfWorkingDays')!.disable();
    this.employeeForm.get('paymentStatus')!.disable();
    this.earningForm = this.fb.group({
      basicPayEarning: ['', Validators.required],
      specialPay: ['', Validators.required],
      da: ['', Validators.required],
      hra: ['', Validators.required],
      hrr: ['', Validators.required],
      cca: ['', Validators.required],
      medicalAllowance: ['', Validators.required],
      fta: ['', Validators.required],
      hillAllowance: ['', Validators.required],
      winterAllowance: ['', Validators.required],
      washingAllowance: ['', Validators.required],
      conveyanceAllowanceEarnings: ['', Validators.required],
      cashAllowance: ['', Validators.required],
      interimRelief: ['', Validators.required],
      misc1: ['', Validators.required],
      // misc2: ['', Validators.required],
      // misc3: ['', Validators.required],
      // misc4: ['', Validators.required],
      // misc5: ['', Validators.required],
      personalPay: ['', Validators.required],
      // earncustomLabel: ['', Validators.required],
      // earncustomValue: ['', Validators.required],
      totalEarning: []
    })
    this.earningForm.get('basicPayEarning')!.disable();
    this.earningForm.get('hra')!.disable();
    this.earningForm.get('cca')!.disable()
    this.earningForm.get('da')!.disable()
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
      // cadap: ['', Validators.required],
      rentDeductions: ['', Validators.required],
      waterCharges: ['', Validators.required],
      professionalTax: ['', Validators.required],
      oneDayRecovery: [''],
      incomeTax: ['', Validators.required],
      incomeTaxCess: ['', Validators.required],
      eoe: ['', Validators.required],
      // hrr: ['', Validators.required],
      gpfLoan: ['', Validators.required],
      gpfArrear: ['', Validators.required],
      cpsArrear: ['', Validators.required],
      festivalAdvance: ['', Validators.required],
      conveyanceAdvance: ['', Validators.required],
      educationAdvance: ['', Validators.required],
      marriageAdvance: ['', Validators.required],
      payAdvance: ['', Validators.required],
      miscDeduction1: ['', Validators.required],
      miscDeduction2: ['', Validators.required],
      // miscDeduction3: ['', Validators.required],
      // miscDeduction4: ['', Validators.required],
      // miscDeduction5: ['', Validators.required],
      deductcustomLabel: ['', Validators.required],
      deductcustomValue: ['', Validators.required],
      totalDeductions: [],
      netPay: [''],

    })
    this.deductionForm.get('gpfSub')!.disable();
    this.deductionForm.get('cps')!.disable();

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
    this.getRecoveryDetails()
    this.getProfessionalTax()


  }

  getProfessionalTax() {
    const currentDate = new Date();

    // Get the current date components
    const year = currentDate.getFullYear(); // Get the current year (e.g., 2024)
    const month = currentDate.getMonth() + 1; // Get the current month (0-indexed, so add 1) (e.g., 1 for January)
    const day = currentDate.getDate(); // Get the current day of the month (e.g., 28)

    // Format the date as a string (e.g., "2024-01-28")
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    console.log(formattedDate);
    console.log(typeof formattedDate);

    this.apiCall.apiPostCall(formattedDate, "getProfessionalTaxAmount").subscribe(res => {
      console.log(res)
      let professionalTaxPercent = res
      this.deductionForm.get('professionalTax')?.setValue(professionalTaxPercent);

    })
  }

  getRecoveryDetails() {
    let payload = {
      "employeeId": this.empId
    }
    this.apiCall.apiPostCall(payload, 'recovery-types').subscribe(async (rocoveryRes: any) => {
      this.deductionForm.patchValue(rocoveryRes);
      const sdu = this.deductionForm.get('educationAdvance').value
      console.log(sdu)
      this.deductionForm.patchValue({
        educationAdvance : (rocoveryRes.educationAdvance).toFixed(2),
        hba :(rocoveryRes.hba).toFixed(2),
        cpsArrear :(rocoveryRes.cpsArrear).toFixed(2),
        miscDeduction2 :(rocoveryRes.miscDeduction2).toFixed(2),
        miscDeduction1 :(rocoveryRes.miscDeduction1).toFixed(2),
        festivalAdvance :(rocoveryRes.festivalAdvance).toFixed(2),
        marriageAdvance :(rocoveryRes.marriageAdvance).toFixed(2),
        gpfArrear :(rocoveryRes.gpfArrear).toFixed(2),
        conveyanceAdvance :(rocoveryRes.conveyanceAdvance).toFixed(2),
        payAdvance :(rocoveryRes.payAdvance).toFixed(2),
        gpfLoan :(rocoveryRes.gpfLoan).toFixed(2),
      })
      this.earningForm.patchValue(rocoveryRes)
      this.employeeForm.patchValue(rocoveryRes)
      this.deductionForm.patchValue({ miscDeduction1: (rocoveryRes.miscDeduction1).toFixed(2) });
      this.deductionForm.patchValue({ miscDeduction2: (rocoveryRes.miscDeduction2).toFixed(2) });
      this.onKeyHBA(rocoveryRes.hba);
    })

  }

  onBankIFSCInput(): void {
    const bankIFSCControl = this.employeeForm.get('bankIFSC');
    if (bankIFSCControl) {
      const filteredValue = bankIFSCControl.value.replace(/[^a-zA-Z0-9]/g, '');
      bankIFSCControl.setValue(filteredValue, { emitEvent: false });
    }
  }

  toUppercase(controlName: string): void {
    const control = this.employeeForm.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  payStatus:any
  workingDays:any

  getPersonelEmployeeData() {

 

    const payload = {
      "employeeId": this.empId
    }

    this.apiCall.personel_apiPostCall(payload, 'getPayRollDetailsByEmpId').subscribe((data: any) => {
      this.getData = data.data.officeName
      this.empJoingDate = data.data.dateOfJoiningService
      this.basicPayValueEarning = +data.data.basicPayEarning
      this.officeCode = data.data.officeCode
      this.idData = data.data.differentlyAbled
      this.joiningDate = data.data.dateOfJoiningService
      this.basicPayValue = +data.data.basicPay
      this.specialPay = data.data.specialPay
      this.personalPay = data.data.personalPay
      let currentDate = new Date();
      this.todayDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      this.workingDays = +data.data.numberOfWorkingDays
      this.payStatus = data.data.paymentStatus
      console.log(this.workingDays ,this.payStatus)

      this.apiCall.getDa_Value("daPercentage", this.todayDate)
        .subscribe(value => {
          this.enteredDaValue = value;
        });

        // console.log(this.percentages.hrrPercentage,"hrr percent")

      if (this.getData == 'Managing Director') {
        this.isMD = true
        this.hrrValue = (this.basicPayValue * Math.round(this.percentages.hrrPercentage / 100))
        this.earningForm.patchValue({ hrr: this.hrrValue })
        this.earningForm.get('hrr')!.disable();
      } else {
        this.isMD = false
      }

      const dateToCheck = this.joiningDate
      console.log(dateToCheck, "dta of joining")
      this.checkSplPF()
      const parts = dateToCheck.split("-");

      // Rearrange the parts to form the desired format "yyyy-mm-dd"
      const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

      console.log(formattedDate, "formattedDate");

      const referenceDate = '2003-04-01';
      console.log(referenceDate)
      let checkDate = formattedDate > referenceDate

      if (checkDate == true) {
        console.log("cps")
        this.employeeForm.patchValue({ pfcps: "CPS" });
        this.isPF = false
        this.isVpf = false

      } else {
        console.log("pf")

        this.employeeForm.patchValue({ pfcps: "PF" });
        this.isPF = true
        this.isVpf = true
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

        // let basicCalculation = (this.basicPayValueEarning * 25) / (+this.workingDays)
        // console.log(basicCalculation,"basicCalculation")
        // // this.earningForm.controls['basicPayEarning'].setValue(basicCalculation);
        // this.earningForm.patchValue({ basicPayEarning: basicCalculation })

        this.earningForm.patchValue(data.data);
        this.deductionForm.patchValue(data.data);
        const earningsCustomFields: any = data.data.earningsCustomFields;
        const deductionCustomFields: any = data.data.deductionCustomFields;
      }
      this.getRecoveryDetails();
      this.basicPayCalculation();


    })
  }

  roundedBasicCalculation:any

  basicPayCalculation() {
    this.daysInCurrentMonth = this.apiCall.getDaysInCurrentMonth();
    console.log('Number of days in the current month:', this.daysInCurrentMonth);
    
    // Check if this.daysInCurrentMonth is a valid number
    if (isNaN(this.daysInCurrentMonth) || this.daysInCurrentMonth == null) {
        console.error('Invalid value for daysInCurrentMonth:', this.daysInCurrentMonth);
        return;
    }

    // Log and validate basicPayValueEarning
    console.log('Basic Pay Value Earning:', this.basicPayValueEarning);
    if (isNaN(this.basicPayValueEarning) || this.basicPayValueEarning == null) {
        console.error('Invalid value for basicPayValueEarning:', this.basicPayValueEarning);
        return;
    }

    // Log and validate workingDays
    console.log('Working Days:', this.workingDays);
    if (isNaN(this.workingDays) || this.workingDays == null || this.workingDays == 0) {
        console.error('Invalid value for workingDays:', this.workingDays);
        return;
    }

    // Perform the calculation if all values are valid
    let basicCalculation = (this.basicPayValueEarning * this.workingDays) / (+this.daysInCurrentMonth);
    console.log(basicCalculation, "basicCalculation");

    // Round the result and update the form
    this.roundedBasicCalculation = Math.round(basicCalculation);
    console.log(this.roundedBasicCalculation,"roundedBasicCalculation")
    this.earningForm.patchValue({ basicPayEarning: this.roundedBasicCalculation });
}


  checkSplPF() {
    const currentDate = new Date();

    // Get the current date components
    const year = currentDate.getFullYear(); // Get the current year (e.g., 2024)
    const month = currentDate.getMonth() + 1; // Get the current month (0-indexed, so add 1) (e.g., 1 for January)
    const day = currentDate.getDate(); // Get the current day of the month (e.g., 28)

    // Format the date as a string (e.g., "2024-01-28")
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    console.log(formattedDate);
    let payload = {
      'dateOfJoiningService': formattedDate
    }

    this.apiCall.apiPostCall(payload, 'special-pf-date').subscribe((specialPFDate: any) => {

      let empJoinedDate = specialPFDate
      console.log(formattedDate, empJoinedDate, "special pf dates check")
      if (formattedDate > empJoinedDate) {
        this.isJoindateValid = false
      } else if (formattedDate <= empJoinedDate) {
        this.isJoindateValid = true
      }
    })
  }

  rentStatus(event: any) {
    this.rentstatus = event.target.value
    if (this.rentstatus == 'no') {
      this.rentType = false
      this.deductionForm.get('rentDeductions')!.reset();

    } else if (this.rentstatus == 'Notional') {
      this.rentType = true
      this.deductionForm.get('rentDeductions')!.enable();
      this.deductionForm.get('rentDeductions')!.reset();

    } else if (this.rentstatus == 'Concessional') {
      //calculationasss
      this.rentType = true
      let value = this.concessValue
      let code = this.officeCode
      this.apiCall.getConcessvalue("getConcessionValue", value, code).subscribe(res => {
        console.log(res, "RESS")

        // Concess formula = (basicpay * consess % ) + HRA value

        let concess = Math.round(this.basicPayValue * res / 100) + this.gradeValue
        console.log(concess, "concss -------------------------------------")
        this.deductionForm.patchValue({ rentDeductions: concess })
        // this.earningForm.patchValue({ hra: this.gradeValue })

      })
      this.deductionForm.get('rentDeductions')!.disable();
    }
    this.calculateTotalDeductions()
  }


  specialGet(event) {
    this.specialPay = +event.target.value
    this.calValue = this.personalPay + this.specialPay + this.basicPayValue
    this.concessValue = this.basicPayValue
    this.getHra(this.calValue, this.officeCode)

    if (this.rentstatus == 'Concessional') {
      let value = this.concessValue
      let code = this.officeCode
      this.apiCall.getConcessvalue("getConcessionValue", value, code).subscribe(res => {
        console.log(res, "RESS")
        // Concess formula = (basicpay * consess % ) + HRA value

        let concess = Math.round(this.basicPayValue * res / 100) + this.gradeValue
        console.log(concess)
        this.deductionForm.patchValue({ rentDeductions: concess })
        // this.earningForm.patchValue({ hra: this.gradeValue })

      })
    }
  }

  getHra(value, code) {
    this.apiCall.getGradeValue("getGradeValue", value, code)
      .subscribe(value => {

        if(this.workingDays >= 30 ){
        this.gradeValue = value;
          this.earningForm.patchValue({ hra: Math.round(this.gradeValue) })
        this.earningForm.get('hra')!.disable()
        }else{
          let grade = value;
          console.log(typeof this.gradeValue,typeof this.workingDays,typeof +this.daysInCurrentMonth);
          this.gradeValue = grade * this.workingDays / (+this.daysInCurrentMonth)
          console.log(this.gradeValue,"two days HRA Value")
        // this.earningForm.patchValue({ da: Math.round(this.daValue) });
        this.earningForm.patchValue({ hra: Math.round(this.gradeValue) })
        this.earningForm.get('hra')!.disable()
        }
      });

    this.apiCall.getGradeValue("getCCAValue", value, code)
      .subscribe(value => {
        if(this.workingDays >= 30 ){
          this.ccaGradeValue = value;
          this.earningForm.patchValue({ cca: Math.round(this.ccaGradeValue) })
          this.earningForm.get('cca')!.disable()
          }else{
            let cca = value;
            console.log(typeof cca,typeof this.workingDays,typeof +this.daysInCurrentMonth);
            this.ccaGradeValue = cca * this.workingDays / (+this.daysInCurrentMonth)
            console.log(this.gradeValue,"two days HRA Value")
          // this.earningForm.patchValue({ da: Math.round(this.daValue) });
          this.earningForm.patchValue({ cca: Math.round(this.ccaGradeValue) })
          this.earningForm.get('cca')!.disable()
          }
      });
  }
  payrollDetails: any
  personalDetails: any
  getEmployeeData() {
    const payload = {
      "employeeId": this.empId
    }
    let api = "";
    if (this.edit === true) {
      api = "";
      // if (api) {
      this.apiCall.personel_apiPostCall(payload, "getPayRollDetailsByEmpId").subscribe((data: any) => {
        console.log(data, "dfvdfv 447")
        this.personalDetails = data.data

        this.getData = data.data.officeName
        this.empJoingDate = data.data.dateOfJoiningService
        this.basicPayValue = +data.data.basicPay
        this.officeCode = data.data.officeCode
        this.idData = data.data.differentlyAbled
        this.joiningDate = data.data.dateOfJoiningService
        this.basicPayValue = +data.data.basicPay
        this.specialPay = data.data.specialPay
        this.personalPay = data.data.personalPay
        this.workingDays = +data.data.numberOfWorkingDays
      this.payStatus = data.data.paymentStatus
      this.basicPayValueEarning = +data.data.basicPayEarning

        let currentDate = new Date();
        this.todayDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

        this.apiCall.getDa_Value("daPercentage", this.todayDate)
          .subscribe(value => {
            this.enteredDaValue = value;
          });

        if (this.getData == 'Managing Director') {
          this.isMD = true
          this.hrrValue = (this.basicPayValue * Math.round(this.percentages.hrrPercentage / 100))
          this.earningForm.patchValue({ hrr: this.hrrValue })
          this.earningForm.get('hrr')!.disable();
        } else {
          this.isMD = false
        }

        const dateToCheck = this.joiningDate

        const parts = dateToCheck.split("-");

        // Rearrange the parts to form the desired format "yyyy-mm-dd"
        const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

        console.log(formattedDate, "formattedDate");

        const referenceDate = '2003-04-01';
        console.log(referenceDate)
        let checkDate = formattedDate > referenceDate
        if (checkDate == true) {
          this.employeeForm.patchValue({ pfcps: "CPS" });
          this.isPF = false
          this.isVpf = false

        } else {
          this.employeeForm.patchValue({ pfcps: "PF" });
          this.isPF = true
          this.isVpf = true

        }
        // this.rocoveryType =  this.employeeForm.get('paymentType').value;

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
          // this.employeeForm.patchValue(data.data);
          // this.earningForm.patchValue(data.data);
          // this.deductionForm.patchValue(data.data);
          const earningsCustomFields: any = data.data.earningsCustomFields;
          const deductionCustomFields: any = data.data.deductionCustomFields;
        }

        this.apiCall.apiPostCall(payload, 'getEmployeePayRollByEmployeeId').subscribe((result: any) => {
          this.rentstatus = result.data.rent
          console.log(this.rentstatus, "edit")

          console.log(result, "resu;lt 514")
          this.rocoveryType = result.data.paymentType
          console.log(this.rocoveryType, "type recv")
          if (this.rocoveryType == 'yes') {
            this.isRecovery = true
            this.recoveryType()
          } else {
            this.isRecovery = false
          }
          this.checkSplPF()
          this.payrollDetails = result.data
          let personalArray = [this.personalDetails]
          let payrollArray = [this.payrollDetails]
          const mergedData = personalArray.map(personalItem => {
            const correspondingPayrollItem = payrollArray.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
            return {
              ...correspondingPayrollItem,
              ...personalItem,
            };
          });
          console.log(mergedData, "528")
          // this.filteredDataSource = mergedData
          console.log(mergedData[0].rent)
          if (mergedData[0].rent == 'no') {
            this.rentType = false
            this.deductionForm.get('rentDeductions')!.reset();
      
          } else if (mergedData[0].rent == 'Notional') {
            this.rentType = true
            this.deductionForm.get('rentDeductions')!.enable();
            this.deductionForm.get('rentDeductions')!.reset();
      
          } else if (mergedData[0].rent == 'Concessional') {
            //calculationasss
            this.rentType = true
            let value = this.concessValue
            let code = this.officeCode
            this.apiCall.getConcessvalue("getConcessionValue", value, code).subscribe(res => {
              console.log(res, "RESS")
      
              // Concess formula = (basicpay * consess % ) + HRA value
      
              let concess = Math.round(this.basicPayValue * res / 100) + this.gradeValue
              console.log(concess, "concss -------------------------------------")
              this.deductionForm.patchValue({ rentDeductions: concess })
              // this.earningForm.patchValue({ hra: this.gradeValue })
      
            })
            this.deductionForm.get('rentDeductions')!.disable();
          }



          this.employeeForm.patchValue(mergedData[0]);
          this.earningForm.patchValue(mergedData[0]);
          this.deductionForm.patchValue(mergedData[0]);
          // if(result.data.nid){
          this.nid = result.data.nid;


          console.log(this.nid, 'nid da -------------------');

          // }
          this.getRecoveryDetails()
      this.basicPayCalculation();


        })
      })

      // }
    } else if (this.view === true) {

      this.apiCall.personel_apiPostCall(payload, 'getPayRollDetailsByEmpId').subscribe(data => {

        this.personalDetails = data.data

        // this.employeeForm.patchValue(data.data);
        this.getData = data.data.officeName
        this.empJoingDate = data.data.dateOfJoiningService
        this.basicPayValue = +data.data.basicPay
        this.officeCode = data.data.officeCode
        this.idData = data.data.differentlyAbled
        this.joiningDate = data.data.dateOfJoiningService
        this.basicPayValue = +data.data.basicPay
        this.specialPay = data.data.specialPay
        this.personalPay = data.data.personalPay
        let currentDate = new Date();
        this.todayDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        this.workingDays = +data.data.numberOfWorkingDays
      this.payStatus = data.data.paymentStatus
      this.basicPayValueEarning = +data.data.basicPayEarning


        this.apiCall.getDa_Value("daPercentage", this.todayDate)
          .subscribe(value => {
            this.enteredDaValue = value;
          });

        if (this.getData == 'Managing Director') {
          this.isMD = true
          this.hrrValue = (this.basicPayValue * Math.round(this.percentages.hrrPercentage / 100))
          this.earningForm.patchValue({ hrr: this.hrrValue })
          this.earningForm.get('hrr')!.disable();
        } else {
          this.isMD = false
        }

        const dateToCheck = this.joiningDate

        const parts = dateToCheck.split("-");

        // Rearrange the parts to form the desired format "yyyy-mm-dd"
        const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

        console.log(formattedDate, "formattedDate");

        const referenceDate = '2003-04-01';
        console.log(referenceDate, "587")
        console.log(dateToCheck, "588")
        let checkDate = formattedDate > referenceDate

        if (checkDate == true) {
          this.employeeForm.patchValue({ pfcps: "CPS" });
          this.isPF = false
          this.isVpf = false
        } else {
          this.employeeForm.patchValue({ pfcps: "PF" });
          this.isPF = true
          this.isVpf = true
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
          // this.employeeForm.patchValue(data.data);
          // this.earningForm.patchValue(data.data);
          // this.deductionForm.patchValue(data.data);
          const earningsCustomFields: any = data.data.earningsCustomFields;
          const deductionCustomFields: any = data.data.deductionCustomFields;
        }

        this.apiCall.apiPostCall(payload, 'getEmployeePayRollByEmployeeId').subscribe(data => {
          this.rentstatus = data.data.rent
          console.log(this.rentstatus, "edit")

          console.log(data, "resu;lt 514")
          this.checkSplPF()
          this.payrollDetails = data.data
          let personalArray = [this.personalDetails]
          let payrollArray = [this.payrollDetails]
          const mergedData = personalArray.map(personalItem => {
            const correspondingPayrollItem = payrollArray.find(payrollItem => payrollItem.employeeId === personalItem.employeeId);
            return {
              ...correspondingPayrollItem,
              ...personalItem,
            };
          });
          console.log(mergedData, "528")
          if (mergedData[0].rent == 'no') {
            this.rentType = false
            this.deductionForm.get('rentDeductions')!.reset();
      
          } else if (mergedData[0].rent == 'Notional') {
            this.rentType = true
            this.deductionForm.get('rentDeductions')!.enable();
            this.deductionForm.get('rentDeductions')!.reset();
      
          } else if (mergedData[0].rent == 'Concessional') {
            //calculationasss
            this.rentType = true
            let value = this.concessValue
            let code = this.officeCode
            this.apiCall.getConcessvalue("getConcessionValue", value, code).subscribe(res => {
              console.log(res, "RESS")
      
              // Concess formula = (basicpay * consess % ) + HRA value
      
              let concess = Math.round(this.basicPayValue * res / 100) + this.gradeValue
              console.log(concess, "concss -------------------------------------")
              this.deductionForm.patchValue({ rentDeductions: concess })
              // this.earningForm.patchValue({ hra: this.gradeValue })
      
            })
            this.deductionForm.get('rentDeductions')!.disable();
          }
          this.employeeForm.disable();
          this.earningForm.disable();
          this.deductionForm.disable();
          this.employeeForm.patchValue(mergedData[0]);
          this.earningForm.patchValue(mergedData[0]);
          this.deductionForm.patchValue(mergedData[0]);
          this.getRecoveryDetails()
      this.basicPayCalculation();


        })
      })
    }
    else {
    }
  }

  getVpf(){
    const dateToCheck = this.joiningDate;
    const parts = dateToCheck.split("-");
    // Rearrange the parts to form the desired format "yyyy-mm-dd"
    const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    console.log(formattedDate, "formattedDate");
    const referenceDate = '2003-04-01';
    console.log(referenceDate)
    let checkDate = formattedDate > referenceDate
    if (checkDate == true) {   //CPS
    } else {
      console.log("pf")//PF
      let vpfInputValue = this.employeeForm.get('vpfInp')!.value
      console.log(vpfInputValue, "vpfInputValue",typeof vpfInputValue)

      if(vpfInputValue != ''){
        console.log("if")
        if (vpfInputValue < this.gpfValue) {
          this.deductionForm.patchValue({ vpf: 0 })
        } else if (vpfInputValue > this.gpfValue) {
          let vpfvalue = this.gpfValue - vpfInputValue
          vpfvalue = Math.abs(vpfvalue);
          console.log(vpfvalue,"vpfvalue")
          this.deductionForm.patchValue({ vpf: vpfvalue })
        }
      }else{
        console.log("else")

      this.deductionForm.get('vpf')!.reset();

      }
      

      this.deductionForm.get('gpfSub')!.disable();
    }
  }

  get_DA() {
    const dateToCheck = this.joiningDate;
    const parts = dateToCheck.split("-");
    // Rearrange the parts to form the desired format "yyyy-mm-dd"
    const formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    console.log(formattedDate, "formattedDate");
    const referenceDate = '2003-04-01';
    console.log(referenceDate)
    let checkDate = formattedDate > referenceDate
    if (checkDate == true) {   //CPS
      // let da = this.earningForm.get('da').value;
      console.log("cps")
      let da = this.daValue;
      let cps_Value = this.roundedBasicCalculation + da
      let cpsPreValue = cps_Value * (this.percentages.cpsPercentage / 100)
      this.cpsValue = Math.ceil(cpsPreValue)
      this.deductionForm.patchValue({ cps: this.cpsValue })
      this.deductionForm.get('cps')!.disable();
    } else {
      console.log("pf")//PF
      let da = this.daValue;
      let gpf_Value = this.roundedBasicCalculation + da
      let gpfprevValue = gpf_Value * (this.percentages.gpfPercentage / 100)
      this.gpfValue = Math.ceil(gpfprevValue / 100) * 100;
      this.deductionForm.patchValue({ gpfSub: this.gpfValue })
      console.log(this.gpfValue, "gpf value")
      let vpfInputValue = this.employeeForm.get('vpfInp')!.value
      console.log(vpfInputValue, "vpfInputValue")

      if(vpfInputValue != ''){
        console.log("if")
        if (vpfInputValue < this.gpfValue) {
          this.deductionForm.patchValue({ vpf: 0 })
        } else if (vpfInputValue > this.gpfValue) {
          let vpfvalue = this.gpfValue - vpfInputValue
          vpfvalue = Math.abs(vpfvalue);
          console.log(vpfvalue,"vpfvalue")
          this.deductionForm.patchValue({ vpf: vpfvalue })
        }
      }else{
        console.log("else")
      this.deductionForm.get('vpf')!.reset();
      }
      this.deductionForm.get('gpfSub')!.disable();
    }
  }

  fetchData() {
    if (this.employeeForm.controls['employeeId'].valid) {
      const payload = {
        "employeeId": this.employeeForm.controls['employeeId'].value
      }
      this.empId = this.employeeForm.controls['employeeId'].value;
      this.apiCall.apiPostCall(payload, 'getEmployeePayRollByEmployeeId').subscribe(data => {

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

  areAllFormsValid() {
    return this.earningForm.valid && this.deductionForm.valid
  }

  rocoveryType: any
  isRecovery:boolean = false
  isOneday(event: any) {
    this.rocoveryType = event.target.value
    if (this.rocoveryType == 'no') {
      this.isRecovery = false
      this.deductionForm.get('oneDayRecovery')!.reset();

    } else {
      this.isRecovery = true
      this.recoveryType()
      // this.deductionForm.get('oneDayRecovery')!.reset();
    }
  }


  recoveryType() {
    let totalWorkingDays = +this.employeeForm.get('numberOfWorkingDays')?.value
    console.log(totalWorkingDays,"totalWorkingDays")
    let totalEarnings = +this.earningForm.get('totalEarning')?.value
    // let oneDayRecvValue = Math.round((totalEarnings / totalWorkingDays) * 100) / 100;
    let oneDayRecvValue = Math.round(totalEarnings / totalWorkingDays).toFixed(2)
    this.deductionForm.patchValue({ oneDayRecovery: oneDayRecvValue })
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
      "differentlyAbled": this.employeeForm.controls['differentlyAbled'].value,
      "dateOfBirth": this.employeeForm.controls['dateOfBirth'].value,
      "dateOfJoiningService": this.employeeForm.controls['dateOfJoiningService'].value,
      "scaleOfPay": this.employeeForm.controls['scaleOfPay'].value,
      "basicPay": this.employeeForm.controls['basicPay'].value,
      "levelAsPerPayMatrix": this.employeeForm.controls['levelAsPerPayMatrix'].value,
      "levelAsPerCellMatrix": this.employeeForm.controls['levelAsPerCellMatrix'].value,
      "incrementDueDate": this.employeeForm.controls['incrementDueDate'].value,
      "dateOfRetirement": this.employeeForm.controls['dateOfRetirement'].value,
      "transferOfficeCode": this.employeeForm.controls['transferOfficeCode'].value,
      "transferOfficeName": this.employeeForm.controls['transferOfficeName'].value,
      "dateOfJoiningTransfer": this.employeeForm.controls['dateOfJoiningTransfer'].value,
      "conveyanceAllowance": Number(this.employeeForm.controls['conveyanceAllowance'].value),
      "rentOptions": this.employeeForm.controls['rentOptions'].value,
      "paymentType": this.employeeForm.controls['paymentType'].value,
      "rent": this.rentstatus,
      "pfcps": this.employeeForm.controls['pfcps'].value,
      "bankName": this.employeeForm.controls['bankName'].value,
      "bankBranchName": this.employeeForm.controls['bankBranchName'].value,
      "bankAcNo": this.employeeForm.controls['bankAcNo'].value,
      "bankIFSC": this.employeeForm.controls['bankIFSC'].value,
      "payStatus": this.employeeForm.controls['payStatus'].value,
      "paymentStatus": this.employeeForm.controls['paymentStatus'].value,
      "numberOfWorkingDays": this.employeeForm.controls['numberOfWorkingDays'].value,
      "vpfInp": this.employeeForm.controls['vpfInp'].value,
      "basicPayEarning": Number(this.earningForm.controls['basicPayEarning'].value),
      "specialPay": Number(this.earningForm.controls['specialPay'].value),
      "da": Number(this.earningForm.controls['da'].value),
      "hra": Number(this.earningForm.controls['hra'].value),
      "hrr": Number(this.earningForm.controls['hrr'].value),
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
      "personalPay": Number(this.earningForm.controls['personalPay'].value),
      // "totalEarning": Number(this.earningForm.controls['totalEarning'].value),
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
      "gpfLoan": Number(this.deductionForm.controls['gpfLoan'].value),
      "gpfArrear": Number(this.deductionForm.controls['gpfArrear'].value),
      "cpsArrear": Number(this.deductionForm.controls['cpsArrear'].value),
      "festivalAdvance": Number(this.deductionForm.controls['festivalAdvance'].value),
      "conveyanceAdvance": Number(this.deductionForm.controls['conveyanceAdvance'].value),
      "educationAdvance": Number(this.deductionForm.controls['educationAdvance'].value),
      "marriageAdvance": Number(this.deductionForm.controls['marriageAdvance'].value),
      "payAdvance": Number(this.deductionForm.controls['payAdvance'].value),
      // "netPay": Number(this.deductionForm.controls['netPay'].value),
      "miscDeduction1": Number(this.deductionForm.controls['miscDeduction1'].value),
      "miscDeduction2": Number(this.deductionForm.controls['miscDeduction2'].value),
      // "totalDeductions": Number(this.deductionForm.controls['totalDeductions'].value),
      // "earningsCustomFields": this.earningCFForm.value.items,
      // "deductionCustomFields": this.deductionCFForm.value.itemsDeduct,
      "nid": this.nid,
      "type": 'saved'
    }

    if (this.router.url.includes('save')) {
      this.apiCall.apiPostCall(data, 'saveEmployeePayRoll').subscribe(result => {
        if (result.message.includes('Success')) {
          this.toastr.success('Employee Detail created successfully!');
          this.router.navigate(['/payroll/employeepayroll/']);
          const tempData = {
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
            "vpfInp": this.employeeForm.controls['vpfInp'].value,
            "differentlyAbled": this.employeeForm.controls['differentlyAbled'].value,
            "dateOfBirth": this.employeeForm.controls['dateOfBirth'].value,
            "dateOfJoiningService": this.employeeForm.controls['dateOfJoiningService'].value,
            "scaleOfPay": this.employeeForm.controls['scaleOfPay'].value,
            "basicPay": this.employeeForm.controls['basicPay'].value,
            "levelAsPerPayMatrix": this.employeeForm.controls['levelAsPerPayMatrix'].value,
            "levelAsPerCellMatrix": this.employeeForm.controls['levelAsPerCellMatrix'].value,
            "incrementDueDate": this.employeeForm.controls['incrementDueDate'].value,
            "dateOfRetirement": this.employeeForm.controls['dateOfRetirement'].value,
            "transferOfficeCode": this.employeeForm.controls['transferOfficeCode'].value,
            "transferOfficeName": this.employeeForm.controls['transferOfficeName'].value,
            "dateOfJoiningTransfer": this.employeeForm.controls['dateOfJoiningTransfer'].value,
            "conveyanceAllowance": Number(this.employeeForm.controls['conveyanceAllowance'].value),
            "rent": this.rentstatus,
            "pfcps": this.employeeForm.controls['pfcps'].value,
            "bankName": this.employeeForm.controls['bankName'].value,
            "bankBranchName": this.employeeForm.controls['bankBranchName'].value,
            "bankAcNo": this.employeeForm.controls['bankAcNo'].value,
            "bankIFSC": this.employeeForm.controls['bankIFSC'].value,
            "payStatus": this.employeeForm.controls['payStatus'].value,
            "paymentStatus": this.employeeForm.controls['paymentStatus'].value,
            "paymentType": this.employeeForm.controls['paymentType'].value,
            "numberOfWorkingDays": this.employeeForm.controls['numberOfWorkingDays'].value,

            "basicPayEarning": Number(this.earningForm.controls['basicPayEarning'].value),
            "specialPay": Number(this.earningForm.controls['specialPay'].value),
            "da": Number(this.earningForm.controls['da'].value),
            "hra": Number(this.earningForm.controls['hra'].value),
            "hrr": Number(this.earningForm.controls['hrr'].value),
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
            "gpfLoan": Number(this.deductionForm.controls['gpfLoan'].value),
            "gpfArrear": Number(this.deductionForm.controls['gpfArrear'].value),
            "cpsArrear": Number(this.deductionForm.controls['cpsArrear'].value),
            "festivalAdvance": Number(this.deductionForm.controls['festivalAdvance'].value),
            "conveyanceAdvance": Number(this.deductionForm.controls['conveyanceAdvance'].value),
            "educationAdvance": Number(this.deductionForm.controls['educationAdvance'].value),
            "marriageAdvance": Number(this.deductionForm.controls['marriageAdvance'].value),
            "payAdvance": Number(this.deductionForm.controls['payAdvance'].value),
            "netPay": Number(this.deductionForm.controls['netPay'].value),
            "miscDeduction1": Number(this.deductionForm.controls['miscDeduction1'].value),
            "miscDeduction2": Number(this.deductionForm.controls['miscDeduction2'].value),
            "totalDeductions": Number(this.deductionForm.controls['totalDeductions'].value),
            // "earningsCustomFields": this.earningCFForm.value.items,
            // "deductionCustomFields": this.deductionCFForm.value.itemsDeduct,
            "nid": this.nid,
            "type": 'saved'
          }
          this.apiCall.apiPostCall(tempData, "saveTemporaryPayRoll").subscribe(res => {
          })
        } else {
          this.toastr.error('Employee Details Failed to Update!');
        }
      })
    } else if (this.router.url.includes('edit')) {
      this.apiCall.apiPostCall(data, 'saveEmployeePayRoll').subscribe(result => {
        if (result.status) {

          const tempData = {
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
            "differentlyAbled": this.employeeForm.controls['differentlyAbled'].value,
            "dateOfBirth": this.employeeForm.controls['dateOfBirth'].value,
            "dateOfJoiningService": this.employeeForm.controls['dateOfJoiningService'].value,
            "scaleOfPay": this.employeeForm.controls['scaleOfPay'].value,
            "basicPay": this.employeeForm.controls['basicPay'].value,
            "levelAsPerPayMatrix": this.employeeForm.controls['levelAsPerPayMatrix'].value,
            "levelAsPerCellMatrix": this.employeeForm.controls['levelAsPerCellMatrix'].value,
            "incrementDueDate": this.employeeForm.controls['incrementDueDate'].value,
            "dateOfRetirement": this.employeeForm.controls['dateOfRetirement'].value,
            "transferOfficeCode": this.employeeForm.controls['transferOfficeCode'].value,
            "transferOfficeName": this.employeeForm.controls['transferOfficeName'].value,
            "dateOfJoiningTransfer": this.employeeForm.controls['dateOfJoiningTransfer'].value,
            "conveyanceAllowance": Number(this.employeeForm.controls['conveyanceAllowance'].value),
            "rent": this.rentstatus,
            "pfcps": this.employeeForm.controls['pfcps'].value,
            "vpfInp": this.employeeForm.controls['vpfInp'].value,
            "bankName": this.employeeForm.controls['bankName'].value,
            "bankBranchName": this.employeeForm.controls['bankBranchName'].value,
            "bankAcNo": this.employeeForm.controls['bankAcNo'].value,
            "bankIFSC": this.employeeForm.controls['bankIFSC'].value,
            "payStatus": this.employeeForm.controls['payStatus'].value,
            "paymentStatus": this.employeeForm.controls['paymentStatus'].value,
            "paymentType": this.employeeForm.controls['paymentType'].value,
            "numberOfWorkingDays": this.employeeForm.controls['numberOfWorkingDays'].value,
            "basicPayEarning": Number(this.earningForm.controls['basicPayEarning'].value),
            "specialPay": Number(this.earningForm.controls['specialPay'].value),
            "da": Number(this.earningForm.controls['da'].value),
            "hra": Number(this.earningForm.controls['hra'].value),
            "hrr": Number(this.earningForm.controls['hrr'].value),
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
            "gpfLoan": Number(this.deductionForm.controls['gpfLoan'].value),
            "gpfArrear": Number(this.deductionForm.controls['gpfArrear'].value),
            "cpsArrear": Number(this.deductionForm.controls['cpsArrear'].value),
            "festivalAdvance": Number(this.deductionForm.controls['festivalAdvance'].value),
            "conveyanceAdvance": Number(this.deductionForm.controls['conveyanceAdvance'].value),
            "educationAdvance": Number(this.deductionForm.controls['educationAdvance'].value),
            "marriageAdvance": Number(this.deductionForm.controls['marriageAdvance'].value),
            "payAdvance": Number(this.deductionForm.controls['payAdvance'].value),
            "netPay": Number(this.deductionForm.controls['netPay'].value),
            "miscDeduction1": Number(this.deductionForm.controls['miscDeduction1'].value),
            "miscDeduction2": Number(this.deductionForm.controls['miscDeduction2'].value),
            "totalDeductions": Number(this.deductionForm.controls['totalDeductions'].value),
            // "earningsCustomFields": this.earningCFForm.value.items,
            // "deductionCustomFields": this.deductionCFForm.value.itemsDeduct,
            "nid": this.nid,
            "type": 'saved'
          }

          this.apiCall.apiPostCall(tempData, "saveTemporaryPayRoll").subscribe(res => {
          })
          this.toastr.success('Employee Detail updated successfully!');
          this.router.navigate(['/payroll/employeepayroll/']);

        } else {
          this.toastr.error('Something went wrong!');
        }
      })
    }
  }

  rentTypes: any[] = ['Concessional', 'Notional', 'no']
  selectedValue: any;



  pfOrCps(event: any) {
    this.salaryType = event.target.value
    if (this.salaryType == 'PF') {
      this.typeisPF = true
    } else {
      this.typeisPF = false
    }
  }

  calculateTotalEarnings() {

    // Get values from form controls and sum them up
    this.earningForm.valueChanges.pipe(take(1)).subscribe(() => {
      const earnFields = [
        'basicPayEarning', 'personalPay', 'specialPay', 'da', 'hra', 'hrr', 'cca', 'medicalAllowance', 'fta', 'winterAllowance',
        'hillAllowance', 'washingAllowance', 'conveyanceAllowanceEarnings', 'cashAllowance', 'interimRelief', 'misc1'];
      const totalEarning = earnFields
        .map(field => parseFloat(this.earningForm.get(field)?.value || 0))
        .reduce((sum, value) => sum + value, 0);

      if (totalEarning !== this.earningForm.get('totalEarning')?.value) {
        this.earningForm.get('totalEarning')?.setValue(totalEarning);
        this.totalSubmit.get('totalEarningsValue')?.setValue(totalEarning);

      }
      this.recoveryType();
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
        'gpfSub', 'vpf', 'cps', 'fbf', 'nhis', 'specialPf', 'hba', 'hbf', 'rentDeductions', 'waterCharges', 'professionalTax', 'oneDayRecovery', 'incomeTax', 'incomeTaxCess', 'eoe', 'gpfLoan', 'gpfArrear', 'cpsArrear', 'festivalAdvance', 'conveyanceAdvance', 'educationAdvance', 'marriageAdvance', 'payAdvance', 'miscDeduction1', 'miscDeduction2'
      ];
      const totalDeductions = deductionFields
        .map(field => parseFloat(this.deductionForm.get(field)?.value || 0))
        .reduce((sum, value) => sum + value, 0);

      // Check if the value has changed before updating the form control
      if (totalDeductions !== this.deductionForm.get('totalDeductions')?.value) {
        this.deductionForm.get('totalDeductions')?.setValue(totalDeductions);
        this.totalSubmit.get('totalDeductionsValue')?.setValue(totalDeductions);
      }

      // Use a setTimeout to delay netPay calculation
      setTimeout(() => {
        const totalEarn = +this.earningForm.get('totalEarning').value || 0;
        const totaldeduction = +this.deductionForm.get('totalDeductions').value || 0;
        const netpay = totalEarn - totaldeduction;

        // Set netPay value
        this.deductionForm.get('netPay')?.setValue(netpay);
        this.totalSubmit.get('totalNetpayValue')?.setValue(netpay);

      }, 5000);
    });
  }

  getPercentages() {
    this.apiCall.apiPostCall({ percentageId: 1 }, 'percentage').subscribe(data => {
      this.percentages = data.data
    })
  }

  onKeyIT(event) {
    let itValue = event.target.value
    this.cessValue = itValue * Math.round(this.percentages.itcPercentage) / 100
    this.deductionForm.patchValue({ incomeTaxCess: this.cessValue });
    this.deductionForm.get('incomeTaxCess')!.disable();
  }

  onKeyHBA(value?: any) {
    // let hbaValue = event.target.value
    console.log(value, "value")
    const hbaValue = value != null ? value : this.deductionForm.controls['hba'].value;

    this.hbfValue = hbaValue * Math.round(this.percentages.hbfPercentage) / 100
    this.deductionForm.patchValue({ hbf: this.hbfValue });
    this.deductionForm.get('hbf')!.disable();
  }

  allowDecimal(event: any) {
    // Allow only one dot for decimal point
    if (event.key === '.' && event.target.value.includes('.')) {
      event.preventDefault();
    }
  }

  onInput(event: any) {
    // Remove non-numeric and non-decimal characters
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
  }


  personalGet(event: any) {
    this.personalPay = parseFloat(event.target.value) || 0;
    this.calValue = this.personalPay + this.specialPay + this.basicPayValue;
    console.log(this.enteredDaValue, "this.enteredDaValue");
    let daSumValue = (this.personalPay + this.basicPayValue);

    // this.daValue = daSumValue * this.enteredDaValue / 100;
    // console.log(this.daValue, "this.daValue");

    if(this.workingDays >= 30){
      this.daValue = daSumValue * this.enteredDaValue / 100;
      console.log(this.daValue, " 30 this.daValue");
    this.earningForm.patchValue({ da: Math.round(this.daValue) });

    }else{
      let calcul = daSumValue * this.enteredDaValue / 100;
      console.log(this.daValue, "this.daValue");
      this.daValue = calcul * this.workingDays / (+this.daysInCurrentMonth)
      console.log(this.daValue,"two days daValue")
    this.earningForm.patchValue({ da: Math.round(this.daValue) });

    }
    this.get_DA();
    this.earningForm.get('da')!.disable();
    this.getHra(this.calValue, this.officeCode);
    this.concessValue = this.roundedBasicCalculation;
  }

  //decimal codes

  decimalInput(formName: any, controlName: any) {
    const form = this[formName];  // Access the form dynamically
    if (form) {
      const control = form.get(controlName);
      if (control) {
        let value = control.value;
        // Remove all non-numeric characters except the first decimal point
        value = value.replace(/[^0-9.]/g, '');
        // Handle multiple decimal points
        const parts = value.split('.');
        if (parts.length > 2) {
          value = parts[0] + '.' + parts.slice(1).join('');
        }
        // Validate with regex for up to 2 decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        if (regex.test(value)) {
          control.setValue(value, { emitEvent: false });
        } else {
          control.setValue('', { emitEvent: false }); // Reset the value if not valid
        }
      }
    }
  }

  formatToTwoDecimals(formName: any, controlName: any) {
    const form = this[formName];
    if (form) {
      const control = form.get(controlName);
      if (control) {
        let value = control.value;
        // Parse and format only if the input is valid
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          control.setValue(numericValue.toFixed(2), { emitEvent: false });
        }
      }
    }
  }
}
