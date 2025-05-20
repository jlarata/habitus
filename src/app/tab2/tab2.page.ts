import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  /* VER tab2.page.html
  
  currentUser: any | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController) {
      this.currentUser = authService.getAuthState();
    }

  //metodos e iportaciones temporales para desloguearse y probar guard
  /**
   *Cierra sesion de usuario actual
   *
   * @memberof LoginPage
   * /
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login');
      this.showToast('Sesión Finalizada. Hasta pronto!');

    } catch (error: any) {
      this.showToast('Error al cerrar sesión: ' + error.message);
    }
  }

  /**
   *Muestra temporalmente el mensaje ingresado por parametro
   *
   * @param {string} message
   * @memberof LoginPage
   * /
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  } */
  constructor() {

  }
}
