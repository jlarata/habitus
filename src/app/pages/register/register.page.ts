import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { ValidationUtils } from 'src/app/utils/validation';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})
export class RegisterPage  {
  mail = '';
  password = '';
  repeatPassword = '';
  emailError = '';//captura error de email
  passwordError = '';//captura error de contraseña
  loading : HTMLIonLoadingElement | null = null ;

  constructor(
    private authService: AuthService, 
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private userService:UsersService

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
        const userCredential = await this.authService.register(this.mail, this.password);
        ///obtener uid 
        let uid = userCredential.user.uid;
        let mail = userCredential.user.mail;
        //log prueba
        console.log("UID:", uid);
        console.log("mail:", mail);
        
        ///envio data adicional a firebase
        this.userService.crearDataUsuario(mail//,uid          
        );


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
    if (ValidationUtils.isFieldEmpty(this.mail)) {


      this.emailError = 'El email es requerido.';

      isValid = false;

    } else if (!ValidationUtils.isValidEmail(this.mail)) {


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




}
