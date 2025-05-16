import { Injectable } from '@angular/core';
//el servicio AngularFireAuth del módulo @angular/fire/compat/auth, que 
// proporciona métodos para la autenticación con Firebase. existe una version mas modular
//solo compatible con standalone
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserProfile } from '../models/userProfile.model';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';


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

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    public http: HttpClient,
  ) { }
  /**
   *Envio de credeciales proporcionadas a firebase para inicio de sesión
   *
   * @param {string} email
   * @param {string} password
   * @return {Promise<any>} promesa
   * @memberof AuthService
  */
  login(email: string, password: string): Promise<any> {
    // el método signInWithEmailAndPassword del servicio AngularFireAuth, 
    // envia solicitud a firebase con email y contraseña
    // esto devuelve una promesa --> lo manejamos con async await en login.page.ts
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
  logout(): Promise<any> {
    return this.afAuth.signOut();
  }

  /**
   *Registro por email y contraseña, solo si no hay cuenta asociada al email
   *
   * @param {string} email
   * @param {string} password
   * @return {*} firebase.auth.UserCredential
   * @memberof AuthService
   */
  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  /**
   *Escribe un documento con datos adicionales del usuario 
   *en el documento 'user', lo asocia al usuario por el uid
   *si no existe el documento lo crea
   * @param {UserProfile} userData
   * @param {string} uid
   * @return {*}  {Promise<void>}
   * @memberof AuthService
   */
  saveAditionalDataUser(userData: UserProfile, uid: string): Promise<void> {
    //le indicamos colleccion y user id para asociar la info
    console.log('Enviando a Firestore:', userData, 'con uid:', uid);
    return this.firestore.collection('users').doc(uid).set(userData)
    //retornamos la promesa

  }

  /**
   * Envía un correo electrónico para restablecer la contraseña al usuario.
   * @param email 
   * @returns promesa o error
   */

  ///con http
  public resetPassword(email: string) {
    //TODO ESTO ES la versión manual del método que quise crear. no funciona. Si nos queda tiempo lo revisamos.

    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' + `${environment.firebase.apiKey}`;
    console.log(url)

    //cuerpo de la peticion
    const body = {
      requestType: "PASSWORD_RESET",
      email: email
    };
    
    //peticion con url, cuerpo, headers
    const request = this.http.post(url, body, { headers: this.headers });

    return request;
    
  }

  //con metodo de firebase
  /*public resetPassword(email: string): Promise<void>
  {
    return this.afAuth.sendPasswordResetEmail(email);
  }*/

}
