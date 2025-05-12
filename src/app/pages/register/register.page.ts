import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { ValidationUtils } from 'src/app/utils/validation';
import { User, UserProfile } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})
export class RegisterPage  {

  name = '';
  lastName = '';
  dateBirth = '';
  weight = '';
  height="";
  email = '';
  password = '';
  repeatPassword = '';
  emailError = '';//captura error de email
  passwordError = '';//captura error de contraseña
  nameError = '';//captura error de nombre
  loading : HTMLIonLoadingElement | null = null ;


  constructor(
    private authService: AuthService, 
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
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
      const birth = new Date(this.dateBirth);
      const age = new Date().getFullYear() - birth.getFullYear();

      const userData: UserProfile = {
        uid: '',
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        dateBirth: this.dateBirth,
        biologicalSex: '', 
        age: age
      };
      
      //Mostrar loading antes de llamar a Firebase
      this.loading = await this.loadingCtrl.create({
        message: 'Iniciando sesión...',
      });

      await this.loading.present();

      try {
        await this.authService.register(this.email, this.password);
        this.showToast('Registro exitoso.');
      } catch (error:any) {
        this.showToast('Error en el registro: ' + error.message);
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
      
      default:
        //si no es ninguno de los anteriores
        this.showToast('Error al iniciar sesión: ' + error.message); 
    }
  }

}
