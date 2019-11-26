import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [environment.email || '', Validators.required],
      password: [environment.password || '', Validators.required],
    });
  }

  onLoginWithEmail() {
    this.authService
      .loginWithEmail(this.loginForm.value)
      .then(() => this.router.navigate(['/']))
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(err);
      });
  }

  onLoginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .then(() => this.router.navigate(['/']))
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(err);
      });
  }
}
