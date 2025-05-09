import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage {

  email = '';
  password = '';
  isLoggedIn = false; // logueado por defecto false

  constructor(
    private authService: AuthService, 
    private toastCtrl: ToastController
  ) {}
  
  /**
   *Intenta logear con usuario contraseña validos, lanza mensaje de exito o error con toast
   *
   * @memberof LoginPage
   */
  async login() {
    try {
      await this.authService.login(this.email, this.password);
      //solo se ejecutaran estas lineas si await se ejecuta exitosamente
      this.isLoggedIn = true;
      this.showToast('Login exitoso');
    } catch (error:any) {
      this.showToast('Error: ' + error.message);
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

}
