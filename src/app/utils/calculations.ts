export class CalculationUtils {

    
    static calcularPaginas = (totalResults: number) => {
        let recetasPerPage = 10;
        let recetasPagesNumber: number;

        //this.totalResults = totalResults;
        recetasPagesNumber = Math.ceil(totalResults! / recetasPerPage);
        //debug: console.log(`se requieren ${recetasPagesNumber} páginas`);

        return recetasPagesNumber
    }

    /**
     * calcula la edad a partir de fecha en formato DD/MM/YYYY
     * @param {string} dateBirth - fecha en formato "DD/MM/YYYY"
     * @returns {number} - edad o 0 si fecha inválida
    */
    static calculateAge(dateBirth: string): number {
        
        //mapeo la string a array de nuemeros con día, mes -1 (js cuenta desde 0), año
        const [day, month, year] = dateBirth.split("/").map(Number);
        //pasamos a tipo date
        const birthDate = new Date(year, month - 1, day);
        //hoy
        const today = new Date();

        //restamos hoy - fecha nacimiento
        let age = today.getFullYear() - birthDate.getFullYear();

        return age;
    }
}