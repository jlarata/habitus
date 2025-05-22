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
  static isValidDate(date:string):boolean {
    const regex = /^\d{2}\/\d{2}\/\d{2}$/; // Formato DD/MM/YY
    return regex.test(date);
  }


}