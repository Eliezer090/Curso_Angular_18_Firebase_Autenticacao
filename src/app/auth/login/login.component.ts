import { User } from './../user';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required]]
  })
  loading: boolean = false;
  subscription: Subscription = new Subscription
  constructor(private fb: FormBuilder, private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
  }

  loginGoogle() {
    this.loading = true;
    this.subscription = this.authService.loginGoogle().subscribe((u) => {
      this.loading = false;
      this.notification('Loggin Sucess, welcome ' + u?.firstname);
      this.router.navigateByUrl('/');
    }, (err) => {
      this.loading = false;
      this.notification('Falha no loggin. Err: ' + err);
    });
  }

  onSubmit() {
    if (this.loginForm.value.email !== '' && this.loginForm.value.password != '') {
      this.loading = true;
      console.log(this.loginForm.value.email);
      this.subscription = this.authService.login(this.loginForm.value.email, this.loginForm.value.password).
        subscribe(
          (u) => {
            this.loading = false;
            this.notification('Loggin Sucess, welcome ' + u?.firstname);
            this.router.navigateByUrl('/');
          }, (err) => {
            this.loading = false;
            if(err.trim() !== ''){
              this.notification('Falha no loggin. Err: ' + err);
            }
          }
        )

    }
  }
  notification(msg: string) {
    this.snackBar.open(msg, 'ok', { duration: 2000 })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
