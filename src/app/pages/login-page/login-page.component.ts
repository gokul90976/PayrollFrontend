import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ROUTER_CONFIGURATION, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SnackbarComponent } from '../../shared-module/snackbar/snackbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  hide = true;
  loginForm!: FormGroup
  role: string;

  constructor(private fb: FormBuilder, private apiCall: ApiService, private router: Router, public dialog: MatDialog, private snackbar: MatSnackBar, private toastr: ToastrService) {
    this.role = sessionStorage.getItem('username')
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      const username = this.loginForm.controls['username'].value;
      const password = this.loginForm.controls['password'].value;

      console.log(username.toUpperCase())
      const payload = {
        "username": username,
        "password":password
      }
      this.apiCall.apiPostCall(payload, 'api/auth/signIn').subscribe((data:any) => {
        console.log(data)
        if (data.responseStatus) {
          this.toastr.success("Login Successfully");
          sessionStorage.setItem('userName', data.responseObject.jwtResponse.role)
          sessionStorage.setItem('authToken', data.responseObject.jwtResponse.token)
          sessionStorage.setItem('userName', data.responseObject.jwtResponse.role)
          sessionStorage.setItem('authToken', data.responseObject.jwtResponse.token)
          this.router.navigate(['/payroll/employeepayroll']);
        } else {
          this.toastr.error("Submit is Unsuccessful");
        }
      })
    }
  }
}
