import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { ValidationUtils } from 'src/app/utils/validation';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

 userData = {
  uid: '',
  email: '',
  name: '',
  lastName: '',
  dateBirth: '',
  biologicalSex:'',
  weight: 0,
  heigth: 0,
  age: 0,
  levelBaja: false,
  levelMedia: false,
  levelAlta: false,
  levelActivity: ''
};


  dateError:string= "";
  loading: HTMLIonLoadingElement | null = null;
  currentUser: any | null = null;//para suscribirse a observable authservice
  emailError: string= "";
  apellidoError: string = '';

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
      lastName: "",
      dateBirth: "", 
      biologicalSex: '',
      weight: 60,   // Peso en kg (opcional)
      heigth: 170,  // Altura en cm (opcional)
      age: 25, //calculado desde la fecha de nacimiento//aun no implementado
      levelBaja: true,
      levelMedia: false,
      levelAlta: false,
      levelActivity: 'baja'
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
      nombre: this.userData?.name,
      apellido:this.userData?.lastName,
      peso: this.userData?.weight, 
      altura: this.userData?.heigth, 
      sexo: this.userData?.biologicalSex || '',
      actividadFisica: this.userData?.levelActivity,
      fechaNacimiento: this.userData?.dateBirth
    });

    this.showToast('Datos guardados!');

    //Ocultar loading después de completar el ""guardado""
    await this.loading.dismiss();
  }
  /**
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

 validateEmail(){
    
    if (!this.userData?.email) {
      this.emailError = "Por favor complete el campo.";
      return;
    }

    if (!ValidationUtils.isValidEmail(this.userData.email)) {
      this.emailError = "Por favor complete el campo con un email válido.";
      return;
    }

    this.emailError = "";

  }

 
  validateApellido() {
    if (!this.userData?.lastName) {
      this.apellidoError = "Por favor complete el campo";
      return;
    }

    if (this.userData.lastName.length < 3) {
      this.apellidoError = "campo vacio.";
      return;
    }

    this.apellidoError = "";
  }

nombreError: string = '';
  validateNombre() {
    if (!this.userData?.name) {
      this.nombreError = "Por favor complete el campo";
      return;
    }

    if (this.userData.name.length < 3) {
      this.nombreError = "Campo Vacío.";
      return;
    }

    this.nombreError = "";
  }


  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  pesos: number[] = Array.from({ length: 121 }, (_, i) => i + 30); // 30 - 150 kg
  alturas: number[] = Array.from({ length: 101 }, (_, i) => i + 100); // 100 - 200 cm

  //falta:
  ///-metodo calcular edad desde fecha de nacimiento( en utils?)
  //- metodo guardo en firebase,
  //- obtener el user firebase y mostrar el email que es lo que tenemos



}
