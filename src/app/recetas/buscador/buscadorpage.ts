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

public vegetarianIsChecked = true;
public glutenFreeIsChecked = false;
queryDeRecetas? : QueryDeRecetas;
@Output() buttonClicked = new EventEmitter<QueryDeRecetas>();
  

handleClick() {
  
  this.buscarRecetas();
}

  constructor(public spoonacular : SpoonacularService) {}
  ngOnInit() {
    //le saco lo automático al método / this.ionViewDidLoad()
  }


  //private ionViewDidLoad() {
  buscarRecetas = () => {
    //this.spoonacular.obtenerRecetas()
    if (this.vegetarianIsChecked) {
      if (this.glutenFreeIsChecked) {
        this.spoonacular.obtenerRecetasConInformacion(true, true)
      .subscribe(
      (data) => {
        this.queryDeRecetas = data,
        console.log(this.queryDeRecetas.results),
        this.buttonClicked.emit(this.queryDeRecetas)
      },
      (error) => {console.log(error);} 
    )
      } else {
        this.spoonacular.obtenerRecetasConInformacion(true, false)
      .subscribe(
      (data) => {
        this.queryDeRecetas = data,
        console.log(this.queryDeRecetas.results),
        this.buttonClicked.emit(this.queryDeRecetas)
      },
      (error) => {console.log(error);} 
    )
      }
      
    } else {


      if (this.glutenFreeIsChecked) {
        this.spoonacular.obtenerRecetasConInformacion(false, true)
      .subscribe(
      (data) => {
        this.queryDeRecetas = data,
        console.log(this.queryDeRecetas.results),
        this.buttonClicked.emit(this.queryDeRecetas)
      },
      (error) => {console.log(error);} 
    )
      } else {
        this.spoonacular.obtenerRecetasConInformacion(false, false)
      .subscribe(
      (data) => {
        this.queryDeRecetas = data,
        console.log(this.queryDeRecetas.results),
        this.buttonClicked.emit(this.queryDeRecetas)
      },
      (error) => {console.log(error);} 
    )
      }
      
    };   
  }
}



