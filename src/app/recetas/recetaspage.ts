import { Component } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';
import { QueryDeRecetas } from '../models/recetas';


@Component({
  selector: 'app-recetas',
  templateUrl: 'recetas.page.html',
  styleUrls: ['recetas.page.scss'],
  standalone: false,
})
export class RecetasPage {

  queryDeRecetas?: QueryDeRecetas;
  onButtonClicked(message: string) {
    console.log(message)
  }

  constructor(public spoonacular: SpoonacularService) { }
  ngOnInit() {
    //le saco lo automático al método / this.ionViewDidLoad()
  }


  //private ionViewDidLoad() {
  private buscarRecetas() {
    this.spoonacular.obtenerRecetas()
      .subscribe(
        (data) => {
          this.queryDeRecetas = data//, console.log(this.queryDeRecetas.results)
        },
        (error) => { console.log(error); }
      )

  }
}



