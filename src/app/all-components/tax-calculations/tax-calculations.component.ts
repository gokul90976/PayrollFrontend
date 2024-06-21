import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tax-calculations',
  templateUrl: './tax-calculations.component.html',
  styleUrl: './tax-calculations.component.css'
})
export class TaxCalculationsComponent implements OnInit {
  tableName: string = 'professionalTax'
  proftax :any= {}

  constructor(private apiCall: ApiService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {

  }

  professionalTaxDataSource = new MatTableDataSource<any>([]);
  professionalTaxTableColumns: string[] = ['id', 'professionalFrom', 'professionalTo', 'professionalValues','ACTION'];

  incomeTaxDataSource = new MatTableDataSource<any>([]);
  incomeTaxTableColumns: string[] = ['id', 'incomeTaxFrom','incomeTaxTo','incomeTaxValues', 'ACTION'];

  daDataSource = new MatTableDataSource<any>([]);
  daTableColumns: string[] = ['id', 'dafrom','dato', 'davalues', 'ACTION'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.professionalTaxDataSource.paginator = this.paginator;
    this.incomeTaxDataSource.paginator = this.paginator;
    this.daDataSource.paginator = this.paginator;

  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {

        const payload = {
          "id": id
        }

        this.apiCall.apiPostCall(payload, 'getTaxCalculationById').subscribe(data => {
          console.log("Tax Data", data);
          const allData: any = data?.data;
          if (allData) {

            // professional
            if (allData['field_type'] === "professional_type") {
              const profsFormArray = (this.professionalTaxForm.controls['items'] as FormArray).at(0);
              //  console.log("profsFormArray",profsFormArray);
              profsFormArray.patchValue(allData);
            }
            // income tax
            else if (allData['field_type'] === "income_tax") {
              const incomeTaxArray = (this.incomeTaxForm.controls['items'] as FormArray).at(0);
              //  console.log("incomeTaxArray",profsFormArray);
              incomeTaxArray.patchValue(allData);
            }
            // da
            else if (allData['field_type'] === "da") {
              const daArray = (this.daFormArr.controls['items'] as FormArray).at(0);
              //  console.log("daArray",profsFormArray);
              daArray.patchValue(allData);
            }

          } else {

          }


        })
      }
    });


    this.createProfessionalFormArray();
    this.createIncomeTaxFormArray();
    this.createDaFormArray();

    this.getProffesionalTaxRecList()
    // this.getIncomTaxRecList()
    // this.getDaRecList()

  }

  getProffesionalTaxRecList(): void {
    const payload = {"id":1}
    this.apiCall.apiPostCall(payload, 'getAllProfessionalTax').subscribe(data => {
      // data.data.forEach((element,index) => {
      //   element.id=index+1;

      //   console.log("Professional Tax == ",data);
        
        
      // });
      this.professionalTaxDataSource.data = data.data; 

      console.log("professional Tax == ",data);
      
    })
  }

  getIncomTaxRecList(): void {
    const payload = {}
    this.apiCall.apiPostCall(payload, 'getAllTaxCalculation').subscribe(data => {
      this.incomeTaxDataSource.data=data.data;

      console.log("Income Tax == ",data);


    })
  }

  getDaRecList(): void {
    const payload = {}
    this.apiCall.apiPostCall(payload, 'getAllTaxCalculation').subscribe(data => {
      this.daDataSource.data = data.data;

      console.log("DA period == ",data);

    })
  }

  goToTaxCrud(id : any){
    console.log(id)
    this.router.navigate(['/payroll/professionTaxEdit', id]);
  }

  showTables(tableName : string){
    this.tableName = tableName;
    console.log(this.tableName,"this.tableName")
    // this.getDaRecList();
    // this.getIncomTaxRecList();
    // this.getProffesionalTaxRecList();

    if(this.tableName == 'professionalTax'){
      this.getProffesionalTaxRecList()
    }else if(this.tableName == 'incomTax'){
      this.getIncomTaxRecList();
    }else{
      this.getDaRecList();
    }
  }

  // saveTaxCalculationDetails() {

  //   let professionalTaxForm = this.professionalTaxForm.controls['items'].value;
  //   let incomeTaxForm = this.incomeTaxForm.controls['items'].value;
  //   let daFormArr = this.daFormArr.controls['items'].value;
  //   console.log("professionalTaxForm", professionalTaxForm);
  //   console.log("incomeTaxForm", incomeTaxForm);
  //   console.log("daFormArr", daFormArr);

  //   // profession 
  //   if (professionalTaxForm[0]['professionalFrom'] === null || professionalTaxForm['professionalFrom'] === "") {
  //     professionalTaxForm = [];
  //   } else {
      
  //   }
  //   // income 
  //   if (incomeTaxForm[0]['incomeTaxFrom'] === null || incomeTaxForm['incomeTaxFrom'] === "") {
  //     incomeTaxForm = [];
  //   } else {
      
  //   }
  //   // da 
  //   if (daFormArr[0]['dafrom'] === null || daFormArr['dafrom'] === "") {
  //     daFormArr = [];
  //   } else {
      
  //   }

  //   const payload = [...professionalTaxForm, ...incomeTaxForm, ...daFormArr];
  //   this.apiCall.apiPostCall(payload, 'saveTaxCalculation').subscribe(data => {
  //     console.log("saved response", data);
  //     this.router.navigate(['/payroll/taxcalculation'])

  //   })
  // }

  saveProfessionalTax() {
    let professionalTaxForm = this.professionalTaxForm.controls['items'].value;
     
      console.log("professionalTaxForm", professionalTaxForm);
      
  
      // profession 
      if (professionalTaxForm[0]['professionalFrom'] === null || professionalTaxForm['professionalFrom'] === "") {
        professionalTaxForm = [];
      } else {
        
      }
  
      let obj = [{
        "from":this.proftax.proftax_from,
        "to":this.proftax.proftax_to,
        "values":this.proftax.proftax_value
  
    }]

      const payload = obj;
      this.apiCall.apiPostCall(payload, 'saveProfessionalTax').subscribe(data => {
        console.log("saved response", data);
        this.getProffesionalTaxRecList()
        this.router.navigate(['/payroll/Addtaxcalculation'])
  
      })
    
  }

  saveIncomeTax() {

    let incomeTaxForm = this.incomeTaxForm.controls['items'].value;

    console.log("incomeTaxForm", incomeTaxForm);

    // income 
    if (incomeTaxForm[0]['incomeTaxFrom'] === null || incomeTaxForm['incomeTaxFrom'] === "") {
      incomeTaxForm = [];
    } else {
      
    }

    const payload = incomeTaxForm;
    this.apiCall.apiPostCall(payload, 'saveTaxCalculation').subscribe(data => {
      console.log("saved response", data);
      if(data.status){
        this.proftax=""
      }
      this.router.navigate(['/payroll/taxcalculation'])

    })
  }

  saveDA() {

  
      let daFormArr = this.daFormArr.controls['items'].value;

      console.log("daFormArr", daFormArr);
  
      // da 
      if (daFormArr[0]['dafrom'] === null || daFormArr['dafrom'] === "") {
        daFormArr = [];
      } else {
        
      }

      const payload = daFormArr;
      this.apiCall.apiPostCall(payload, 'saveTaxCalculation').subscribe(data => {
        console.log("saved response", data);
        this.router.navigate(['/payroll/taxcalculation'])
        
      })
  }

  
  // professional tax form array
  professionalTaxForm !: FormGroup;


  createProfessionalFormArray() {
    this.professionalTaxForm = this.fb.group({
      items: this.fb.array([]) // Initialize an empty FormArray
    });
    this.addProfessionalFormItem();
  }

  createProfessionalItem() {
    return this.fb.group({
      // Define your form controls here
      "field_type": "professional_type",
      "id": [null],
      "professionalFrom": [null],
      "professionalTo": [null],
      "professionalValues": [null],
    });
  }

  // createProfessionalItem
  get items() {
    return (this.professionalTaxForm.get('items') as FormArray).controls;
  }

  addProfessionalFormItem() {
    const itemsFormArray = this.professionalTaxForm.get('items') as FormArray;
    const newItem = this.createProfessionalItem();
    itemsFormArray.push(newItem);
  }


  // Income Tax FormArray
  incomeTaxForm !: FormGroup;

  createIncomeTaxFormArray() {
    this.incomeTaxForm = this.fb.group({
      items: this.fb.array([]) // Initialize an empty FormArray
    });
    this.addIncomeTaxFormItem();
  }

  createIncomeTaxItem() {
    return this.fb.group({
      // Define your form controls here
      "field_type": "income_tax",
      "id": [null],
      "incomeTaxFrom": [''],
      "incomeTaxTo": [''],
      "incomeTaxValues": [''],
    });
  }
  // Income Tax Items
  get incomeTaxItems() {
    return (this.incomeTaxForm.get('items') as FormArray).controls;
  }

  addIncomeTaxFormItem() {
    const itemsFormArray = this.incomeTaxForm.get('items') as FormArray;
    const newItem = this.createIncomeTaxItem();
    itemsFormArray.push(newItem);
  }

  // DA FormArray

  daFormArr !: FormGroup;

  createDaFormArray() {
    this.daFormArr = this.fb.group({
      items: this.fb.array([]) // Initialize an empty FormArray
    });
    this.addDaFormItem();
  };

  createDaItem() {
    return this.fb.group({
      // Define your form controls here
      "field_type": "da",
      "id": [null],
      "dafrom": [''],
      "dato": [''],
      "davalues": [''],
    });
  };

  // Da Items
  get daItems() {
    return (this.daFormArr.get('items') as FormArray).controls;
  }

  addDaFormItem() {
    const itemsFormArray = this.daFormArr.get('items') as FormArray;
    const newItem = this.createDaItem();
    itemsFormArray.push(newItem);
  }



  deleteContainerBox(index: number, formGroup?: FormGroup) {
    const itemsFormArray = formGroup?.get('items') as FormArray;
    const id = itemsFormArray.value[index].id;
    if (id) {
      const payload = {
        "id": id
      };

      this.apiCall.apiPostCall(payload, 'deleteTaxCalculationById').subscribe(data => {
        console.log("delete response ", data);
        itemsFormArray.removeAt(index);
      })
    }
    else {
      itemsFormArray.removeAt(index);
    }
  }


}
