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

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.isLoggedIn = true;
      this.showToast('Login exitoso');
    } catch (error:any) {
      this.showToast('Error: ' + error.message);
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


}
