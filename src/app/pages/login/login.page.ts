import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { ValidationUtils } from 'src/app/utils/validation';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage {

  email = '';
  password = '';
  emailError = '';//captura error de email
  passwordError = '';//captura error de contraseña
  isLoggedIn = false; // logueado por defecto false
  loading : HTMLIonLoadingElement | null = null ;

  constructor(
    private authService: AuthService, 
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}
  
  /**
   *Intenta logear con usuario contraseña validos, lanza mensaje de exito o error con toast
   *
   * @memberof LoginPage
   */
  async login() {
    //vaciamos variables de errores anteriores
    this.emailError = '';
    this.passwordError = '';
    
    //valida campos antes de hacer envio de credenciales a firebase
    if (this.isValidForm()) {
      //Mostrar loading antes de llamar a Firebase
      this.loading = await this.loadingCtrl.create({
        message: 'Iniciando sesión...',
      });

      await this.loading.present();

      try {

        await this.authService.login(this.email, this.password);
        //solo se ejecutaran estas lineas si await se ejecuta exitosamente
        //siguiente paso capturar el usuario logueado para persistir la sesion
        //dar posibilidad de logout
        this.isLoggedIn = true;
        this.showToast('Login exitoso');

      } catch (error: any) {

        this.showToast('Error: ' + error.message);

      }finally{

        //Ocultar loading después de completar el login
        await this.loading.dismiss();

      }
    }
  }

  /**
   *Muestra temporalmente el mensaje ingresado por parametro
   *
   * @param {string} message
   * @memberof LoginPage
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  isValidForm():boolean{

    //variable interna para detectar errores
    let isValid = true;

    //Validaciones antes de enviar credenciales
    //email
    if (ValidationUtils.isFieldEmpty(this.email)) {

      this.emailError = 'El email es requerido.';

      isValid = false;

    } else if (!ValidationUtils.isValidEmail(this.email)) {

      this.emailError = 'El email no es válido.';

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

}


