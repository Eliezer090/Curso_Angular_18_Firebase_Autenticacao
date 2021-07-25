import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound/notfound.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main/people' },
  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule), canActivate: [AuthGuardService] },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
