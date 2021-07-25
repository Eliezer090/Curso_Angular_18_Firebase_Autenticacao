import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading: boolean = false;
  subscription: Subscription = new Subscription
  formRegister: FormGroup = this.fb.group({
    'firstname': ['', [Validators.required]],
    'lastname': ['', [Validators.required]],
    'address': ['', []],
    'city': ['', []],
    'state': ['', []],
    'phone': ['', []],
    'mobilephone': ['', []],
    'email': ['', [Validators.required, Validators.email]],
    'password1': ['', [Validators.required]],
    'password2': ['', [Validators.required]],

  }, { validator: this.matchingPass });

  states = ['RJ', "SC", "RS",'SP']

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
  }

  matchingPass(group: FormGroup) {
    if (group) {
      const password1 = group.controls['password1'].value
      const password2 = group.controls['password2'].value
      if (password1 == password2) {
        return null
      }
    }
    return { matching: false };
  }
  onSubmit() {
    const newUser: User = {
      firstname: this.formRegister.value.firstname,
      lastname: this.formRegister.value.lastname,
      address: this.formRegister.value.address,
      city: this.formRegister.value.city,
      state: this.formRegister.value.state,
      phone: this.formRegister.value.phone,
      mobilephone: this.formRegister.value.mobilephone,
      email: this.formRegister.value.email,
      //password: this.formRegister.value.password1,
    }
    this.authService.register(newUser).subscribe(
      (u)=>{
        this.snackBar.open('Usuario registrado com sucesso!','ok',{duration:2000})
        this.router.navigateByUrl('/');
      },(err)=>{
        console.log(err);
        this.snackBar.open('Error: '+err,'ok',{duration:2000})
      }
    )
  }
  loginGoogle() {
    this.loading = true;
    this.subscription = this.authService.loginGoogle().subscribe((u) => {
      this.loading = false;
      this.notification('Register Sucess, welcome ' + u?.firstname);
      this.router.navigateByUrl('/');
    }, (err) => {
      this.loading = false;
      this.notification('Falha ao registrar. Err: ' + err);
    });
  }
  notification(msg: string) {
    this.snackBar.open(msg, 'ok', { duration: 2000 })
  }
}
