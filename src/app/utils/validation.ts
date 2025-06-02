/**
 * clase con métodos para validaciones comunes para reutilizar.
 * al ser static no hace falta inicializar la clase para usarlo
 * ejemplo de llamado: `ValidationUtils.isValidEmail(email);`
*/
export class ValidationUtils {
  /**
   * verifica si el string es un correo válido.
   * `true` ->válido 
   * `false`->inválido
   * @param email 
   * @returns {boolean}
  */
  static isValidEmail(email: string): boolean {
    // expresión regular para validar el formato del email ingresado
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //emailRegex.test() verifica si `email` coincide con el patrón que declaramos en emailRegex.
    return emailRegex.test(email);
  }

  /**
   * Valida que la contraseña ingresada tenga minimo 6 caracteres de longitud.
   * @param password 
   * @returns {boolean} 
   * `true` -> válido
   * `false`-> inválido.
  */
  static isPasswordValid(password: string): boolean {
    return password.length >= 6;
  }

  /**
   * Valida si un campo está vacío (nulo, indefinido o solo contiene espacios en blanco).
   * @param value La cadena a validar.
   * @returns {boolean}
   * `true` -> vacio/nulo/undefined
   * `false`-> hay valores
   */
  static isFieldEmpty(value: string): boolean {
    //trim elimina espacio al inicio y final de una cadena
    // Verifica si el valor es nulo, indefinido, 
    // o si después de eliminar los espacios en blanco, la cadena está vacía.
    return !value || value.trim().length === 0;
  }
  
  /**
   *Valida si la fecha tiene el formato DD/MM/YY
   *con regex
   * @static
   * @param {string} date
   * @return {*}  {boolean}
   * @memberof ValidationUtils
   */
  static isValidDate(date: string): boolean {
    // Validar formato DD/MM/YYYY con regex
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(date)) return false;

    // dividir la fecha y convertir a números
    const [day, month, year] = date.split("/").map(Number);

    // validar año dentro de un rango  (1900-actual)
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) return false;

    // crear objeto fecha con los valores ingresados
    const validDate = new Date(year, month - 1, day);

    // obtener la fecha actual quitando horas/minutos/segundos
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // validar que la fecha ingresada es real y que sea menor o igual a hoy
    return validDate.getFullYear() === year &&
           validDate.getMonth() + 1 === month &&//en js el mes arranca en 0
           validDate.getDate() === day &&
           validDate <= today;
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