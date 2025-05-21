import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/userProfile.model';
import { ValidationUtils } from 'src/app/utils/validation';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  userData: UserProfile = {
    uid: '',
    email: '',
    name: '',
    lastName: '',
    dateBirth: '',
    biologicalSex: '',
    weight: 0,
    heigth: 0,
    age: 0,
    levelActivity: ''
  };

  dateError:string= "";
  loading: HTMLIonLoadingElement | null = null;
  currentUser: any | null = null;//para suscribirse a observable authservice

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) 
  { }

  ngOnInit() {
    this.userData = {
      uid: '',
      email: 'juana@example.com',
      name: 'juana',
      levelActivity: 'baja',
      lastName: "",
      dateBirth: "", 
      biologicalSex: "Femenino",
      weight: 60,   // Peso en kg (opcional)
      heigth: 170,  // Altura en cm (opcional)
      age:25 //calculado desde la fecha de nacimiento//aun no implementado
    };
  }

  /**
   *metodo temporal solo muestra por consolo los datos guardados
   *
   * @memberof ProfilePage
   */
  async guardarPerfil() {
    this.dateError = "";

    this.loading = await this.loadingCtrl.create({
        message: 'Guardando datos...',
        cssClass: 'custom-loading'
    });

    await this.loading.present();

    console.log('Perfil guardado:', 
    { 
      nonmbre: this.userData?.name,
      apellido:this.userData?.lastName,
      peso: this.userData?.weight, 
      altura: this.userData?.heigth, 
      sexo: this.userData?.biologicalSex, 
      actividadFisica: this.userData?.levelActivity,
      fechaNacimiento: this.userData?.dateBirth
    });

    this.showToast('Datos guardados!');

    //Ocultar loading después de completar el ""guardado""
    await this.loading.dismiss();
  }
  
  /**
   *obtiene fecha actual formato DD/MM/YY
   *
   * @return {*}  {string}
   * @memberof ProfilePage
   */
  getCustomFormattedDate(): string {
    const fecha = new Date();
    return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);
  }

  validateDate(){
    

    if (!this.userData?.dateBirth) {
      this.dateError = "Ingrese una fecha válida.";
      return;
    }

    if (!ValidationUtils.isValidDate(this.userData.dateBirth)) {
      this.dateError = "Formato inválido. Ejemplo: 15/02/98";
      return;
    }

    this.dateError = "";

  }


  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  //falta:
  ///-metodo calcular edad desde fecha de nacimiento( en utils?)
  //- metodo guardo en firebase,
  //- obtener el user firebase y mostrar el email que es lo que tenemos



}
