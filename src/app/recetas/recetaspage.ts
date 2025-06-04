import { Component } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';
import { Ingredientes, QueryDeRecetaForDisplay, QueryDeRecetas, Step } from '../models/recetas';
import { UserParaRecetas } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content, ContentImage, Margins, ContentText, ContentUnorderedList, ContentOrderedList } from 'pdfmake/interfaces';


// @ts-ignore
pdfMake.vfs = pdfFonts.vfs; // para evitar problemas con la vercion de pdfmaker


@Component({
  selector: 'app-recetas',
  templateUrl: 'recetas.page.html',
  styleUrls: ['recetas.page.scss'],
  standalone: false,
})


export class RecetasPage {

  queryDeRecetas?: QueryDeRecetas = undefined;

  //para una visualización interactiva de los ingredientes.
  recetaConIngredientes?: number;

  //variables para mostrar las instrucciones de una receta
  isShowingMore: boolean = false;

  queryDeRecetaForDisplay?: QueryDeRecetaForDisplay;
  imagenEnDisplay?: string;
  busquedaDesplegada?: boolean = false;

  userConRecetas: UserParaRecetas = {
    mail: '',
    vegetariano: false,
    vegano: false,
    celiaco: false,
    recetas_favoritas: [],
    calendar_event: {}
  }

  IDReceta: string = '';
  recetasFavoritas: any;

  mostrarAgendarReceta: boolean = false;

  //variables para guardar la información de la receta seleccionada
  recetaSeleccionadaTitulo?: string;
  recetaSeleccionadaImagen?: string;
  recetaSeleccionadaIngredientes?: Ingredientes[];
  recetaSeleccionadaPasos?: Step[];

  constructor(
    public spoonacular: SpoonacularService,
    public usersService: UsersService,
    private auth: AuthService,
    private userService: UsersService,
    private toastCtrl: ToastController
  ) { }


  async ngOnInit() {
    this.userConRecetas = await this.loadUserProfile()
    console.log('el usuario tiene ', this.userConRecetas.recetas_favoritas?.length, ' recetas favoritas.')
    if (this.userConRecetas.recetas_favoritas?.length != 0) {
      this.recetasFavoritas = this.buscarRecetasFavoritas(this.userConRecetas)
    }
  }

  /**
   * @function toggleRecipeSteps un toggle booleano que el DOM usa para mostrar unas instrucciones y ocultar todo lo demás
   * y viceversa
   */
  toggleRecipeSteps = () => {
    this.isShowingMore = !this.isShowingMore
  }

  /**
   * @function onButtonClicked esta funcion está bindeada al subcomponente buscador
   * se entera cuando se hizo click en el botón dentro de ese componente y recibe una variable
   * emitida por ese componente (queryDeRecetas)
   * @param queryDeRecetas
   */
  onButtonClicked(queryDeRecetas: QueryDeRecetas) {
    this.busquedaDesplegada = true;
    this.queryDeRecetas = queryDeRecetas
    //test console.log(queryDeRecetas.totalResults + ' resultados encontrados')

  }

  async loadUserProfile(): Promise<UserParaRecetas> {
    try {
      // Obtener el usuario autenticado desde Firebase
      const userFirebase = this.auth.getCurrentUser();
      //obtener los datos de firestore usando el usuario de firebase
      const user = await this.userService.obtenerPerfilUsuario(userFirebase!.email!);

      //construyo un profile con los datos y lo devuelvo
      // btw creo que este paso es al pedo. podiamos retornar el user

      let userConRecetas = {
        mail: user?.mail,
        vegetariano: user?.vegetariano,
        celiaco: user?.celiaco,
        vegano: user?.vegano,
        recetas_favoritas: user?.recetas_favoritas,
        calendar_event: user?.calendar_event
      };

      return userConRecetas!

    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      this.showToast("Error al obtener los datos del usuario: " + error);

      return this.userConRecetas
    }
  }

  buscarRecetasFavoritas = (userConRecetas: UserParaRecetas) => {

    let recetas: any = []

    for (let i = 0; i < userConRecetas.recetas_favoritas!.length; i++) {
      console.log('buscando receta ID N° ', userConRecetas.recetas_favoritas![i])
      this.spoonacular.obtenerRecetaSimplePorID(userConRecetas.recetas_favoritas![i])
        .subscribe(
          (data: any) => {
            recetas.push(data)
          },
          (error) => { console.log(error); }
        )
    }

    console.log('resultado final: ', recetas)
    return recetas
  }


  /**
   * @function buscarPorId pide al servicio que le pegue de nuevo a la API esta vez con información
   * detallada específica para la receta en cuestión
   * @param id la id de la receta (el dom la conoce desde la primera query)
   * @param image como esta nueva query por id no incluye imagen, el DOM se la manda así se puede
   * usar en la card que se despliega.
   */
  buscarPorId = (id: number, image: string) => {
    this.imagenEnDisplay = image;
    this.spoonacular.obtenerRecetaPasoAPasoPorID(id.toString())
      .subscribe(
        (data: any) => {
          this.queryDeRecetaForDisplay = data[0]!;
          //console.log(data)
          this.isShowingMore = !this.isShowingMore;

        },
        (error) => { console.log(error); }
      )
  }


  /**
   * @function muestraIngredientes cambia una variable para que el DOM renderice una ventana
   * @param receta es un INDEX de la lista de recetas de la query. el DOM sabe cual es y lo envía
  */
  muestraIngredientes = (receta: number) => {
    this.recetaConIngredientes = receta
  }

  ocultaIngredientes = () => {
    this.recetaConIngredientes = undefined;
  }

  /**
  * @function blanquearRecetas limpia la query, el DOM deja de mostrar las cards.
  */
  public blanquearRecetas() {
    this.queryDeRecetas = undefined;
    this.busquedaDesplegada = !this.busquedaDesplegada;
  }

  /**
  *mostrar alerta dtos guardados o error
  *
  * @param {string} message
  */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  //bueno recibo el id como number pero lo convierto a string
  //por que el array de favoritos es tipo string
  async agregarARecetasFavoritas(recetaID: number) {

    // validar si receta ya está en favoritos
    let idReceta:string = recetaID.toString();

    if (this.userConRecetas.recetas_favoritas!.includes(idReceta)) {
      this.showToast("La receta ya está en favoritos.");
      return;
    }

     this.userConRecetas.recetas_favoritas!.push(idReceta);

    //guardamos en firestore
    try {

      let idsRecetas  = {
        recetas_favoritas: this.userConRecetas.recetas_favoritas
      }

      await this.userService.actualizarUsuario(this.userConRecetas.mail!, idsRecetas);

      this.showToast("Receta agregada a favoritos.");
      console.log("recetas favoritas actualizadas:", this.userConRecetas.recetas_favoritas);

      //actualizar en memoria
      this.recetasFavoritas = this.buscarRecetasFavoritas(this.userConRecetas)

    } catch (error) {
      console.error("Error al guardar favoritos:", error);

      this.showToast("Error al agregar la receta a favoritos.");
    }
  }

  async eliminarDeRecetasFavoritas(recetaID: number) {

    // validar si receta ya está en favoritos
    let idReceta:string = recetaID.toString();

    // valido por si no se esta guardando en firestore
    if (!this.userConRecetas.recetas_favoritas!.includes(idReceta)) {
      this.showToast("Esta receta no está en favoritos.");
      return;
    }

    // filtramos y guardamos todas los IDs de recetas menos la que vamos a eliminar
    this.userConRecetas.recetas_favoritas = this.userConRecetas.recetas_favoritas!.filter(id => id !== idReceta);

    //guardamos en firestore
    try {
      let idsRecetas  = {
        recetas_favoritas: this.userConRecetas.recetas_favoritas
      }

      await this.userService.actualizarUsuario(this.userConRecetas.mail!, idsRecetas);

      this.showToast("Receta eliminada de favoritos.");
      console.log("recetas favoritas actualizadas:", this.userConRecetas.recetas_favoritas);

      //actualizar en memoria
      this.recetasFavoritas = this.buscarRecetasFavoritas(this.userConRecetas)

    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);

      this.showToast("Error al eliminar la receta de favoritos.");
    }

  }

  ///agendar la receta
  //por ahora solo guarda favoritos-- ni eso tengo que pensar como pasarle lo que necesita
  //para agendar la receta como evento
  async agendarReceta() {

    //this.agregarARecetasFavoritas(recetaID);

  }


  async cargarDetallesReceta(
    id: number,
    titulo: string,
    ingredientes: Ingredientes[]
  ) {
    this.showToast(`Cargando detalles de ${titulo} y generando PDF...`);

    // guardar el titulo en una variable
    this.recetaSeleccionadaTitulo = titulo;
    //guardar los ingredientes en una variable
    this.recetaSeleccionadaIngredientes = ingredientes;

    let pasosReceta: Step[] = [];

    try {
      // llama a la api con el id para obtener el paso a paso
      const data: any = await this.spoonacular.obtenerRecetaPasoAPasoPorID(id.toString()).toPromise();

      // la api de a veces devuelve un array con un solo objeto que contiene steps
      if (data && data.length > 0 && data[0].steps) {
        pasosReceta = data[0].steps;
        this.recetaSeleccionadaPasos = pasosReceta; // guardo el paso a paso
      } else {
        this.showToast('No se encontraron pasos detallados para esta receta.');
        console.warn('Respuesta de la API para pasos no tiene el formato esperado:', data);
      }
      // genera el pdf
      this.generarPdf(titulo, ingredientes, pasosReceta);

      //this.isShowingMore = true;

    } catch (error) {
      console.error('Error al obtener el paso a paso o generar PDF:', error);
      this.showToast('Error al cargar las instrucciones o generar el PDF de la receta.');
    }
  }

  async generarPdf(
    titulo: string,
    ingredientes: Ingredientes[],
    pasos: Step[]
  ) {
    // formato para los ingredientes
    const ingredientesContent = ingredientes.map(ing => `• ${ing.original}`);

    // formato para el paso a paso
    const pasosContent = pasos.map(step => `${step.number}. ${step.step}`);

const docDefinition: TDocumentDefinitions = {
  content: [
    { text: titulo, style: 'header' } as ContentText,
    { text: 'Ingredientes:', style: 'subheader', margin: [0, 10, 0, 5] } as ContentText,
    { ul: ingredientesContent } as ContentUnorderedList,
    { text: 'Instrucciones:', style: 'subheader', margin: [0, 15, 0, 5] } as ContentText,
    { ol: pasosContent } as ContentOrderedList
  ],
  styles: {
    header: {
      fontSize: 24,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 18,
      bold: true,
      margin: [0, 10, 0, 5]
    },

  }
};

    // crea elpdf y lo descarga

    pdfMake.createPdf(docDefinition).download(`${titulo.replace(/ /g, '_')}_receta.pdf`);

    this.showToast('PDF generado y descargado!');
  }



}



