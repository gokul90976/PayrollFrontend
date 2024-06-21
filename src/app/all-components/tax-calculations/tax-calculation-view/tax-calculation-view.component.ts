import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-tax-calculation-view',
  templateUrl: './tax-calculation-view.component.html',
  styleUrl: './tax-calculation-view.component.css'
})
export class TaxCalculationViewComponent {

  tableName: string = 'professionalTax'

  professionalTaxDataSource = new MatTableDataSource<any>([]);
  professionalTaxTableColumns: string[] = ['id', 'professionalFrom', 'professionalTo', 'professionalValues','ACTION'];



  incomeTaxDataSource = new MatTableDataSource<any>([]);
  incomeTaxTableColumns: string[] = ['id', 'incomeTaxFrom','incomeTaxTo','incomeTaxValues', 'ACTION'];


  daDataSource = new MatTableDataSource<any>([]);
  daTableColumns: string[] = ['id','dato', 'dafrom', 'davalues', 'ACTION'];



  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  ngAfterViewInit() {
    this.professionalTaxDataSource.paginator = this.paginator;
    this.incomeTaxDataSource.paginator = this.paginator;
    this.daDataSource.paginator = this.paginator;

  }

  constructor(private apiCall: ApiService,private router: Router) { }


  ngOnInit(): void {
    this.getProffesionalTaxRecList()
    this.getIncomTaxRecList()
    this.getDaRecList()
  }
  getProffesionalTaxRecList(): void {
    const payload = {}
    this.apiCall.apiPostCall(payload, 'getAllTaxCalculation').subscribe(data => {
      data.data.forEach((element,index) => {
        element.id=index+1;
        
      });
      this.professionalTaxDataSource.data = data.data;
      
    })
  }
  getIncomTaxRecList(): void {
    const payload = {}
    this.apiCall.apiPostCall(payload, 'getAllTaxCalculation').subscribe(data => {
      this.incomeTaxDataSource.data=data.data;
    })
  }
  getDaRecList(): void {
    const payload = {}
    this.apiCall.apiPostCall(payload, 'getAllTaxCalculation').subscribe(data => {
      this.daDataSource.data = data.data;
    })
  }

  goToTaxCrud(id : any){
    this.router.navigate(['/payroll/taxcalculationAdd', id]);
  }

  showTables(tableName : string){
    this.tableName = tableName;
  }

}
