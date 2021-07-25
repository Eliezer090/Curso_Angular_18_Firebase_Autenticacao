import { AuthService } from './auth/auth.service';
import { User } from './auth/user';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fireauth';

  constructor(
    private AuthService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,

  ) {
    this.user$ = this.AuthService.getUser();
    this.authenticated$ = this.AuthService.authenticated();
  }

  user$: Observable<User | null | undefined> = new Observable;
  authenticated$: Observable<boolean> = new Observable;
  loading: boolean = false

  logout() {
    this.loading = true
    this.AuthService.logout();

    this.snackBar.open('Logout em andamento!', 'ok', { duration: 2000 })
    setTimeout(() => {
      this.loading = false;
      this.router.navigateByUrl('/auth/login');
    }, 2000);
  }
}
