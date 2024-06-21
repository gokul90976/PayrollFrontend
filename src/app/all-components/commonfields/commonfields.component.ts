import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-commonfields',
  templateUrl: './commonfields.component.html',
  styleUrl: './commonfields.component.css'
})
export class CommonfieldsComponent {

  employeeForm : FormGroup = new FormGroup({})

  constructor(private fb: FormBuilder){}
  ngOnInit() {
    this.employeeForm = this.fb.group({
      v_pf: ['', Validators.required],
      f_bf: [''],
      nh_is: [''],
      s_pf: [''],
      convenience_adv: [''],
      h_ba: [''],
      e_oe: [''],
      water_charges: [''],
      h_rr: [''],
    });
  }

  sumbit_CommonData(){
    
  }

}
