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

@Output() buttonClicked = new EventEmitter<string>();

handleClick() {
  console.log("el hijo sabe que se presionó el botón")
  this.buttonClicked.emit('el padre sabe que se presionó el botón')
}

queryDeRecetas? : QueryDeRecetas;
  
  constructor(public spoonacular : SpoonacularService) {}
  ngOnInit() {
    //le saco lo automático al método / this.ionViewDidLoad()
  }


  //private ionViewDidLoad() {
  private buscarRecetas() {
    this.spoonacular.obtenerRecetas()
    .subscribe(
      (data) => {this.queryDeRecetas = data//, console.log(this.queryDeRecetas.results)
      },
      (error) => {console.log(error);}
    )
   
  }
}



