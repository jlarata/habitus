import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false
})
export class ToolbarComponent  implements OnInit {

  currentUser: any | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  //metodos e iportaciones temporales para desloguearse y probar guard
  /**
   *Cierra sesion de usuario actual
   *
   * @memberof LoginPage
   */
  async logout() {
    try {
      await this.authService.logout();
      this.currentUser = null;
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
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  ngOnInit() {
    //no hace falta async/await por que no devuelve promesa
    //nos suscribimos al observable getUser y detectar 
    // si nuestro usuario está logueado
    //si logueado muestra toolbar en un ngif en <ion-toolbar> del html
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  async showConfirmationLogOut() {
      const alert = await this.alertCtrl.create({
        cssClass: 'alert-wrapper', // clase estilo alert
        message: '¿Está seguro que desea cerrar sesión?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondaryalert-button alert-button-cancel',
          },
          {
            text: 'Cerrar sesión',
            cssClass: 'alert-button alert-button-confirm',//estilo boton 
            handler: async () => {
              await this.logout();
            },
          },
        ],
      });
      
    await alert.present();
  }

}
