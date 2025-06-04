import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpoonacularService } from '../../services/spoonacular.service';
import { QueryDeRecetas } from '../../models/recetas';
import { CalculationUtils } from 'src/app/utils/calculations';

@Component({
  selector: 'app-buscador',
  templateUrl: 'buscador.page.html',
  styleUrls: ['buscador.page.scss'],
  standalone: false,
})
export class BuscadorPage {

  @Input() busquedaDesplegada?: boolean;
  @Input() queryDeRecetas?: QueryDeRecetas;
  @Input() recetasFavoritas?: string[];

  public vegetarianIsChecked = false;
  public glutenFreeIsChecked = false;
  public veganIsChecked = false;

  //busquedaDesplegada = false;


  totalResults?: number;
  recetasPagesNumber?: number;
  currentPage = 1;

  //@Output() buttonClicked = new EventEmitter<QueryDeRecetas>();
  @Output() queryDeRecetasChange = new EventEmitter<QueryDeRecetas>();
  @Output() busquedaDesplegadaChange = new EventEmitter<boolean>



  handleClick() {

    this.buscarRecetas();
  }

  constructor(public spoonacular: SpoonacularService,
  ) { }

  buscarRecetas = () => {

    this.spoonacular.obtenerRecetasConInformacion(this.vegetarianIsChecked, this.glutenFreeIsChecked, this.veganIsChecked)
      .subscribe(
        (data) => {
          //console.log(data),
          this.queryDeRecetas = data,
          this.recetasPagesNumber = CalculationUtils.calcularPaginas(this.queryDeRecetas.totalResults!)
          this.busquedaDesplegada = !this.busquedaDesplegada

          console.log(this.queryDeRecetas),
          this.queryDeRecetasChange.emit(this.queryDeRecetas)
        },
        (error) => { console.log(error); }
      )
  }

  /**
  * @function blanquearRecetas limpia la query, el DOM deja de mostrar las cards.
  */
  public blanquearRecetas() {
    this.queryDeRecetas = undefined;
    this.busquedaDesplegada = !this.busquedaDesplegada;
    this.busquedaDesplegadaChange.emit(!this.busquedaDesplegada)
    this.queryDeRecetasChange.emit(this.queryDeRecetas)
  }

  

  buscaFavoritas = (recetasFavoritas: string[]) => {
    //debug: console.log("buscando las siguientes recetas: ", recetasFavoritas)

    this.spoonacular.obtenerVariasRecetasPorID(recetasFavoritas!)
      .subscribe(
        (data: any) => {
          console.log(data)
          if (this.queryDeRecetas == undefined) {
            this.queryDeRecetas = new QueryDeRecetas;
          }
          
          this.queryDeRecetas.number = recetasFavoritas.length,
          this.queryDeRecetas!.offset = 0,
          this.queryDeRecetas!.results = data,
          this.queryDeRecetas!.totalResults = recetasFavoritas.length

          this.recetasPagesNumber = CalculationUtils.calcularPaginas(this.queryDeRecetas!.totalResults!)
          this.busquedaDesplegada = !this.busquedaDesplegada
          this.queryDeRecetasChange.emit(this.queryDeRecetas)
        }
      )
    //debug: console.log(this.queryDeRecetas) 
  }
}



