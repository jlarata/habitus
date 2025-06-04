export class CalculationUtils {

    
    static calcularPaginas = (totalResults: number) => {
        let recetasPerPage = 10;
        let recetasPagesNumber: number;

        //this.totalResults = totalResults;
        recetasPagesNumber = Math.ceil(totalResults! / recetasPerPage);
        console.log(`se requieren ${recetasPagesNumber} páginas`);

        return recetasPagesNumber
    }
}