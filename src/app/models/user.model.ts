/**
 *perfil/datos de usuarios
 *
 * @export
 * @interface User
*/
export interface User {
    uid?: string;      // ID único del usuario (proporcionado por Firebase)
    image?:string;   //por si queremos poner foto perfil
    email: string;    // Correo electrónico
    name?: string;   // Nombre
    lastName?: string; // Apellido (opcional)
    dateBirth?: string; // Fecha de nacimiento (opcional)
    biologicalSex?: string;     // Sexo biologico (opcional)
    weight?: number;    // Peso en kg (opcional)
    heigth?: number;  // Altura en cm (opcional)
    age?:number; //calculado desde la fecha de nacimiento
    levelActivity?:string; //bajo, medio, alto
    recetas_favoritas?: string[]; //array strings 
    //cambiar tipos una vez definido los modelos
    calendar_event?: any; //esto tiene q ser un array de //eventuales objetos
    vegano?: boolean;
    vegetariano?: boolean;
    celiaco?: boolean;
}