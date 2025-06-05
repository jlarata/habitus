import { Injectable } from '@angular/core';
//el servicio AngularFireAuth del módulo @angular/fire/compat/auth, que 
// proporciona métodos para la autenticación con Firebase. existe una version mas modular
//solo compatible con standalone
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';//libreria js para implementar rectividad a traves de datos en flujo continuo (Streams).
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import firebase from 'firebase/compat/app';
import { UsersService } from './users.service';




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
  //header para http
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

  //guarda el estado del usuario y lo actualiza en tiempo real
  private userSubject = new BehaviorSubject<firebase.User | null>(null);

  //hace posible acceder al  el user sin poder modificarlo
  private user$: Observable<firebase.User | null> = this.userSubject.asObservable();
  

  constructor(
    private afAuth: AngularFireAuth,
    public http: HttpClient,
    private userService:UsersService

  ) { 

    this.initializeAuthState();

  }

  /**
   * Iniciala suscripción al estado de autenticación.
   * Actualiza `userSubject` cuando el usuario inicia o cierra sesión.
  */

  private initializeAuthState(): void {
    try {

      this.afAuth.authState.subscribe((user: firebase.User | null) => {
      this.userSubject.next(user);
    
    });
      
    } catch (error) {

      console.error('Error al obtener el estado de autenticación:', error)
      
    }
    
  }

  /**
   *Envio de credeciales proporcionadas a firebase para inicio de sesión
   *
   * @param {string} email
   * @param {string} password
   * @return {Promise<any>} promesa
   * @memberof AuthService
  */
  login(email: string, password: string): Promise<any> {
    
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   *devuelve observable del usuario autenticado o null si no hay sesión activa.
   * @returns {Observable<User | null>} 
  */
  getAuthState(): Observable<firebase.User | null> {
    // en Angular y RxJS, colocar $ al final de una variable 
    // observable es buena practica para recordar que se debe suscribirse
    //para ver el valor de la misma
    return this.user$;
  }
  
  /**
   *Ubtiene el usuario firebase desde el BehaviorSubject(algo de rjx)
   *
   * @return {*}  {(firebase.User | null)}
   * @memberof AuthService
   */
  getCurrentUser(): firebase.User | null {
    return this.userSubject.getValue();
  }


  /**
   *Desloguea usuario acual 
   * @return {Promise<any>} promesa
   * @memberof AuthService
   */
  logout(): Promise<any> {
    return this.afAuth.signOut();
  }

  /**
   *Registro por email y contraseña, solo si no hay cuenta asociada al email
   *ademas de registrar, inicia sesión y guarda token en indexDB
   * @param {string} email
   * @param {string} password
   * @return {*} firebase.auth.UserCredential
   * @memberof AuthService
   */
  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  /**
   * Envía un correo electrónico para restablecer la contraseña al usuario.
   * @param email 
   * @returns observable en http
  */
  ///con http
  public resetPassword(email: string) {
    //TODO ESTO ES la versión manual del método que quise crear. no funciona. Si nos queda tiempo lo revisamos.

    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' + `${environment.firebase.apiKey}`;
    //debug: console.log(url)

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
  /**
   * Envía un correo electrónico para restablecer la contraseña al usuario.
   * @param email 
   * @returns promesa o error
  */
  /*public resetPassword(email: string): Promise<void>
  {
    return this.afAuth.sendPasswordResetEmail(email);
  }*/

}
