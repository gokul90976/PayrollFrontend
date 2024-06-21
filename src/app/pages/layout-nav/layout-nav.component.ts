import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-layout-nav',
  templateUrl: './layout-nav.component.html',
  styleUrl: './layout-nav.component.css'
})
export class LayoutNavComponent {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  role: string;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private router:Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.role = sessionStorage.getItem('userName')
    

    if(this.role == 'DA'){
      this.router.navigate(['/payroll/employeepayroll/']);
    }else if(this.role == 'AO'){
      this.router.navigate(['/payroll/monthlysalary/']);
    }else if(this.role == 'DCAO'){
      this.router.navigate(['/payroll/monthlysalary/']);
    }else{
      this.router.navigate(['/payroll/monthlysalary/']);
    }

  }

  logout() {
    sessionStorage.clear();
    sessionStorage.clear()
    this.router.navigate(['/login']);

  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
