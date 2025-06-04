import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpoonacularService } from '../../services/spoonacular.service';
import { QueryDeRecetas } from '../../models/recetas';


@Component({
  selector: 'app-buscador',
  templateUrl: 'buscador.page.html',
  styleUrls: ['buscador.page.scss'],
  standalone: false,
})
export class BuscadorPage {

  @Input() busquedaDesplegada?: boolean;
  @Input() queryDeRecetas?: QueryDeRecetas;

  public vegetarianIsChecked = false;
  public glutenFreeIsChecked = false;
  public veganIsChecked = false;
  
  //busquedaDesplegada = false;


  totalResults?: number;
  recetasPerPage = 10;
  recetasPagesNumber?: number;
  currentPage = 1;

  //@Output() buttonClicked = new EventEmitter<QueryDeRecetas>();
  @Output() queryDeRecetasChange = new EventEmitter<QueryDeRecetas>();
  @Output() busquedaDesplegadaChange = new EventEmitter<boolean>



  handleClick() {

    this.buscarRecetas();
  }

  constructor(public spoonacular: SpoonacularService) { }
  ngOnInit() {
    //le saco lo automático al método / this.ionViewDidLoad()
  }

  //private ionViewDidLoad() {
  buscarRecetas = () => {

    this.spoonacular.obtenerRecetasConInformacion(this.vegetarianIsChecked, this.glutenFreeIsChecked, this.veganIsChecked)
      .subscribe(
        (data) => {
          //console.log(data),
          this.queryDeRecetas = data,
          this.calcularPaginas(this.queryDeRecetas.totalResults!)
          this.busquedaDesplegada = !this.busquedaDesplegada

            //para testear console.log(this.queryDeRecetas.results),
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

  calcularPaginas = (totalResults:number) => {
    this.totalResults = totalResults;
    this.recetasPagesNumber =  Math.ceil(this.totalResults! / this.recetasPerPage);

    console.log(`se requieren ${this.recetasPagesNumber} páginas`);
  }

  
}



