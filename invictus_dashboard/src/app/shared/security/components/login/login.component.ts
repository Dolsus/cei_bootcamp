import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { AppUser } from '../../app-user';
import { AppUserAuth } from '../../app-user-auth';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'dash-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  securityObj?: AppUserAuth = null;
  formErrMsg: string = '';
  errMsg: { [key: string]: string } = {};
  loginFormControls: string[] = [];
  user: AppUser = new AppUser();
  returnUrl: string;

  get currentUsername(): string {
    return this.loginForm.get('username').value;
  }

  private validationMsgs = {
    required: 'This field is required.',
    range: 'Please enter a password between 8 and 20 characters long.',
  };

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildLoginForm();
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.addGroupValueChangeSubscriptions(this.loginForm);
  }

  addGroupValueChangeSubscriptions(
    group: FormGroup,
    arrayLength?: number
  ): void {
    var controlAppend: string = '';
    if (arrayLength) {
      controlAppend = arrayLength.toString();
    }

    for (let i in group.controls) {
      const validation = group.get(i);
      this.errMsg[i] = '';
      const control = i + controlAppend;
      this.loginFormControls.push(control);
      validation?.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
        this.setMsg(validation, control);
      });
    }
  }

  setMsg(c: AbstractControl, control: string): void {
    this.errMsg[control] = '';
    if ((c.touched || c.dirty) && c.errors) {
      // console.log(`Error for ${control}: ${Object.keys(c.errors)}`);

      this.errMsg[control] = Object.keys(c.errors)
        .map(
          (key) => this.validationMsgs[key as keyof typeof this.validationMsgs]
        )
        .join(' ');
    }
  }

  checkAllValidation(): void {
    for (let control in this.loginFormControls) {
      const validation = this.loginForm.get(this.loginFormControls[control]);
      if (validation) {
        validation.markAsTouched();
        validation.updateValueAndValidity();
      }
    }
  }

  login(): void {
    this.securityService.clearSecurityObj();
    this.securityService.getUsers().subscribe({
      next: (users) => {
        var user: AppUserAuth = users.find(
          (data) =>
            data.userName.toLowerCase() === this.currentUsername.toLowerCase()
        );

        if (user) {
          this.securityObj = { ...this.securityObj, ...user };
          if (this.user.password == user.password) {
            this.securityService.securityObj = {
              ...this.securityService.securityObj,
              ...this.securityObj,
            };
            localStorage.setItem('bearerToken', this.securityObj.bearerToken);
            if (this.returnUrl) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.securityObj.isAuthenticated = false;
          }
        }
      },
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      if (this.loginForm.dirty) {
        this.user.userName = this.loginForm.get('username').value;
        this.user.password = this.loginForm.get('password').value;

        this.login();
      }
    } else {
      this.formErrMsg = 'Please correct the validation errors.';
      this.checkAllValidation();
    }
  }
}
