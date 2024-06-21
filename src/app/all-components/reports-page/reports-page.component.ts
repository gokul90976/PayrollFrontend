import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../service/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})

export class ReportsPageComponent implements AfterViewInit{
  form: FormGroup;

  Tabs: string[] = ["MISCELLENEOUS 1", "MISCELLENEOUS 2", "PAY ADVANCE", "EDUCATION ADVANCE", "MARRIAGE ADVANCE", "CONVEYANCE ADVANCE", "FESTIVAL ADVANCE", "INCOME TAX", "ONEDAY RECOVERY", "NHIS", "CPS", "PROFESSIONAL TAX", "RENT", "HBA", "FBF", "SPECIAL PF", "GPF"];
  id: any
  excelData: any[]
  isMisc: boolean = true
  miscDataSource = new MatTableDataSource<any>();
  miscellaneousColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designationName', 'recovery', 'balance'];
  miscData1: any
  filteredDataMisc1: any
  filteredDataMisc1Desg: any
  filteredDataMisc1OfcCode: any
  filteredDataMisc1EmpName: any
  selectedTab: any = '';
  allEmployeeDataSource!: MatTableDataSource<any>;
  allEmployeeData!: MatTableDataSource<any>;

  miscData2: any
  filteredDataMisc2: any
  filteredDataMisc2Desg: any
  filteredDataMisc2OfcCode: any
  filteredDataMisc2EmpName: any
  miscDataSource2 = new MatTableDataSource<any>([]);
  miscellaneousColumns2: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'recovery', 'balance'];
  allEmployeeDataSourceMisc2!: MatTableDataSource<any>;
  allEmployeeDataMisc2!: MatTableDataSource<any>;

  isPayAdv: boolean
  payAdvData: any
  filteredDataPayAdv: any
  filteredDataPayAdvDesg: any
  filteredDataPayAdvOfcCode: any
  filteredDataPayAdvEmpName: any
  payAdvDataSource = new MatTableDataSource<any>([]);
  payAdvanceColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'payAdvanceAmount', 'balance'];
  allEmployeeDataSourcePayAdv!: MatTableDataSource<any>;
  allEmployeeDataPayAdv!: MatTableDataSource<any>;

  isEduAdv: boolean
  eduAdvData: any
  filteredDataEduAdv: any
  filteredDataEduAdvDesg: any
  filteredDataEduAdvOfcCode: any
  filteredDataEduAdvEmpName: any
  educationAdvDataSource = new MatTableDataSource<any>([]);
  educationAdvanceColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'educationRecoveryAmount', 'balance'];
  allEmployeeDataSourceEduAdv!: MatTableDataSource<any>;
  allEmployeeDataEduAdv!: MatTableDataSource<any>;

  isMarrAdv: boolean
  mrgAdvData: any
  filteredDataMrgAdv: any
  filteredDataMrgAdvDesg: any
  filteredDataMrgAdvOfcCode: any
  filteredDataMrgAdvEmpName: any
  marriageAdvDataSource = new MatTableDataSource<any>([]);
  marriageAdvanceColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'marriageAmount', 'balance'];
  allEmployeeDataSourceMrgAdv!: MatTableDataSource<any>;
  allEmployeeDataMrgAdv!: MatTableDataSource<any>;

  isConvAdv: boolean
  convAdvData: any
  filteredDataConvAdv: any
  filteredDataConvAdvDesg: any
  filteredDataConvAdvOfcCode: any
  filteredDataConvAdvEmpName: any
  conveyanceAdvDataSource = new MatTableDataSource<any>([]);
  conveyanceAdvanceColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'conveyanceAmount', 'balance'];
  allEmployeeDataSourceConvAdv!: MatTableDataSource<any>;
  allEmployeeDataConvAdv!: MatTableDataSource<any>;

  isFestAdv: boolean
  festAdvData: any
  filteredDataFestAdv: any
  filteredDataFestAdvDesg: any
  filteredDataFestAdvOfcCode: any
  filteredDataFestAdvEmpName: any
  festivalAdvDataSource = new MatTableDataSource<any>([]);
  festivalAdvanceColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'festivalAmount', 'balance'];
  allEmployeeDataSourceFestAdv!: MatTableDataSource<any>;
  allEmployeeDataFestAdv!: MatTableDataSource<any>;

  isIncomeAdv: boolean
  incomeAdvData: any
  filteredDataIncomeTax: any
  filteredDataIncomeTaxDesg: any
  filteredDataIncomeTaxOfcCode: any
  filteredDataIncomeTaxEmpName: any
  incomeTaxDataSource = new MatTableDataSource<any>([]);
  incomeTaxColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'panNo', 'basicPay', 'gross', 'incomeTax', 'incometaxCess', 'total'];
  allEmployeeDataSourceIncomeAdv!: MatTableDataSource<any>;
  allEmployeeDataIncomeAdv!: MatTableDataSource<any>;

  isOnedAdv: boolean
  oneDayRecvData: any
  filteredDataOneDayRecv: any
  filteredDataOneDayRecvDesg: any
  filteredDataOneDayRecvOfcCode: any
  filteredDataOneDayRecvEmpName: any
  oneDayRecoveryDataSource = new MatTableDataSource<any>([]);
  oneDayRecoveryColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'basicPay', 'gross', 'deductionAmount'];
  allEmployeeDataSourceOneDayRecv!: MatTableDataSource<any>;
  allEmployeeDataOneDayRecv!: MatTableDataSource<any>;

  isNhisAdv: boolean
  nhisData: any
  filteredDataNHIS: any
  filteredDataNHISDesg: any
  filteredDataNHISOfcCode: any
  filteredDataNHISEmpName: any
  nhisDataSource = new MatTableDataSource<any>;
  nhisColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'nhisAmount'];
  allEmployeeDataSourceNHIS!: MatTableDataSource<any>;
  allEmployeeDataNHIS!: MatTableDataSource<any>;

  isCps: boolean
  cpsData: any
  filteredDataCPS: any
  filteredDataCPSDesg: any
  filteredDataCPSOfcCode: any
  filteredDataCPSEmpName: any
  cpsDataSource = new MatTableDataSource<any>([]);
  cpsDataColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'basicPay', 'personalPay', 'specialPay', 'daValue', 'cpsValue', 'cpsArrear', 'total'];
  allEmployeeDataSourceCPS!: MatTableDataSource<any>;
  allEmployeeDataCPS!: MatTableDataSource<any>;

  isProfTax: boolean
  profTaxData: any
  filteredDataProfTax: any
  filteredDataProfTaxDesg: any
  filteredDataProfTaxOfcCode: any
  filteredDataProfTaxEmpName: any
  professionalTaxDataSource = new MatTableDataSource<any>([]);
  professionalTaxListColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'professionalTaxAmount'];
  allEmployeeDataSourceProfTax!: MatTableDataSource<any>;
  allEmployeeDataProfTax!: MatTableDataSource<any>;

  isRent: boolean
  rentData: any
  filteredDataRent: any
  filteredDataRentDesg: any
  filteredDataRentOfcCode: any
  filteredDataRentEmpName: any
  rentDataSource = new MatTableDataSource<any>([]);
  rentDataListColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'rent', 'waterCharge', 'total'];
  allEmployeeDataSourceRent!: MatTableDataSource<any>;
  allEmployeeDataRent!: MatTableDataSource<any>;

  hbaData: any
  filteredDataHBA: any
  filteredDataHBADesg: any
  filteredDataHBAOfcCode: any
  filteredDataHBAEmpName: any
  hbaDataSource = new MatTableDataSource<any>([]);
  hbaListColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'hba', 'hbf', 'eoe', 'total'];
  allEmployeeDataSourceHBA!: MatTableDataSource<any>;
  allEmployeeDataHBA!: MatTableDataSource<any>;

  fbfData: any
  filteredDataFBF: any
  filteredDataFBFDesg: any
  filteredDataFBFOfcCode: any
  filteredDataFBFEmpName: any
  fbfDataSource = new MatTableDataSource<any>([]);
  fbfListColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'fbfAmount'];
  allEmployeeDataSourceFBF!: MatTableDataSource<any>;
  allEmployeeDataFBF!: MatTableDataSource<any>;

  specialPfDataSource = new MatTableDataSource<any>([]);
  specialPfListColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designation', 'specialPfAmount'];
  allEmployeeDataSplPf!: MatTableDataSource<any>;
  allEmployeeDataSourceSplPf!: MatTableDataSource<any>;
  splPFData: any
  filteredDataSplPf: any
  filteredDataSplPfDesg: any
  filteredDataSplPfOfcCode: any
  filteredDataSplPfEmpName: any

  gpfData: any
  filteredDataGPF: any
  filteredDataGPFDesg: any
  filteredDataGPFOfcCode: any
  filteredDataGPFEmpName: any
  gpfDataSource = new MatTableDataSource<any>([]);
  gPfListColumns: string[] = ['sNo', 'employeeCode', 'officeCode', 'employeeName', 'designationName', 'basicPayEarning', 'personalPay', 'specialPay', 'da', 'gpf_s', 'vpf', 'gpf_L', 'gpfArrear', 'total'];
  allEmployeeDataSourceGPF!: MatTableDataSource<any>;
  allEmployeeDataGPF!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiCall: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.miscDataSource.paginator = this.paginator;
    // this.miscDataSource.sort = this.sort;
  }

  onSubmit() {
    // this.spinner.show()
    const formValues = this.form.value;
    console.log(formValues, "formValues")
    const formattedFromDate = this.formatDate(formValues.fromDate);
    const formattedToDate = this.formatDate(formValues.toDate);

    console.log(formattedFromDate, formattedToDate, "dates choosen")

    if (this.selectedTab === "MISCELLENEOUS 1") {
      this.apiCall.getReportDataByRange( formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        // this.miscDataSource.data = res

        let categorizedData = this.processDataMisc1(res)
        this.miscDataSource.data = categorizedData;

      });
    } else if (this.selectedTab === "MISCELLENEOUS 2") {
      console.log("pay if")
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        // this.miscDataSource2.data = res
        const categorizedData = this.processDataMisc2(res);
        console.log(categorizedData)
        this.miscDataSource2.data = categorizedData;

      });
    } else if (this.selectedTab === "PAY ADVANCE") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        // this.payAdvDataSource.data = res

        const categorizedData = this.processDataPayAdvance(res);

        this.payAdvDataSource.data = categorizedData;

      });
    } else if (this.selectedTab === "EDUCATION ADVANCE") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        // this.educationAdvDataSource.data = res
        const categorizedData = this.processDataEducationAdvance(res);

        this.educationAdvDataSource.data = categorizedData;

      });
    } else if (this.selectedTab === "MARRIAGE ADVANCE") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        // this.marriageAdvDataSource.data = res

        const categorizedData = this.processDataMarriageAdvance(res);

        this.marriageAdvDataSource.data = categorizedData

      });
    } else if (this.selectedTab === "CONVEYANCE ADVANCE") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        // this.conveyanceAdvDataSource.data = res

        const categorizedData = this.processDataConveyanceAdvance(res);

        this.conveyanceAdvDataSource.data = categorizedData;

      });
    } else if (this.selectedTab === "FESTIVAL ADVANCE") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        // this.festivalAdvDataSource.data = res

        const categorizedData = this.processDataFestivalAdvance(res);

        this.festivalAdvDataSource.data = categorizedData;
        // this.festAdvData = categorizedData;

      });
    } else if (this.selectedTab === "INCOME TAX") {
      console.log("pay if")
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.incomeTaxDataSource.data = res

      });
    } else if (this.selectedTab === "ONEDAY RECOVERY") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.oneDayRecoveryDataSource.data = res

      });
    } else if (this.selectedTab === "NHIS") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.nhisDataSource.data = res

      });
    } else if (this.selectedTab === "CPS") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.cpsDataSource.data = res

      });
    } else if (this.selectedTab === "PROFESSIONAL TAX") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.professionalTaxDataSource.data = res

      });
    } else if (this.selectedTab === "RENT") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.rentDataSource.data = res

      });
    } else if (this.selectedTab === "HBA") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.hbaDataSource.data = res

      });
    } else if (this.selectedTab === "FBF") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.fbfDataSource.data = res

      });
    } else if (this.selectedTab === "SPECIAL PF") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.specialPfDataSource.data = res

      });
    } else if (this.selectedTab === "GPF") {
      this.apiCall.getReportDataByRange(formattedFromDate, formattedToDate).subscribe((res: any) => {
        console.log(res, "API Response");
        this.gpfDataSource.data = res

      });
    }



  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  edit(empId) {
    let payload = {
      "employeeId": empId
    }
    this.apiCall.apiPostCall(payload, 'MiscDeductionReportByEmpId').subscribe((res: any) => {
      console.log(res, "resssssssssssssssssssss")
    })
  }

  refresh(value) {
    console.log(value)
    if (value === "MISCELLENEOUS 1") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataMisc1(data)
        this.miscDataSource.data = categorizedData;
        console.log( this.miscDataSource.data )
        this.miscData1 = categorizedData
        console.log(this.miscData1, "this.miscData1")

        
        this.filteredDataMisc1 = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataMisc1Desg = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataMisc1OfcCode = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode

          ))
        );
        this.filteredDataMisc1EmpName = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName

          ))
        );
        console.log(this.filteredDataMisc1, "this.filteredDataMisc1")
        this.allEmployeeDataSource = new MatTableDataSource(this.miscData1);
        this.miscDataSource = new MatTableDataSource(this.miscData1);
        this.allEmployeeData = new MatTableDataSource(this.miscData1);
      })
    } else if (value === "MISCELLENEOUS 2") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataMisc2(data);
        console.log(categorizedData)
        this.miscDataSource2.data = categorizedData;

        this.miscData2 = categorizedData
        this.filteredDataMisc2 = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataMisc2Desg = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataMisc2OfcCode = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataMisc2EmpName = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );

        this.allEmployeeDataSourceMisc2 = new MatTableDataSource(this.miscData2);
        this.miscDataSource2 = new MatTableDataSource(this.miscData2);
        this.allEmployeeDataMisc2 = new MatTableDataSource(this.miscData2);
        this.allEmployeeData = new MatTableDataSource(this.miscData2);
      })
    } else if (value === "PAY ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataPayAdvance(data);

        this.payAdvDataSource.data = categorizedData;
        this.payAdvData = categorizedData
        this.filteredDataPayAdv = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataPayAdvDesg = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataPayAdvOfcCode = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataPayAdvEmpName = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourcePayAdv = new MatTableDataSource(this.payAdvData);
        this.payAdvDataSource = new MatTableDataSource(this.payAdvData);
        this.allEmployeeDataPayAdv = new MatTableDataSource(this.payAdvData);
      })
    } else if (value === "EDUCATION ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {

        console.log(data);
        const categorizedData = this.processDataEducationAdvance(data);

        this.educationAdvDataSource.data = categorizedData;
        this.eduAdvData = categorizedData
        this.filteredDataEduAdv = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataEduAdvDesg = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataEduAdvOfcCode = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataEduAdvEmpName = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        console.log(this.filteredDataEduAdv, " this.filteredDataEduAdv");
        console.log(this.eduAdvData, "edu adv data")
        this.allEmployeeDataSourceEduAdv = new MatTableDataSource(this.eduAdvData);
        this.educationAdvDataSource = new MatTableDataSource(this.eduAdvData);
        this.allEmployeeDataEduAdv = new MatTableDataSource(this.eduAdvData);
      })
    } else if (value === "MARRIAGE ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataMarriageAdvance(data);

        this.marriageAdvDataSource.data = categorizedData;
        this.mrgAdvData = categorizedData
        this.filteredDataMrgAdv = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataMrgAdvDesg = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataMrgAdvOfcCode = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataMrgAdvEmpName = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceMrgAdv = new MatTableDataSource(this.mrgAdvData);
        this.marriageAdvDataSource = new MatTableDataSource(this.mrgAdvData);
        this.allEmployeeDataMrgAdv = new MatTableDataSource(this.mrgAdvData);
      })
    } else if (value === "CONVEYANCE ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataConveyanceAdvance(data);

        this.conveyanceAdvDataSource.data = categorizedData;
        this.convAdvData = categorizedData;
        this.filteredDataConvAdv = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataConvAdvDesg = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataConvAdvOfcCode = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataConvAdvEmpName = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceConvAdv = new MatTableDataSource(this.convAdvData);
        this.conveyanceAdvDataSource = new MatTableDataSource(this.convAdvData);
        this.allEmployeeDataConvAdv = new MatTableDataSource(this.convAdvData);
      })
    } else if (value === "FESTIVAL ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataFestivalAdvance(data);

        this.festivalAdvDataSource.data = categorizedData;
        this.festAdvData = categorizedData;
        this.filteredDataFestAdv = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataFestAdvDesg = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataFestAdvOfcCode = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataFestAdvEmpName = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceFestAdv = new MatTableDataSource(this.festAdvData);
        this.festivalAdvDataSource = new MatTableDataSource(this.festAdvData);
        this.allEmployeeDataFestAdv = new MatTableDataSource(this.festAdvData);
      })
    } else if (value === "INCOME TAX") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataIncomeTax(data)
        this.incomeTaxDataSource.data = categorizedData;

        this.incomeAdvData = categorizedData
        this.filteredDataIncomeTax = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataIncomeTaxDesg = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataIncomeTaxOfcCode = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataIncomeTaxEmpName = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceIncomeAdv = new MatTableDataSource(this.incomeAdvData);
        this.incomeTaxDataSource = new MatTableDataSource(this.incomeAdvData);
        this.allEmployeeDataIncomeAdv = new MatTableDataSource(this.incomeAdvData);
      })
    } else if (value === "ONEDAY RECOVERY") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataOneDayRecv(data)
        this.oneDayRecoveryDataSource.data = categorizedData;

        this.oneDayRecvData = categorizedData
        this.filteredDataOneDayRecv = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataOneDayRecvDesg = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataOneDayRecvOfcCode = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataOneDayRecvEmpName = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceOneDayRecv = new MatTableDataSource(this.oneDayRecvData);
        this.oneDayRecoveryDataSource = new MatTableDataSource(this.oneDayRecvData);
        this.allEmployeeDataOneDayRecv = new MatTableDataSource(this.oneDayRecvData);
      })
    } else if (value === "NHIS") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataNHIS(data)
        this.nhisDataSource.data = categorizedData;

        this.nhisData = categorizedData

        this.filteredDataNHIS = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataNHISDesg = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataNHISOfcCode = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataNHISEmpName = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceNHIS = new MatTableDataSource(this.nhisData);
        this.nhisDataSource = new MatTableDataSource(this.nhisData);
        this.allEmployeeDataNHIS = new MatTableDataSource(this.nhisData);
      })
    } else if (value === "CPS") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataCPS(data)
        this.cpsDataSource.data = categorizedData;

        this.cpsData = categorizedData
        this.filteredDataCPS = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataCPSDesg = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataCPSOfcCode = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataCPSEmpName = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceCPS = new MatTableDataSource(this.cpsData);
        this.cpsDataSource = new MatTableDataSource(this.cpsData);
        this.allEmployeeDataCPS = new MatTableDataSource(this.cpsData);
      })
    } else if (value === "PROFESSIONAL TAX") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataProfTax(data)
        this.professionalTaxDataSource.data = categorizedData;

        this.profTaxData = categorizedData


        this.filteredDataProfTax = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataProfTaxDesg = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataProfTaxOfcCode = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataProfTaxEmpName = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceProfTax = new MatTableDataSource(this.profTaxData);
        this.professionalTaxDataSource = new MatTableDataSource(this.profTaxData);
        this.allEmployeeDataProfTax = new MatTableDataSource(this.profTaxData);
      })
    } else if (value === "RENT") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataRent(data)
        this.rentDataSource.data = categorizedData;

        this.rentData = categorizedData

        this.filteredDataRent = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataRentDesg = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataRentOfcCode = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataRentEmpName = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceRent = new MatTableDataSource(this.rentData);
        this.rentDataSource = new MatTableDataSource(this.rentData);
        this.allEmployeeDataRent = new MatTableDataSource(this.rentData);
      })
    } else if (value === "HBA") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        let categorizedData = this.processDataHBA(data)
        this.hbaDataSource.data = categorizedData;

        this.hbaData = categorizedData


        this.filteredDataHBA = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataHBADesg = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataHBAOfcCode = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataHBAEmpName = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceHBA = new MatTableDataSource(this.hbaData);
        this.hbaDataSource = new MatTableDataSource(this.hbaData);
        this.allEmployeeDataHBA = new MatTableDataSource(this.hbaData);
      })
    }else if (value === "FBF") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataFBF(data)
        this.fbfDataSource.data = categorizedData;

        this.fbfData = categorizedData
        this.filteredDataFBF = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataFBFDesg = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataFBFOfcCode = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataFBFEmpName = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceFBF = new MatTableDataSource(this.fbfData);
        this.fbfDataSource = new MatTableDataSource(this.fbfData);
        this.allEmployeeDataFBF = new MatTableDataSource(this.fbfData);
      })
    }else if (value === "SPECIAL PF") {

      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        let categorizedData = this.processDataSplPf(data)
        this.specialPfDataSource.data = categorizedData;
        this.splPFData = categorizedData

        this.filteredDataSplPf = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataSplPfDesg = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataSplPfOfcCode = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataSplPfEmpName = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceSplPf = new MatTableDataSource(this.splPFData);
        this.specialPfDataSource = new MatTableDataSource(this.splPFData);
        this.allEmployeeDataSplPf = new MatTableDataSource(this.splPFData);
      })

    }else if (value === "GPF") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        let categorizedData = this.processDataGpfData(data)
        this.gpfDataSource.data = categorizedData;
        this.gpfData = categorizedData

        this.filteredDataGPF = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataGPFDesg = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataGPFOfcCode = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataGPFEmpName = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceGPF = new MatTableDataSource(this.gpfData);
        this.gpfDataSource = new MatTableDataSource(this.gpfData);
        this.allEmployeeDataGPF = new MatTableDataSource(this.gpfData);
      })
    }
  }

  onTabSelectionChange(event: any) {
    this.selectedTab = event.value;
    console.log('Selected tab:', this.selectedTab);

    if (this.selectedTab === "MISCELLENEOUS 1") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataMisc1(data)
        this.miscDataSource.data = categorizedData;
        console.log( this.miscDataSource.data )
        this.miscData1 = categorizedData
        console.log(this.miscData1, "this.miscData1")

        
        this.filteredDataMisc1 = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataMisc1Desg = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataMisc1OfcCode = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode

          ))
        );
        this.filteredDataMisc1EmpName = this.miscData1.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName

          ))
        );
        console.log(this.filteredDataMisc1, "this.filteredDataMisc1")
        this.allEmployeeDataSource = new MatTableDataSource(this.miscData1);
        this.miscDataSource = new MatTableDataSource(this.miscData1);
        this.allEmployeeData = new MatTableDataSource(this.miscData1);
      })
    } else if (this.selectedTab === "MISCELLENEOUS 2") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataMisc2(data);
        console.log(categorizedData)
        this.miscDataSource2.data = categorizedData;

        this.miscData2 = categorizedData
        this.filteredDataMisc2 = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataMisc2Desg = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataMisc2OfcCode = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataMisc2EmpName = this.miscData2.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );

        this.allEmployeeDataSourceMisc2 = new MatTableDataSource(this.miscData2);
        this.miscDataSource2 = new MatTableDataSource(this.miscData2);
        this.allEmployeeDataMisc2 = new MatTableDataSource(this.miscData2);
        this.allEmployeeData = new MatTableDataSource(this.miscData2);
      })
    } else if (this.selectedTab === "PAY ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataPayAdvance(data);

        this.payAdvDataSource.data = categorizedData;
        this.payAdvData = categorizedData
        this.filteredDataPayAdv = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataPayAdvDesg = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataPayAdvOfcCode = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataPayAdvEmpName = this.payAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourcePayAdv = new MatTableDataSource(this.payAdvData);
        this.payAdvDataSource = new MatTableDataSource(this.payAdvData);
        this.allEmployeeDataPayAdv = new MatTableDataSource(this.payAdvData);
      })
    } else if (this.selectedTab === "EDUCATION ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {

        console.log(data);
        const categorizedData = this.processDataEducationAdvance(data);

        this.educationAdvDataSource.data = categorizedData;
        this.eduAdvData = categorizedData
        this.filteredDataEduAdv = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataEduAdvDesg = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataEduAdvOfcCode = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataEduAdvEmpName = this.eduAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        console.log(this.filteredDataEduAdv, " this.filteredDataEduAdv");
        console.log(this.eduAdvData, "edu adv data")
        this.allEmployeeDataSourceEduAdv = new MatTableDataSource(this.eduAdvData);
        this.educationAdvDataSource = new MatTableDataSource(this.eduAdvData);
        this.allEmployeeDataEduAdv = new MatTableDataSource(this.eduAdvData);
      })
    } else if (this.selectedTab === "MARRIAGE ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataMarriageAdvance(data);

        this.marriageAdvDataSource.data = categorizedData;
        this.mrgAdvData = categorizedData
        this.filteredDataMrgAdv = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataMrgAdvDesg = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataMrgAdvOfcCode = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataMrgAdvEmpName = this.mrgAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceMrgAdv = new MatTableDataSource(this.mrgAdvData);
        this.marriageAdvDataSource = new MatTableDataSource(this.mrgAdvData);
        this.allEmployeeDataMrgAdv = new MatTableDataSource(this.mrgAdvData);
      })
    } else if (this.selectedTab === "CONVEYANCE ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataConveyanceAdvance(data);

        this.conveyanceAdvDataSource.data = categorizedData;
        this.convAdvData = categorizedData;
        this.filteredDataConvAdv = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataConvAdvDesg = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataConvAdvOfcCode = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataConvAdvEmpName = this.convAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceConvAdv = new MatTableDataSource(this.convAdvData);
        this.conveyanceAdvDataSource = new MatTableDataSource(this.convAdvData);
        this.allEmployeeDataConvAdv = new MatTableDataSource(this.convAdvData);
      })
    } else if (this.selectedTab === "FESTIVAL ADVANCE") {
      this.apiCall.apiGetCall('aggregateds').subscribe((data: any) => {
        console.log(data);
        const categorizedData = this.processDataFestivalAdvance(data);

        this.festivalAdvDataSource.data = categorizedData;
        this.festAdvData = categorizedData;
        this.filteredDataFestAdv = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataFestAdvDesg = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataFestAdvOfcCode = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataFestAdvEmpName = this.festAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceFestAdv = new MatTableDataSource(this.festAdvData);
        this.festivalAdvDataSource = new MatTableDataSource(this.festAdvData);
        this.allEmployeeDataFestAdv = new MatTableDataSource(this.festAdvData);
      })
    } else if (this.selectedTab === "INCOME TAX") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataIncomeTax(data)
        this.incomeTaxDataSource.data = categorizedData;

        this.incomeAdvData = categorizedData
        this.filteredDataIncomeTax = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataIncomeTaxDesg = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataIncomeTaxOfcCode = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataIncomeTaxEmpName = this.incomeAdvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceIncomeAdv = new MatTableDataSource(this.incomeAdvData);
        this.incomeTaxDataSource = new MatTableDataSource(this.incomeAdvData);
        this.allEmployeeDataIncomeAdv = new MatTableDataSource(this.incomeAdvData);
      })
    } else if (this.selectedTab === "ONEDAY RECOVERY") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataOneDayRecv(data)
        this.oneDayRecoveryDataSource.data = categorizedData;

        this.oneDayRecvData = categorizedData
        this.filteredDataOneDayRecv = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataOneDayRecvDesg = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataOneDayRecvOfcCode = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataOneDayRecvEmpName = this.oneDayRecvData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceOneDayRecv = new MatTableDataSource(this.oneDayRecvData);
        this.oneDayRecoveryDataSource = new MatTableDataSource(this.oneDayRecvData);
        this.allEmployeeDataOneDayRecv = new MatTableDataSource(this.oneDayRecvData);
      })
    } else if (this.selectedTab === "NHIS") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataNHIS(data)
        this.nhisDataSource.data = categorizedData;

        this.nhisData = categorizedData

        this.filteredDataNHIS = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataNHISDesg = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataNHISOfcCode = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataNHISEmpName = this.nhisData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceNHIS = new MatTableDataSource(this.nhisData);
        this.nhisDataSource = new MatTableDataSource(this.nhisData);
        this.allEmployeeDataNHIS = new MatTableDataSource(this.nhisData);
      })
    } else if (this.selectedTab === "CPS") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        console.log(data,"aggdata")
        let categorizedData = this.processDataCPS(data)
        this.cpsDataSource.data = categorizedData;

        this.cpsData = categorizedData
        this.filteredDataCPS = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataCPSDesg = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataCPSOfcCode = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataCPSEmpName = this.cpsData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceCPS = new MatTableDataSource(this.cpsData);
        this.cpsDataSource = new MatTableDataSource(this.cpsData);
        this.allEmployeeDataCPS = new MatTableDataSource(this.cpsData);
      })
    } else if (this.selectedTab === "PROFESSIONAL TAX") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataProfTax(data)
        this.professionalTaxDataSource.data = categorizedData;

        this.profTaxData = categorizedData


        this.filteredDataProfTax = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataProfTaxDesg = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataProfTaxOfcCode = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataProfTaxEmpName = this.profTaxData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceProfTax = new MatTableDataSource(this.profTaxData);
        this.professionalTaxDataSource = new MatTableDataSource(this.profTaxData);
        this.allEmployeeDataProfTax = new MatTableDataSource(this.profTaxData);
      })
    } else if (this.selectedTab === "RENT") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataRent(data)
        this.rentDataSource.data = categorizedData;

        this.rentData = categorizedData

        this.filteredDataRent = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataRentDesg = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataRentOfcCode = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataRentEmpName = this.rentData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceRent = new MatTableDataSource(this.rentData);
        this.rentDataSource = new MatTableDataSource(this.rentData);
        this.allEmployeeDataRent = new MatTableDataSource(this.rentData);
      })
    } else if (this.selectedTab === "HBA") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        let categorizedData = this.processDataHBA(data)
        this.hbaDataSource.data = categorizedData;

        this.hbaData = categorizedData


        this.filteredDataHBA = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataHBADesg = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataHBAOfcCode = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataHBAEmpName = this.hbaData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceHBA = new MatTableDataSource(this.hbaData);
        this.hbaDataSource = new MatTableDataSource(this.hbaData);
        this.allEmployeeDataHBA = new MatTableDataSource(this.hbaData);
      })
    }else if (this.selectedTab === "FBF") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {

        let categorizedData = this.processDataFBF(data)
        this.fbfDataSource.data = categorizedData;

        this.fbfData = categorizedData
        this.filteredDataFBF = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataFBFDesg = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataFBFOfcCode = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataFBFEmpName = this.fbfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceFBF = new MatTableDataSource(this.fbfData);
        this.fbfDataSource = new MatTableDataSource(this.fbfData);
        this.allEmployeeDataFBF = new MatTableDataSource(this.fbfData);
      })
    }else if (this.selectedTab === "SPECIAL PF") {

      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        let categorizedData = this.processDataSplPf(data)
        this.specialPfDataSource.data = categorizedData;
        this.splPFData = categorizedData

        this.filteredDataSplPf = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataSplPfDesg = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataSplPfOfcCode = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataSplPfEmpName = this.splPFData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceSplPf = new MatTableDataSource(this.splPFData);
        this.specialPfDataSource = new MatTableDataSource(this.splPFData);
        this.allEmployeeDataSplPf = new MatTableDataSource(this.splPFData);
      })

    }else if (this.selectedTab === "GPF") {
      this.apiCall.apiGetCall('aggregateds').subscribe(data => {
        let categorizedData = this.processDataGpfData(data)
        this.gpfDataSource.data = categorizedData;
        this.gpfData = categorizedData

        this.filteredDataGPF = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeId === obj.employeeId
          ))
        );
        this.filteredDataGPFDesg = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.designationName === obj.designationName
          ))
        );
        this.filteredDataGPFOfcCode = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.officeCode === obj.officeCode
          ))
        );
        this.filteredDataGPFEmpName = this.gpfData.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.employeeName === obj.employeeName
          ))
        );
        this.allEmployeeDataSourceGPF = new MatTableDataSource(this.gpfData);
        this.gpfDataSource = new MatTableDataSource(this.gpfData);
        this.allEmployeeDataGPF = new MatTableDataSource(this.gpfData);
      })
    }
  }

  applyTableEmployeeIdFilter(event) {
    const selectedEmpId: any = event.value;
    console.log(selectedEmpId, "selectedEmpId")

    if (this.selectedTab === "MISCELLENEOUS 1") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource.data = this.allEmployeeData.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.miscDataSource.data = this.allEmployeeDataSource.data;
      }
    } else if (this.selectedTab === "MISCELLENEOUS 2") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource2.data = this.allEmployeeData.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.miscDataSource2.data = this.allEmployeeDataSource.data;
      }
    } else if (this.selectedTab === "PAY ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.payAdvDataSource.data = this.allEmployeeDataPayAdv.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.payAdvDataSource.data = this.allEmployeeDataSourcePayAdv.data;
      }
    } else if (this.selectedTab === "EDUCATION ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.educationAdvDataSource.data = this.allEmployeeDataEduAdv.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.educationAdvDataSource.data = this.allEmployeeDataSourceEduAdv.data;
      }
    } else if (this.selectedTab === "MARRIAGE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.marriageAdvDataSource.data = this.allEmployeeDataMrgAdv.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.marriageAdvDataSource.data = this.allEmployeeDataSourceMrgAdv.data;
      }
    } else if (this.selectedTab === "CONVEYANCE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.conveyanceAdvDataSource.data = this.allEmployeeDataConvAdv.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.conveyanceAdvDataSource.data = this.allEmployeeDataSourceConvAdv.data;
      }
    } else if (this.selectedTab === "FESTIVAL ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.festivalAdvDataSource.data = this.allEmployeeDataFestAdv.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.festivalAdvDataSource.data = this.allEmployeeDataSourceFestAdv.data;
      }
    } else if (this.selectedTab === "INCOME TAX") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.incomeTaxDataSource.data = this.allEmployeeDataIncomeAdv.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.incomeTaxDataSource.data = this.allEmployeeDataSourceIncomeAdv.data;
      }
    } else if (this.selectedTab === "ONEDAY RECOVERY") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataOneDayRecv.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataSourceOneDayRecv.data;
      }
    } else if (this.selectedTab === "NHIS") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.nhisDataSource.data = this.allEmployeeDataNHIS.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.nhisDataSource.data = this.allEmployeeDataSourceNHIS.data;
      }
    } else if (this.selectedTab === "CPS") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.cpsDataSource.data = this.allEmployeeDataCPS.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.cpsDataSource.data = this.allEmployeeDataSourceCPS.data;
      }
    } else if (this.selectedTab === "PROFESSIONAL TAX") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.professionalTaxDataSource.data = this.allEmployeeDataProfTax.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.professionalTaxDataSource.data = this.allEmployeeDataSourceProfTax.data;
      }
    } else if (this.selectedTab === "RENT") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.rentDataSource.data = this.allEmployeeDataRent.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.rentDataSource.data = this.allEmployeeDataSourceRent.data;
      }
    } else if (this.selectedTab === "HBA") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.hbaDataSource.data = this.allEmployeeDataHBA.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.hbaDataSource.data = this.allEmployeeDataSourceHBA.data;
      }
    } else if (this.selectedTab === "FBF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.fbfDataSource.data = this.allEmployeeDataFBF.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.fbfDataSource.data = this.allEmployeeDataSourceFBF.data;
      }
    } else if (this.selectedTab === "SPECIAL PF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.specialPfDataSource.data = this.allEmployeeDataSplPf.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.specialPfDataSource.data = this.allEmployeeDataSourceSplPf.data;
      }
    } else if (this.selectedTab === "GPF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.gpfDataSource.data = this.allEmployeeDataGPF.data.filter(employee => selectedEmpId.includes(employee.employeeId));
      } else {
        // If no options are selected, display all data
        this.gpfDataSource.data = this.allEmployeeDataSourceGPF.data;
      }
    }
  }

  applyTableDesinationFilter(event) {
    const selectedEmpId: any = event.value;
    console.log(selectedEmpId, "selectedEmpId")

    if (this.selectedTab === "MISCELLENEOUS 1") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource.data = this.allEmployeeData.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.miscDataSource.data = this.allEmployeeDataSource.data;
      }
    } else if (this.selectedTab === "MISCELLENEOUS 2") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource2.data = this.allEmployeeDataMisc2.data.filter(employee => selectedEmpId.includes(employee.designation));
      } else {
        // If no options are selected, display all data
        this.miscDataSource2.data = this.allEmployeeDataSourceMisc2.data;
      }
    } else if (this.selectedTab === "PAY ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.payAdvDataSource.data = this.allEmployeeDataPayAdv.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.payAdvDataSource.data = this.allEmployeeDataSourcePayAdv.data;
      }
    } else if (this.selectedTab === "EDUCATION ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.educationAdvDataSource.data = this.allEmployeeDataEduAdv.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.educationAdvDataSource.data = this.allEmployeeDataSourceEduAdv.data;
      }
    } else if (this.selectedTab === "MARRIAGE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.marriageAdvDataSource.data = this.allEmployeeDataMrgAdv.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.marriageAdvDataSource.data = this.allEmployeeDataSourceMrgAdv.data;
      }
    } else if (this.selectedTab === "CONVEYANCE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.conveyanceAdvDataSource.data = this.allEmployeeDataConvAdv.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.conveyanceAdvDataSource.data = this.allEmployeeDataSourceConvAdv.data;
      }
    } else if (this.selectedTab === "FESTIVAL ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.festivalAdvDataSource.data = this.allEmployeeDataFestAdv.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.festivalAdvDataSource.data = this.allEmployeeDataSourceFestAdv.data;
      }
    } else if (this.selectedTab === "INCOME TAX") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.incomeTaxDataSource.data = this.allEmployeeDataIncomeAdv.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.incomeTaxDataSource.data = this.allEmployeeDataSourceIncomeAdv.data;
      }
    } else if (this.selectedTab === "ONEDAY RECOVERY") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataOneDayRecv.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataSourceOneDayRecv.data;
      }
    } else if (this.selectedTab === "NHIS") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.nhisDataSource.data = this.allEmployeeDataNHIS.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.nhisDataSource.data = this.allEmployeeDataSourceNHIS.data;
      }
    } else if (this.selectedTab === "CPS") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.cpsDataSource.data = this.allEmployeeDataCPS.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.cpsDataSource.data = this.allEmployeeDataSourceCPS.data;
      }
    } else if (this.selectedTab === "PROFESSIONAL TAX") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.professionalTaxDataSource.data = this.allEmployeeDataProfTax.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.professionalTaxDataSource.data = this.allEmployeeDataSourceProfTax.data;
      }
    } else if (this.selectedTab === "RENT") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.rentDataSource.data = this.allEmployeeDataRent.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.rentDataSource.data = this.allEmployeeDataSourceRent.data;
      }
    } else if (this.selectedTab === "HBA") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.hbaDataSource.data = this.allEmployeeDataHBA.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.hbaDataSource.data = this.allEmployeeDataSourceHBA.data;
      }
    } else if (this.selectedTab === "FBF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.fbfDataSource.data = this.allEmployeeDataFBF.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.fbfDataSource.data = this.allEmployeeDataSourceFBF.data;
      }
    } else if (this.selectedTab === "SPECIAL PF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.specialPfDataSource.data = this.allEmployeeDataSplPf.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.specialPfDataSource.data = this.allEmployeeDataSourceSplPf.data;
      }
    } else if (this.selectedTab === "GPF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.gpfDataSource.data = this.allEmployeeDataGPF.data.filter(employee => selectedEmpId.includes(employee.designationName));
      } else {
        // If no options are selected, display all data
        this.gpfDataSource.data = this.allEmployeeDataSourceGPF.data;
      }
    }
  }

  applyTableOfficeCodeFilter(event) {
    const selectedEmpId: any = event.value;
    console.log(selectedEmpId, "selectedEmpId")

    if (this.selectedTab === "MISCELLENEOUS 1") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource.data = this.allEmployeeData.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.miscDataSource.data = this.allEmployeeDataSource.data;
      }
    } else if (this.selectedTab === "MISCELLENEOUS 2") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource2.data = this.allEmployeeDataMisc2.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.miscDataSource2.data = this.allEmployeeDataSourceMisc2.data;
      }
    } else if (this.selectedTab === "PAY ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.payAdvDataSource.data = this.allEmployeeDataPayAdv.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.payAdvDataSource.data = this.allEmployeeDataSourcePayAdv.data;
      }
    } else if (this.selectedTab === "EDUCATION ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.educationAdvDataSource.data = this.allEmployeeDataEduAdv.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.educationAdvDataSource.data = this.allEmployeeDataSourceEduAdv.data;
      }
    } else if (this.selectedTab === "MARRIAGE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.marriageAdvDataSource.data = this.allEmployeeDataMrgAdv.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.marriageAdvDataSource.data = this.allEmployeeDataSourceMrgAdv.data;
      }
    } else if (this.selectedTab === "CONVEYANCE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.conveyanceAdvDataSource.data = this.allEmployeeDataConvAdv.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.conveyanceAdvDataSource.data = this.allEmployeeDataSourceConvAdv.data;
      }
    } else if (this.selectedTab === "FESTIVAL ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.festivalAdvDataSource.data = this.allEmployeeDataFestAdv.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.festivalAdvDataSource.data = this.allEmployeeDataSourceFestAdv.data;
      }
    } else if (this.selectedTab === "INCOME TAX") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.incomeTaxDataSource.data = this.allEmployeeDataIncomeAdv.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.incomeTaxDataSource.data = this.allEmployeeDataSourceIncomeAdv.data;
      }
    } else if (this.selectedTab === "ONEDAY RECOVERY") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataOneDayRecv.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataSourceOneDayRecv.data;
      }
    } else if (this.selectedTab === "NHIS") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.nhisDataSource.data = this.allEmployeeDataNHIS.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.nhisDataSource.data = this.allEmployeeDataSourceNHIS.data;
      }
    } else if (this.selectedTab === "CPS") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.cpsDataSource.data = this.allEmployeeDataCPS.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.cpsDataSource.data = this.allEmployeeDataSourceCPS.data;
      }
    } else if (this.selectedTab === "PROFESSIONAL TAX") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.professionalTaxDataSource.data = this.allEmployeeDataProfTax.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.professionalTaxDataSource.data = this.allEmployeeDataSourceProfTax.data;
      }
    } else if (this.selectedTab === "RENT") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.rentDataSource.data = this.allEmployeeDataRent.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.rentDataSource.data = this.allEmployeeDataSourceRent.data;
      }
    } else if (this.selectedTab === "HBA") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.hbaDataSource.data = this.allEmployeeDataHBA.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.hbaDataSource.data = this.allEmployeeDataSourceHBA.data;
      }
    } else if (this.selectedTab === "FBF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.fbfDataSource.data = this.allEmployeeDataFBF.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.fbfDataSource.data = this.allEmployeeDataSourceFBF.data;
      }
    } else if (this.selectedTab === "SPECIAL PF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.specialPfDataSource.data = this.allEmployeeDataSplPf.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.specialPfDataSource.data = this.allEmployeeDataSourceSplPf.data;
      }
    } else if (this.selectedTab === "GPF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.gpfDataSource.data = this.allEmployeeDataGPF.data.filter(employee => selectedEmpId.includes(employee.officeCode));
      } else {
        // If no options are selected, display all data
        this.gpfDataSource.data = this.allEmployeeDataSourceGPF.data;
      }
    }
  }

  applyTableEmployeeNameFilter(event) {
    const selectedEmpId: any = event.value;
    console.log(selectedEmpId, "selectedEmpId")

    if (this.selectedTab === "MISCELLENEOUS 1") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource.data = this.allEmployeeData.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.miscDataSource.data = this.allEmployeeDataSource.data;
      }
    } else if (this.selectedTab === "MISCELLENEOUS 2") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.miscDataSource2.data = this.allEmployeeDataMisc2.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.miscDataSource2.data = this.allEmployeeDataSourceMisc2.data;
      }
    } else if (this.selectedTab === "PAY ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.payAdvDataSource.data = this.allEmployeeDataPayAdv.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.payAdvDataSource.data = this.allEmployeeDataSourcePayAdv.data;
      }
    } else if (this.selectedTab === "EDUCATION ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.educationAdvDataSource.data = this.allEmployeeDataEduAdv.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.educationAdvDataSource.data = this.allEmployeeDataSourceEduAdv.data;
      }
    } else if (this.selectedTab === "MARRIAGE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.marriageAdvDataSource.data = this.allEmployeeDataMrgAdv.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.marriageAdvDataSource.data = this.allEmployeeDataSourceMrgAdv.data;
      }
    } else if (this.selectedTab === "CONVEYANCE ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.conveyanceAdvDataSource.data = this.allEmployeeDataConvAdv.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.conveyanceAdvDataSource.data = this.allEmployeeDataSourceConvAdv.data;
      }
    } else if (this.selectedTab === "FESTIVAL ADVANCE") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.festivalAdvDataSource.data = this.allEmployeeDataFestAdv.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.festivalAdvDataSource.data = this.allEmployeeDataSourceFestAdv.data;
      }
    } else if (this.selectedTab === "INCOME TAX") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.incomeTaxDataSource.data = this.allEmployeeDataIncomeAdv.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.incomeTaxDataSource.data = this.allEmployeeDataSourceIncomeAdv.data;
      }
    } else if (this.selectedTab === "ONEDAY RECOVERY") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataOneDayRecv.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.oneDayRecoveryDataSource.data = this.allEmployeeDataSourceOneDayRecv.data;
      }
    } else if (this.selectedTab === "NHIS") {
      console.log("pay if")
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.nhisDataSource.data = this.allEmployeeDataNHIS.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.nhisDataSource.data = this.allEmployeeDataSourceNHIS.data;
      }
    } else if (this.selectedTab === "CPS") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.cpsDataSource.data = this.allEmployeeDataCPS.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.cpsDataSource.data = this.allEmployeeDataSourceCPS.data;
      }
    } else if (this.selectedTab === "PROFESSIONAL TAX") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.professionalTaxDataSource.data = this.allEmployeeDataProfTax.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.professionalTaxDataSource.data = this.allEmployeeDataSourceProfTax.data;
      }
    } else if (this.selectedTab === "RENT") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.rentDataSource.data = this.allEmployeeDataRent.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.rentDataSource.data = this.allEmployeeDataSourceRent.data;
      }
    } else if (this.selectedTab === "HBA") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.hbaDataSource.data = this.allEmployeeDataHBA.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.hbaDataSource.data = this.allEmployeeDataSourceHBA.data;
      }
    } else if (this.selectedTab === "FBF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.fbfDataSource.data = this.allEmployeeDataFBF.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.fbfDataSource.data = this.allEmployeeDataSourceFBF.data;
      }
    } else if (this.selectedTab === "SPECIAL PF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.specialPfDataSource.data = this.allEmployeeDataSplPf.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.specialPfDataSource.data = this.allEmployeeDataSourceSplPf.data;
      }
    } else if (this.selectedTab === "GPF") {
      if (selectedEmpId && selectedEmpId.length > 0) {
        this.gpfDataSource.data = this.allEmployeeDataGPF.data.filter(employee => selectedEmpId.includes(employee.employeeName));
      } else {
        // If no options are selected, display all data
        this.gpfDataSource.data = this.allEmployeeDataSourceGPF.data;
      }
    }
  }

  //filtered recoveerd data

  processDataMisc1(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName,miscDeduction1, misc1Total,misc1Recovered } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          miscDeduction1: 0,
          misc1Total,
          misc1Recovered

        };
      }
      acc[employeeId].miscDeduction1 += miscDeduction1;
      return acc;
    }, {});

    Object.values(categorizedData).forEach((employee: any) => {
      employee.misc1balance = Math.abs(employee.misc1Total - employee.misc1Recovered);
    });

    return Object.values(categorizedData);
  }

  processDataMisc2(data: any[]): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, miscDeduction2, misc2Total,misc2Recovered } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          miscDeduction2: 0,
          misc2Total,
          misc2Recovered
        };
      }
      acc[employeeId].miscDeduction2 += miscDeduction2;
      return acc;
    }, {});

    Object.values(categorizedData).forEach((employee: any) => {
      employee.misc2balance = Math.abs(employee.misc2Total - employee.misc2Recovered);
    });

    return Object.values(categorizedData);
  }

  //GPF data
  processDataGpfData(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, basicPayEarning ,personalPay,specialPay,da,gpfSub,vpf,gpfLoan,gpfArrear,gpfTotal} = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          basicPayEarning: 0,
          personalPay:0,
          specialPay:0,
          da:0,
          gpfSub:0,
          vpf:0,
          gpfLoan:0,
          gpfArrear:0,
          gpfTotal:0
        };
      }
      acc[employeeId].basicPayEarning += basicPayEarning;
      acc[employeeId].personalPay += personalPay;
      acc[employeeId].specialPay += specialPay;
      acc[employeeId].da += da;
      acc[employeeId].gpfSub += gpfSub;
      acc[employeeId].vpf += vpf;
      acc[employeeId].gpfLoan += gpfLoan;
      acc[employeeId].gpfArrear += gpfArrear;
      acc[employeeId].gpfTotal += gpfTotal;


      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataSplPf(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, specialPf } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          specialPf: 0,
        };
      }
      acc[employeeId].specialPf += specialPf;
      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataFBF(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, fbf } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          fbf: 0,
        };
      }
      acc[employeeId].fbf += fbf;
      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataProfTax(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, professionalTax } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          professionalTax: 0,
        };
      }
      acc[employeeId].professionalTax += professionalTax;
      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataNHIS(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, nhis } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          nhis: 0,
        };
      }
      acc[employeeId].nhis += nhis;
      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataIncomeTax(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, panNo ,basicPayEarning,totalEarning,incomeTax,incomeTaxCess,totalAmount} = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          panNo: 0,
          basicPayEarning:0,
          totalEarning:0,
          incomeTax:0,
          incomeTaxCess:0,
          totalAmount:0
        };
      }

      acc[employeeId].basicPayEarning += basicPayEarning;
      acc[employeeId].totalEarning += totalEarning;
      acc[employeeId].incomeTax += incomeTax;
      acc[employeeId].incomeTaxCess += incomeTaxCess;

      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataHBA(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, hba ,hbf,eoe,hbaTotal} = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          hba: 0,
          hbf:0,
          eoe:0,
          hbaTotal:0,
        };
      }
      acc[employeeId].hba += hba;
      acc[employeeId].hbf += hbf;
      acc[employeeId].eoe += eoe;
      acc[employeeId].hbaTotal += hbaTotal;


      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataRent(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, rentDeductions ,waterCharges,totalAmount,rentTotal} = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          rentDeductions: 0,
          waterCharges:0,
          totalAmount:0,
          rentTotal:0
        };
      }
      acc[employeeId].rentDeductions += rentDeductions;
      acc[employeeId].waterCharges += waterCharges;
      acc[employeeId].totalAmount += totalAmount;
      acc[employeeId].rentTotal += rentTotal;



      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataCPS(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, basicPayEarning ,personalPay,specialPay,da,cps,cpsArrear,total} = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          basicPayEarning: 0,
          personalPay:0,
          specialPay:0,
          da:0,
          cps:0,
          cpsArrear:0,
          total:0
          
        };
      }
      acc[employeeId].basicPayEarning += basicPayEarning;
      acc[employeeId].personalPay += personalPay;
      acc[employeeId].specialPay += specialPay;
      acc[employeeId].da += da;
      acc[employeeId].cps += cps;
      acc[employeeId].cpsArrear += cpsArrear;
      acc[employeeId].total += total;




      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataOneDayRecv(data: any): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, basicPayEarning ,totalEarning,oneDayRecovery} = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          basicPayEarning: 0,
          totalEarning:0,
          oneDayRecovery:0,
          
        };
      }
      acc[employeeId].basicPayEarning += basicPayEarning;
      acc[employeeId].totalEarning += totalEarning;
      acc[employeeId].oneDayRecovery += oneDayRecovery;
      return acc;
    }, {});

    return Object.values(categorizedData);
  }

  processDataPayAdvance(data: any[]): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, payAdvance, payTotal,payRecovered } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          payAdvance: 0,
          payTotal,
          payRecovered
        };
      }
      acc[employeeId].payAdvance += payAdvance;
      return acc;
    }, {});

    Object.values(categorizedData).forEach((employee: any) => {
      employee.payAdvbalance = Math.abs(employee.payTotal - employee.payRecovered);
    });

    return Object.values(categorizedData);
  }

  processDataEducationAdvance(data: any[]): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, educationAdvance, educationTotal,educationRecovered } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          educationAdvance: 0,
          educationTotal,
          educationRecovered
        };
      }
      acc[employeeId].educationAdvance += educationAdvance;
      return acc;
    }, {});

    Object.values(categorizedData).forEach((employee: any) => {
      employee.eduAdvbalanceAmount = Math.abs(employee.educationTotal - employee.educationRecovered);
    });

    return Object.values(categorizedData);
  }

  processDataMarriageAdvance(data: any[]): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, marriageAdvance, marraigeTotal,marraigeRecoverd } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          marriageAdvance: 0,
          marraigeTotal,
          marraigeRecoverd
        };
      }
      acc[employeeId].marriageAdvance += marriageAdvance;
      return acc;
    }, {});

    Object.values(categorizedData).forEach((employee: any) => {
      employee.marriagebalanceAmount = Math.abs(employee.marraigeTotal - employee.marraigeRecoverd);
    });

    return Object.values(categorizedData);
  }

  processDataConveyanceAdvance(data: any[]): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, conveyanceAdvance, conveyanceTotal ,conveyanceRecovered} = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          conveyanceAdvance: 0,
          conveyanceTotal,
          conveyanceRecovered
        };
      }
      acc[employeeId].conveyanceAdvance += conveyanceAdvance;
      return acc;
    }, {});

    Object.values(categorizedData).forEach((employee: any) => {
      employee.convbalanceAmount = Math.abs(employee.conveyanceTotal - employee.conveyanceRecovered);
    });

    return Object.values(categorizedData);
  }

  processDataFestivalAdvance(data: any[]): any[] {
    const categorizedData = data.reduce((acc, employee) => {
      const { employeeId, officeCode, employeeName, designationName, festivalAdvance, festivalTotal,festivalRecovered } = employee;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          officeCode,
          employeeName,
          designationName,
          festivalAdvance: 0,
          festivalTotal,
          festivalRecovered
        };
      }
      acc[employeeId].festivalAdvance += festivalAdvance;
      return acc;
    }, {});

    Object.values(categorizedData).forEach((employee: any) => {
      employee.festbalanceAmount = Math.abs(employee.festivalTotal - employee.festivalRecovered);
    });

    return Object.values(categorizedData);
  }

    //MISC - 1

    downloadMiscPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Miscelleneous';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Recovery Amount',
          'Balance'
        ];
  
        this.miscDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.recoveryAmount,
            element.balanceAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadMiscExcel(): void {
      this.excelData = this.miscDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Recovery Amount': item.recoveryAmount,
        'Balance': item.balanceAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Miscelleneous Report.xlsx');
    }
  
    //Misc - 2
  
    downloadMisc_2_PDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Miscelleneous - 2';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Recovery Amount',
          'Balance'
        ];
  
        this.miscDataSource2.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.recoveryAmount,
            element.balanceAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadMisc_2_Excel(): void {
      this.excelData = this.miscDataSource2.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Recovery Amount': item.recoveryAmount,
        'Balance': item.balanceAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Miscelleneous-2 Report.xlsx');
    }
  
    // PAY ADVANCE
  
    downloadPayADvPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Pay Advance';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Pay Advance Amount',
          'Balance'
        ];
  
        this.payAdvDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.payAdvanceAmount,
            element.balanceAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadPayADvExcel(): void {
      this.excelData = this.payAdvDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Pay Advance Amount': item.payAdvanceAmount,
        'Balance': item.balanceAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Pay Advance Report.xlsx');
    }
  
    // EDUCATION ADV
  
    downloadEduAdvPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Education Advance';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Education Recovery Amount',
          'Balance'
        ];
  
        this.educationAdvDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.educationAdvanceAmount,
            element.balanceAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadEduAdvExcel(): void {
      this.excelData = this.educationAdvDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Education Recovery Amount': item.educationAdvanceAmount,
        'Balance': item.balanceAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Education Advance Report.xlsx');
    }
  
    // MARRIAGE ADVANCE
  
    downloadMrgAdvPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Marriage Advance';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Marriage Amount',
          'Balance'
        ];
  
        this.marriageAdvDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.marriageAdvanceAmount,
            element.balanceAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadMrgAdvExcel(): void {
      this.excelData = this.marriageAdvDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Marriage Amount': item.marriageAdvanceAmount,
        'Balance': item.balanceAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Marriage Advance Report.xlsx');
    }
  
    // Conveyence Advance
  
    downloadConvAdvPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Conveyance Advance';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Conveyance Amount',
          'Balance'
        ];
  
        this.conveyanceAdvDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.convenyanceAdvanceAmount,
            element.balanceAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadConvAdvExcel(): void {
      this.excelData = this.conveyanceAdvDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Conveyance Amount': item.convenyanceAdvanceAmount,
        'Balance': item.balanceAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Conveyance Advance Report.xlsx');
    }
  
    //FESTIVAL Advance
  
    downloadFestAdvPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Festival Advance';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Festival Amount',
          'Balance'
        ];
  
        this.festivalAdvDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.festivalAdvanceAmount,
            element.balanceAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadFestAdvExcel(): void {
      this.excelData = this.festivalAdvDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Festival Amount': item.festivalAdvanceAmount,
        'Balance': item.balanceAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Festival Advance Report.xlsx');
    }
  
    // Income Tax
  
    downloadIncomeDataPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Income Tax';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Pan No',
          'Basic Pay',
          'Gross',
          'Income Tax',
          'Income Tax Cess',
          'Total'
        ];
  
        this.incomeTaxDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.panNo,
            element.basicPay,
            element.gross,
            element.incomeTax,
            element.incomeTaxCess,
            element.totalAmount,
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadIncomeDataExcel(): void {
      this.excelData = this.incomeTaxDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Pan No': item.panNo,
        'Basic Pay': item.basicPay,
        'Gross': item.gross,
        'Income Tax': item.incomeTax,
        'Income Tax Cess': item.incomeTaxCess,
        'Total': item.totalAmount,
  
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Income Tax Report.xlsx');
    }
  
    // One Day Recovery
  
    downloadOnedayRecvPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'One Day Recovery';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Basic Pay',
          'Gross',
          'Deduction Amount',
        ];
  
        this.oneDayRecoveryDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.basicPay,
            element.gross,
            element.deductionAmount,
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadOnedayRecvExcel(): void {
      this.excelData = this.oneDayRecoveryDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Basic Pay': item.basicPay,
        'Gross': item.gross,
        'Deduction Amount': item.deductionAmount
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'One Day Recovery Report.xlsx');
    }
  
    //NHIS
  
    downloadNHISPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'NHIS';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'NHIS Amount',
        ];
  
        this.nhisDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.nhisAmount,
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadNHISExcel(): void {
      this.excelData = this.nhisDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'NHIS Amount': item.nhisAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'NHIS Report.xlsx');
    }
  
    // CPS
  
    downloadCpsPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'CPS';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Basic Pay',
          'Personal Pay',
          'Special Pay',
          'DA',
          'CPS',
          'CPS Arrear',
          'Total'
        ];
  
        this.cpsDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.basicPay,
            element.personalPay,
            element.specialPay,
            element.da,
            element.cpsAmount,
            element.cpsArrear,
            element.totalAmount,
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadCpsExcel(): void {
      this.excelData = this.cpsDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'basicPay': item.basicPay,
        'Personal Pay': item.personalPay,
        'Special Pay': item.specialPay,
        'DA': item.da,
        'CPS': item.cpsAmount,
        'CPS Arrear': item.cpsArrear,
        'Total': item.totalAmount,
  
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'CPS Report.xlsx');
    }
  
    // Professional tax
  
    downloadProfTaxPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Professional Tax';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Professioanl Tax Amount',
        ];
  
        this.professionalTaxDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.professionalTaxAmount,
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadProfTaxExcel(): void {
      this.excelData = this.professionalTaxDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Professioanl Tax Amount': item.professionalTaxAmount,
  
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Professional Tax Report.xlsx');
    }
  
    // Rent
  
    downloadRentPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Rent Data';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Rent',
          'Water Charge',
          'Total'
        ];
  
        this.rentDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.rentAmount,
            element.waterCharge,
            element.totalAmount,
  
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadRentExcel(): void {
      this.excelData = this.rentDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Rent': item.rentAmount,
        'Water Charge': item.waterCharge,
        'Total': item.totalAmount,
  
  
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Rent Report.xlsx');
    }
  
    //HBA
  
    downloadHBAPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'HBA Data';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'HBA',
          'HBF',
          'EOE',
          'Total'
        ];
  
        this.hbaDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.hba,
            element.hbf,
            element.eoe,
            element.totalAmount,
  
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadHBAExcel(): void {
      this.excelData = this.hbaDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'HBA': item.hba,
        'HBF': item.hbf,
        'EOE': item.eoe,
        'Total': item.totalAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'HBA Report.xlsx');
    }
  
    //FBF
  
    downloadFBFPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'FBF Data';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'FBF Amount',
        ];
  
        this.fbfDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.fbfAmount,
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadFBFExcel(): void {
      this.excelData = this.fbfDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'FBF Amount': item.fbfAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'FBF Report.xlsx');
    }
  
    //Special PF
  
    downloadSplPfPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'Special PF Data';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Special PF Amount',
        ];
  
        this.specialPfDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.specialPfAmount,
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadSplPfExcel(): void {
      this.excelData = this.specialPfDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Special PF Amount': item.specialPfAmount,
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'Special PF Report.xlsx');
    }
  
    // GPF
  
    downloadGPFPDF() {
      var columnStyle: any;
      let currentdate = new Date();
      let formaateDate =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        currentdate.getDate().toString().padStart(2, '0') +
        ' ' +
        currentdate.getHours().toString().padStart(2, '0') +
        ':' +
        currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
  
      try {
        let currentdate = new Date();
        let formaateDate =
          currentdate.getFullYear() +
          '-' +
          (currentdate.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          currentdate.getDate().toString().padStart(2, '0') +
          ' ' +
          currentdate.getHours().toString().padStart(2, '0') +
          ':' +
          currentdate.getMinutes().toString().padStart(2, '0');
        console.log('formate', formaateDate);
  
        let getExportdata: any = [];
        var fileName: any;
        let headerName: any = [];
        let selectedDatetype: any;
  
        columnStyle = {
          // 0: { halign: "center" },
          // 1: { halign: "right" },
          // 2: { halign: "right" },
          // 3: { halign: "right" },
          // 4: { halign: "right" },
        };
        fileName = 'GPF Data';
        headerName = [
          'S.No',
          'Emp Code',
          'Office Code',
          'Emp Name',
          'Designation',
          'Basic Pay',
          'Personal Pay',
          'Special Pay',
          'DA',
          'GPF (S)',
          'VPF',
          'GPF (L)',
          'GPF Arrear',
          'Total'
        ];
  
        this.gpfDataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.employeeId,
            element.officeCode,
            element.employeeName,
            element.designation,
            element.basicPay,
            element.personalPay,
            element.specialPay,
            element.da,
            element.gpfSub,
            element.vpf,
            element.gpfLoan,
            element.gpfArrear,
            element.totalAmount,
          ];
          getExportdata.push(data);
        });
  
        const doc = new jsPDF('landscape');
        const imageUrl = '/assets/images/tnhbPDF.jpeg'; // Replace with the path to your image
        // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
        const imageWidth = 25; // Adjust the image width as needed
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imageX = 10;
  
        const imageY = 5; // Adjust the top margin as needed
  
        autoTable(doc, {
          head: [headerName],
          body: getExportdata,
          theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
          headStyles: {
            fillColor: [14, 31, 83],
            // Header background color
            textColor: 255, // Header text color
            // textColor: '#0E1F5',
            fontSize: 5, // Header font size
          },
          bodyStyles: {
            textColor: 0, // Body text color
            fontSize: 5, // Body font size
          },
          // columnStyles: columnStyle,
          alternateRowStyles: {
            fillColor: [255, 255, 255], // Alternate row background color
          },
          // columnStyles: cellWidth,
          margin: { top: 45 },
          pageBreak: 'auto',
          didDrawPage: (data) => {
            // console.log('data', data.pageCount);
            doc.addImage(imageUrl, 'png', 20, 0, 250, 30);
  
            doc.setTextColor(14, 31, 83);
            let titleY = 33;
            doc.text(fileName, doc.internal.pageSize.getWidth() / 2, titleY, {
              align: 'center',
            });
  
            doc.setFontSize(10);
            doc.text(
              'Page:' +
              ' ' +
              data.pageNumber +
              ', ' +
              'Generated on: ' +
              formaateDate,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          },
        });
  
        if (getExportdata.length > 0) {
          setTimeout(() => {
            doc.save(fileName + '.pdf');
          }, 100);
        } else {
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    downloadGPFExcel(): void {
      this.excelData = this.gpfDataSource.data.map((item, index) => ({
        'S.No': index + 1,
        'Emp Code ': item.employeeId,
        'Office Code': item.officeCode,
        'Emp Name': item.employeeName,
        'Designation': item.designation,
        'Basic Pay': item.basicPay,
        'Personal Pay': item.personalPay,
        'Special Pay': item.specialPay,
        'DA': item.da,
        'GPF (S)': item.gpfSub,
        'VPF': item.vpf,
        'GPF (L)': item.gpfLoan,
        'GPF Arrear': item.gpfArrear,
        'Total': item.totalAmount,
  
      }));
      console.log(this.excelData, ' this.excelData');
  
      const worksheet = XLSX.utils.json_to_sheet(this.excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(data, 'GPF Report.xlsx');
    }
  
}
