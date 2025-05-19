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

  onButtonClicked(queryDeRecetas: QueryDeRecetas) {
    this.queryDeRecetas = queryDeRecetas
    //console.log(queryDeRecetas)
  }

  constructor(public spoonacular: SpoonacularService) {}

}



