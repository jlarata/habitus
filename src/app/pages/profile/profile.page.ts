import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
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
  
  loading: HTMLIonLoadingElement | null = null;

  dateError:string= "";
  emailError: string= "";
  nombreError: string = '';
  
  //array tipo nuber 121 elementos genera valores de 30 hasta 150
  pesos: number[] = Array.from({ length: 121 }, (_, i) => i + 30); // 30 - 150 kg
  //array tipo nuber 121 elementos genera valores de 100  hasta 200
  alturas: number[] = Array.from({ length: 101 }, (_, i) => i + 100); // 100 - 200 cm



  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private auth:AuthService,
    private userService:UsersService
  ) 
  { }

  ngOnInit() {
    
   this.loadUserProfile();
    
  }

  /**
   *metodo temporal solo muestra por consola los datos guardados
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

  //elimine validaciones apellido para que sea opcional
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

  /**
   *mostrar alerta dtos guardados o error 
   *
   * @param {string} message
   * @memberof ProfilePage
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

 

  //falta:
  ///-metodo calcular edad desde fecha de nacimiento( en utils?)//falta campo edad readonly
  //- metodo guardo en firebase,
    
  /**
  *recupera apartir del email los datos de usuario
  *almacenados en firestore
  *usado en oninit de esta clase
  * @return {*} 
  * @memberof ProfilePage
  */
  async loadUserProfile() {
    try {
      // Obtener el usuario autenticado desde Firebase
      const userFirebase = this.auth.getCurrentUser();

      if (!userFirebase?.email) {
        this.showToast("No hay usuario autenticado o no tiene un email válido.");
        console.error("No hay usuario autenticado o no tiene un email válido.");
        return;
      }

      // Obtener los datos desde Firestore directamente
      const user = await this.userService.obtenerPerfilUsuario(userFirebase.email);

      if (!user) {
        console.error("No se encontró perfil de usuario en Firestore.");
        this.showToast("No se encontró perfil de usuario en Firestore.");
        return;
      }

      // Asignar los datos obtenidos al objeto userData
      this.userData = {
        uid: user.uid || "",
        email: user.email || "",
        name: user.name ||"",
        lastName: user.lastName || "",
        dateBirth: user.dateBirth || "", 
        biologicalSex:user.biologicalSex || '',
        weight: user.weight || 0,   // Peso en kg (opcional)
        heigth: user.heigth || 0,  // Altura en cm (opcional)
        age: user.age || 0, //calculado desde la fecha de nacimiento//aun no implementado
        levelBaja: true,
        levelMedia: false,
        levelAlta: false,
        levelActivity: user.levelActivity || "Baja"
      };

      console.log("Datos del usuario cargados:", this.userData);

    } catch (error) {

      console.error("Error al obtener los datos del usuario:", error);

      this.showToast("Error al obtener los datos del usuario: " + error);
    }
  }

}
