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



  queryDeRecetas?: QueryDeRecetas;
  isShowingMore:boolean = false;
  queryDeRecetaForDisplay?: QueryDeRecetaForDisplay;
  imagenEnDisplay? : string;

  constructor(
    public spoonacular: SpoonacularService,
    public usersService : UsersService
  ) {}

  toggleRecipeSteps = () => {
    this.isShowingMore = !this.isShowingMore
  }
  
  onButtonClicked(queryDeRecetas: QueryDeRecetas) {
    this.queryDeRecetas = queryDeRecetas
    console.log(queryDeRecetas.totalResults+' resultados encontrados')

  }

  public blanquearRecetas() {
    this.queryDeRecetas = undefined;
    this.isShowingMore = !this.isShowingMore;

  }

  

  ngOnInit() {
  // esto era para probar nomás this.usersService.obtenerUsuarios();
  }
  
  buscarPorId = (id: number, image: string) => {
    this.imagenEnDisplay = image;
    this.spoonacular.obtenerRecetaPasoAPasoPorID(id.toString())
    .subscribe(
        (data : any) => {
          this.queryDeRecetaForDisplay = data[0]!;
          /*for (let step of this.queryDeRecetaForDisplay?.steps!) {
            console.log(step.step)
            
          } */
         console.log(data)
          
          this.isShowingMore = !this.isShowingMore;

        },
        (error) => { console.log(error); }
      )
  }

}



