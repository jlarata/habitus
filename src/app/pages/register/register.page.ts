import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { ValidationUtils } from 'src/app/utils/validation';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfile } from '../../models/userProfile.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})
export class RegisterPage  {
  email = '';
  password = '';
  repeatPassword = '';
  emailError = '';//captura error de email
  passwordError = '';//captura error de contraseña
  loading : HTMLIonLoadingElement | null = null ;

  constructor(
    private authService: AuthService, 
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  async register() {
    //vaciamos variables de errores anteriores
    this.emailError = '';
    this.passwordError = '';

    if (this.password !== this.repeatPassword) {
      this.showToast('Las contraseñas no coinciden.');
      return;
    }
    
    if (this.isValidForm()) {
      //Mostrar loading antes de llamar a Firebase
      this.loading = await this.loadingCtrl.create({
        message: 'Iniciando Registro...',
        cssClass: 'custom-loading'
      });

      await this.loading.present();

      try {
        //crear usuario
        const userCredential = await this.authService.register(this.email, this.password);
            
        this.showToast('Registro exitoso.');

        //llevar a login
        this.router.navigate(['/login']);

      } catch (error:any) {

        console.log(error.message);
        this.manageErrorFirebase(error);

      }finally{

        //Ocultar loading después de completar el login
        await this.loading.dismiss();

      }
      
    }
    
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

   /**
  *Valida los campos email y contraseña, segun error muestra mensaje a traves de 
  *<p class="error-text" *ngIf="emailError">{{ emailError }}</p> en login.register.html
  *
  * @return {boolean}  {boolean}
  * @memberof LoginPage
  */
  isValidForm():boolean{

    //variable interna para detectar errores
    let isValid = true;

    //Validaciones antes de enviar credenciales
    //email
    if (ValidationUtils.isFieldEmpty(this.email)) {

      this.emailError = 'El email es requerido.';

      isValid = false;

    } else if (!ValidationUtils.isValidEmail(this.email)) {

      this.emailError = 'El email no es válido. Ejemplo: habitus@gmail.com';

      isValid = false;
    }

    //contraseña
    if (ValidationUtils.isFieldEmpty(this.password)) {

      this.passwordError = 'La contraseña es requerida.';

      isValid = false;

    } else if (!ValidationUtils.isPasswordValid(this.password)) {

      this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
      isValid = false;

    }

    return isValid;
  }
  
  /**
   *segun el tipo de objeto error recibido desde firebase
   *muestra por alerta el error correspondiente
   * @param {*} error
   * @memberof LoginPage
   */
  manageErrorFirebase(error: any) {
    // para ver en la consola
    console.error("Error de Firebase:", error); 

    switch (error.code) {
      //inicio sesión
      case 'auth/invalid-credential':
        this.showToast('Usuario o contraseña incorrecto. Inténtalo de nuevo.');
        break;
      //registro
      case 'auth/email-already-in-use':
        this.showToast('Ya existe un usuario asociado con este email.');
        break;

      default:
        //si no es ninguno de los anteriores
        this.showToast('Error al iniciar sesión: ' + error.message); 
    }
  }

  /*metodo front que guardaria datos adicionales del usuario 
  //no funciona
  async saveUserData(uid: string) {
    const birth = new Date(this.dateBirth);
    const age = new Date().getFullYear() - birth.getFullYear();

    const userData: UserProfile = {
      uid,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      dateBirth: this.dateBirth,
      biologicalSex: '',
      age: age
    };

    try {
      await this.authService.saveAditionalDataUser(userData, uid);
      this.showToast('Datos guardados exitosamente.');
    } catch (error: any) {
      this.showToast('Error al guardar los datos de perfil.');
      console.error('Error en Firestore:', error);
    }
  }*/

  


}
