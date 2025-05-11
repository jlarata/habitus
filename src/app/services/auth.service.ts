import { Injectable } from '@angular/core';
 //el servicio AngularFireAuth del módulo @angular/fire/compat/auth, que 
 // proporciona métodos para la autenticación con Firebase.
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

/**
 *
 *Provee la lógica de autenticación con firebase
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  constructor(private afAuth: AngularFireAuth) {}
  /**
   *Envio de credeciales proporcionadas a firebase para inicio de sesión
   *
   * @param {string} email
   * @param {string} password
   * @return {Promise<any>} promesa
   * @memberof AuthService
  */
  login(email: string, password: string):Promise<any> {
    // el método signInWithEmailAndPassword del servicio AngularFireAuth, 
    // envia solicitud a firebase con email y contraseña
    // esto devuelve una promesa --> lo manejamos con asyn await en login.page.ts
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Obtiene el estado de autenticación del usuario.
   * @returns Un Observable con el objeto User si usuario autenticado,
   * o null si no autenticado.
  */
  getUser(): Observable<any | null> { 
    return this.afAuth.authState;
  }
  
  /**
   *Desloguea usuario atcual 
   * @return {Promise<any>} promesa
   * @memberof AuthService
   */
  logout():Promise<any> {
    return this.afAuth.signOut();
  }

}
