import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class SpoonacularService {

  headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  
  constructor(public http: HttpClient) { }

  public saludar() {
    return "holi"
  }

  public obtenerRecetas() {
    const url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey='+environment.spoonacular.apiKey+'&fillIngredients=true&offset=1'
    console.log(url)
    return this.http.get(url
      ,
      { headers: this.headers }
    )
  }
}