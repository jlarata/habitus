import { Component } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';
import { QueryDeRecetaForDisplay, QueryDeRecetas } from '../models/recetas';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-recetas',
  templateUrl: 'recetas.page.html',
  styleUrls: ['recetas.page.scss'],
  standalone: false,
})



export class RecetasPage {

  queryDeRecetas? : QueryDeRecetas = undefined;

  //para una visualización interactiva de los ingredientes.
  recetaConIngredientes?: number;

  //variables para mostrar las instrucciones de una receta
  isShowingMore: boolean = false;
  queryDeRecetaForDisplay?: QueryDeRecetaForDisplay;
  imagenEnDisplay?: string;

  busquedaDesplegada?: boolean = false;

  constructor(
    public spoonacular: SpoonacularService,
    public usersService: UsersService
    ) { }


  ngOnInit() {
    // esto era para probar nomás this.usersService.obtenerUsuarios();
    //de todos modos aquí irá un llamado al usuario para desplegar recetas favoritas etc.
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

}


