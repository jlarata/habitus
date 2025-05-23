import { Component } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';
import { QueryDeRecetas } from '../models/recetas';
import { UsersService } from '../services/users.service';


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
    console.log(queryDeRecetas.totalResults+' resultados encontrados')

  }

  public blanquearRecetas() {
    this.queryDeRecetas = undefined;
  }

  constructor(
    public spoonacular: SpoonacularService,
    public usersService : UsersService
  ) {}

  ngOnInit() {
  // esto era para probar nomás this.usersService.obtenerUsuarios();
  }
  
  buscarPorId = (id: number) => {
    this.spoonacular.obtenerRecetaPasoAPasoPorID(id.toString())
    .subscribe(
        (data) => {
          console.log(data)
        },
        (error) => { console.log(error); }
      )
  }

}



