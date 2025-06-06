import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})


export class SpoonacularService {

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')

  public platform:Platform;
  public toastCtrl:ToastController
  
  constructor(public http: HttpClient,
    platform: Platform,
    toastCtrl: ToastController,
  ) { 
    this.platform = platform,
    this.toastCtrl = toastCtrl
  }

  /**
   * @function obtenerRecetas
   * @param 
   * @returns un objeto con el atributo results que es un array de objetos que estamos mandando a la clase queryDeRecetas
   * función obsoleta? eliminar?
   */
  public obtenerRecetas() {
    // original
    //const url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey='+environment.spoonacular.apiKey+'&fillIngredients=true&offset=1'
    //test
    const url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=' + environment.spoonacularTest.apiKey + '&fillIngredients=true&offset=1'

    //console.log(url)
    return this.http.get(url
      ,
      { headers: this.headers }
    )
  };
  /**
   * 
   * @param receta es un docDefinition, un objeto que crea el pdfmake
   * @param titulo una string para sumar al título del archivo
   * datenow es para asegurar que si se baja dos veces la misma receta, no tenga el mismo nombre de archivo.
   */
  public async guardarRecetaPDF(receta:any, titulo:string) {
    const fileName = titulo+Date.now()+'.pdf';
    //this.showToast('se intentará guardar '+ fileName);
    //this.showToast('el contenido es este base64:'+receta)
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: receta,
      directory: Directory.Documents
    });

    //debug: this.showToast('se ha guardado '+ savedFile);
  }

  /**
   * @function obtenerRecetasConInformacion
   * @returns el mismo objeto que obtenerRecetas() pero ahora los objetos del array results incluyen data como vegetarian, glutenfree, healthScore, summary
  */
  public obtenerRecetasConInformacion(vegetarian?: boolean, glutenFree?: boolean, vegan?: boolean) {

    let veg = "";
    let cel = "";
    let vveg = "";

    if (vegetarian && vegetarian == true) {
      veg = "&diet=vegetarian"
    }
    if (glutenFree && glutenFree == true) {
      cel = "&intolerances=gluten"

    }
    if (vegan && vegan == true) {
      veg = "&diet=vegan"
    }
    //original    
    //let url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey='+environment.spoonacular.apiKey+'&fillIngredients=true&addRecipeInformation=true'+veg+cel+vveg
    //test
    let url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=' + environment.spoonacularTest.apiKey + '&fillIngredients=true&addRecipeInformation=true' + veg + cel + vveg

    return this.http.get(url
      ,
      { headers: this.headers }
    )
  }


  /**
 * @function obtenerRecetasPorNombre
 * @param nombre un string. puede ser parcial.
 * @returns devuelve el mismo objeto pero filtrado. CUIDADO: busca resultados en cualquier parte de la receta no solo en el título
 * FUNCION QUE NO VAMOS A USAR? ESTO sería para hacer un buscador copado
 */
  public obtenerRecetasPorNombre(nombre: string) {
    const url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=' + environment.spoonacular.apiKey + `&fillIngredients=true&addRecipeInformation=true&titleMatch=${nombre}`

    //console.log(url)
    return this.http.get(url
      ,
      { headers: this.headers }
    )
  }
  /**
   * @function obtenerRecetaPasoAPasoPorID
   * @param ID la ID de la receta. aparentemente es siempre un número de 6 cifras
   * @returns un array con ¿un? objeto con atributos name y steps (que es un array)
   *          cada step tiene los atributos number, step, ingredients (otro array) y equipment 
   */

  public obtenerRecetaPasoAPasoPorID(ID: string) {
    //original
    //const url = `https://api.spoonacular.com/recipes/${ID}/analyzedInstructions?apiKey=` + environment.spoonacular.apiKey + '&stepBreakdown'
    //test
    const url = `https://api.spoonacular.com/recipes/${ID}/analyzedInstructions?apiKey=` + environment.spoonacularTest.apiKey + '&stepBreakdown'
    return this.http.get(url
      ,
      { headers: this.headers }
    )
  }

  public obtenerVariasRecetasPorID(ID: string[]) {
    
    const url = `https://api.spoonacular.com/recipes/informationBulk?ids=${ID.join()}&apiKey=` + environment.spoonacularTest.apiKey
    //debug: console.log(url) 
    return this.http.get(url
      ,
      { headers: this.headers }
    )
  }

  /**
  *mostrar alerta dtos guardados o error
  *
  * @param {string} message
  */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}