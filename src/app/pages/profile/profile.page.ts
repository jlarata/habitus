import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { ValidationUtils } from 'src/app/utils/validation';
import { EventDay } from "./calendar.model";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  usuario: User = {
    UID: '',
    nombre: '',
    apellido: '',
    calendar_event: {},
    celiaco: false,
    fecha_de_nacimiento: '',
    sexo: '',
    mail: '',
    vegano: false,
    vegetariano: false,
    peso: 0,
    altura: 0,
    edad: 0,
    hace_actividad_fisica_regular: '',
    recetas_favoritas: [],
    events_array: EventDay[]
  }

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
    private userService:UsersService,
  ) 
  {}

  async ngOnInit() {
   this.usuario = await this.loadUserProfile();
   console.log("Datos del usuario cargados:", this.usuario);
  }


  async guardarPerfil() {

    // validar fecha y calcular edad
    this.validateDate();

    if (this.dateError) { // si error en fecha, detener guardado
      this.showToast("Corrige la fecha antes de guardar.");
      return;
    }

    this.loading = await this.loadingCtrl.create({
        message: 'Guardando datos...',
        cssClass: 'custom-loading'
    });

    await this.loading.present();

    const nueva_data_de_usuario = {
      nombre: this.usuario?.nombre,
      apellido:this.usuario?.apellido,
      peso: this.usuario?.peso, 
      altura: this.usuario?.altura, 
      sexo: this.usuario?.sexo || '',
      hace_actividad_fisica_regular: this.usuario?.hace_actividad_fisica_regular,
    }

    console.log('Perfil guardado:', 
    nueva_data_de_usuario);

    this.userService.actualizarUsuario(this.usuario.mail!, nueva_data_de_usuario)
    console.log("datos guardados!: " + user);
    this.showToast('Datos guardados!');
    
    //Ocultar loading después de completar el ""guardado""
    await this.loading.dismiss();
  }
 
  validateDate(){

    if (!this.usuario?.fecha_de_nacimiento) {
      //no lanzo error por que no es obligatoria la fecha
      this.usuario.fecha_de_nacimiento = "";
      return;
    }

    if (!ValidationUtils.isValidDate(this.usuario.fecha_de_nacimiento)) {
      this.dateError = "Formato o fecha inválida. Ejemplo: 15/02/1998";
      return;
    }

    //si esta todo ok calculamos edad
    this.usuario.edad = ValidationUtils.calculateAge(this.usuario.nueva_data_de_usuario);

    this.dateError = "";

  }

  //elimine validaciones apellido para que sea opcional
  validateNombre() {
    if (!this.usuario?.nombre) {
      this.nombreError = "Por favor complete el campo";
      return;
    }

    if (this.usuario.nombre.length < 3) {
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

  /**
  *recupera apartir del email los datos de usuario
  *almacenados en firestore
  *usado en oninit de esta clase
  * @return {*} 
  * @memberof ProfilePage
  */
  async loadUserProfile():Promise<User> {
    try {
      // Obtener el usuario autenticado desde Firebase
      const userFirebase = this.auth.getCurrentUser();
      //obtener los datos de firestore usando el usuario de firebase
      const user = await this.userService.obtenerPerfilUsuario(userFirebase!.email!);

      //construyo un profile con los datos y lo devuelvo
      // btw creo que este paso es al pedo. podiamos retornar el user
      
      let currentProfile = {
        UID: user?.UID || "",
        mail: user?.mail || "",
        vegetariano: user?.vegetariano,
        nombre: user?.nombre ||"",
        apellido: user?.apellido || "",
        fecha_de_nacimiento: user?.fecha_de_nacimiento || undefined, 
        sexo:user?.sexo || '',
        celiaco: user?.celiaco,
        vegano: user?.vegano,
        peso: user?.peso || 0,
        //weight: user?.weight || 0,   // Peso en kg (opcional)
        altura: user?.altura || 0,  // Altura en cm (opcional)
        edad: user?.edad || 0, //calculado desde la fecha de nacimiento//aun no implementado
        hace_actividad_fisica_regular: user?.hace_actividad_fisica_regular,
        recetas_favoritas: user?.recetas_favoritas,
        calendar_event: user?.calendar_event
      };

      console.log('usuario cargado en el método: ',currentProfile)
      return currentProfile!

    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      this.showToast("Error al obtener los datos del usuario: " + error);
      
      return this.usuario
    }
  }

}
