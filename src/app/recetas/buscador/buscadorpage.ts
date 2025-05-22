import { Component, EventEmitter, Output } from '@angular/core';
import { SpoonacularService } from '../../services/spoonacular.service';
import { QueryDeRecetas } from '../../models/recetas';


@Component({
  selector: 'app-buscador',
  templateUrl: 'buscador.page.html',
  styleUrls: ['buscador.page.scss'],
  standalone: false,
})
export class BuscadorPage {

  public vegetarianIsChecked = false;
  public glutenFreeIsChecked = false;
  public veganIsChecked = false;
  queryDeRecetas?: QueryDeRecetas;
  @Output() buttonClicked = new EventEmitter<QueryDeRecetas>();


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
          console.log(data),
          this.queryDeRecetas = data,
            //para testear console.log(this.queryDeRecetas.results),
            this.buttonClicked.emit(this.queryDeRecetas)
        },
        (error) => { console.log(error); }
      )
  }
  
}



