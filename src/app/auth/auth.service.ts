import { from, Observable, of, throwError } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import firebase from 'firebase/app';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<User> = this.afs.collection('users');

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
  }

  register(user: User): Observable<boolean> {
    return from(this.afAuth.createUserWithEmailAndPassword(user.email, user.password!)).pipe(
      switchMap((u: firebase.auth.UserCredential) => {
        return this.userCollection.doc(u.user?.uid).set({ ...user, id: u.user?.uid }).then(() => true)
      }), catchError((err) => throwError(err))
    )
  }
  login(email: string, password: string): Observable<User | undefined> {

    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((u: firebase.auth.UserCredential) => {
        return this.userCollection.doc<User>(u.user?.uid).valueChanges()
      })
      , catchError((err) => {
        switch (err.code) {
          case 'permission-denied':
            return throwError('');
            break;

          default:
            return throwError('Ivalid credential, or user not registered.')
            break;
        }
      })
    )
  }


  logout() {
    this.afAuth.signOut().then(() => {
    })

  }

  getUser(): Observable<User | null | undefined> {
    return this.afAuth.authState.pipe(
      switchMap(u => (u) ? this.userCollection.doc<User>(u.uid).valueChanges() : of(null))
    )
  }

  authenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(u => (u) ? true : false)
    )
  }
/**
 * Funciona tambem mas tem muita callback.
 */
  oldloginGoogle(): Observable<User | null> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      tap((data) => console.log(data)),
      switchMap((u: firebase.auth.UserCredential) => {
        const newUser: User = {
          firstname: u.user?.displayName!,
          lastname: '',
          address: '',
          city: '',
          state: '',
          phone: '',
          mobilephone: '',
          email: u.user?.email!,
          id: u.user?.uid
        }
        return this.userCollection.doc(u.user?.uid).set(newUser).then(() => newUser);
      })
    );
  }
  /**
   * versão sem callbackrell
   */
  loginGoogle(): Observable<User | null> {
    return from(this.loginWitchGoogle());
  }

  async loginWitchGoogle(){
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      let credentials: firebase.auth.UserCredential = await this.afAuth.signInWithPopup(provider);
      let user: User = await this.updateUserData(credentials);
      return user;

    } catch (error) {
      throw new Error(error);

    }
  }

  async updateUserData(u: firebase.auth.UserCredential){
    try {
      const newUser: User = {
        firstname: u.user?.displayName!,
        lastname: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        mobilephone: '',
        email: u.user?.email!,
        id: u.user?.uid
      };
      await this.userCollection.doc(u.user?.uid).set(newUser);
      return newUser;
    } catch (error) {
      throw new Error(error);

    }
  }

}
