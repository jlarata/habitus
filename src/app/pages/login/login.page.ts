import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ValidationUtils } from 'src/app/utils/validation';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  email = '';
  password = '';
  emailError = '';//captura error de email
  passwordError = '';//captura error de contraseña
  isLoggedIn = false; // deslogueado por defecto false
  loading: HTMLIonLoadingElement | null = null;
  currentUser: any | null = null;

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }


  /**
   * Se eecuta primero cuado se inicializa componente. 
   * Verifica si hay usuario activo y cambia estado de logeo.
   *
   * - Si hay un usuario activo, lo asigna a `currentUser` y marca `isLoggedIn = true`.
   * - Si no hay sesión iniciada, muestra form de inicio de sesion.
   *
   * @memberof LoginPage
  */
  ngOnInit() {
    //no hace falta async/await por que no devuelve promesa
    //nos suscribimos al observable getUser y detectar si nuestro usuario sigue logueado
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;

        // si user autenticado llevar a tabs
        this.router.navigate(['/tabs']);

      }
    });
  }

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
        cssClass: 'custom-loading'
      });

      await this.loading.present();

      try {

        let userCredentials = await this.authService.login(this.email, this.password);
        //solo se ejecutaran estas lineas si await se ejecuta exitosamente

        //para ver en consola
        console.log(userCredentials);

        //capturar el objeto usuario logueado
        //para en login.page.html mostrar email en bienvenida
        this.currentUser = userCredentials.user;

        //para ver en consola
        console.log(this.currentUser);

        this.isLoggedIn = true;

        this.showToast('Login exitoso');

        //limpiar campos
        this.email = '';
        this.password = '';

      } catch (error: any) {

        this.manageErrorFirebase(error);

      } finally {

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


  /**
  *Valida los campos email y contraseña, segun error muestra mensaje a traves de 
  *<p class="error-text" *ngIf="emailError">{{ emailError }}</p> en login.page.html
  *
  * @return {*}  {boolean}
  * @memberof LoginPage
  */
  isValidForm(): boolean {

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
      default:
        //si no es ninguno de los anteriores
        this.showToast('Error al iniciar sesión: ' + error.message);
    }
  }

  /**
   *Cierra sesion de usuario actual y dirige a login
   *
   * @memberof LoginPage
   */
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      //logeado false
      this.isLoggedIn = false;
      //limpiar variable que contiene al usuario actual
      this.currentUser = null;
      this.showToast('Sesión Finalizada. Hasta pronto!');

    } catch (error: any) {
      this.showToast('Error al cerrar sesión: ' + error.message);
    }
  }
  
  /**
   *abre un alert que solicita se ingrese correo 
   para recuperar contraseña con metodo de Firebase
   *
   * @memberof LoginPage
   */
  async resetPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperacíon de contraseña',
      cssClass: 'alert-wrapper', // clase estilo alert
      message: 'Ingresa tu correo electrónico:',
      inputs: [
        {
          //cssClass: 'alert-input',
          name: 'email',
          type: 'email',
          placeholder: 'Tu correo electrónico',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Enviar',
          
          handler: async (alertData) => {
            this.email = alertData.email;
            if (!this.email) {
              this.showToast('Por favor, ingresa tu correo electrónico.');
              return false;//para que no me cierre el cuadro de dialogo
            }
            if (!ValidationUtils.isValidEmail(this.email)) {
              this.showToast('Por favor, ingresa un correo electrónico válido.');
              return false;
            }

            const loading = await this.loadingCtrl.create({
              message: 'Enviando correo de recuperación...',
            });
            await loading.present();
            try {
              await this.authService.resetPassword(this.email);
              this.showToast(
                'Se envió un correo electrónico para restablecer tu contraseña.'
              );
              this.email = ''; // Limpiar el campo después del eenvio
              return true;
            } catch (error: any) {
              this.showToast(
                'Error al enviar correo de recuperación: ' + error.message
              );
              return false;
            } finally {
              await loading.dismiss();
            }
          },
        },
      ],
    });
    await alert.present();
  }

}


