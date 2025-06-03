import { EventDay } from "./calendar.model";

/**
 *perfil/datos de usuarios
 *
 * @export
 * @interface User
*/

/* export interface User {
    UID?: string;      // ID único del usuario (proporcionado por Firebase)
    image?:string;   //por si queremos poner foto perfil
    mail?: string;    // Correo electrónico
    name?: string;   // Nombre
    lastName?: string; // Apellido (opcional)
    dateBirth?: string; // Fecha de nacimiento (opcional)
    biologicalSex?: string;     // Sexo biologico (opcional)
    weight?: number;    // Peso en kg (opcional)
    heigth?: number;  // Altura en cm (opcional)
    age?:number; //calculado desde la fecha de nacimiento
    hace_actividad_fisica_regular?: string //"nada" | "bajo" | "medio" | "alto";
    recetas_favoritas?: string[]; //array strings 
    //cambiar tipos una vez definido los modelos
    calendar_event?: any; //esto tiene q ser un array de //eventuales objetos
    vegano?: boolean;
    vegetariano?: boolean;
    celiaco?: boolean;
} */

export interface User {
    UID?: string;      // ID único del usuario (proporcionado por Firebase)
    //image?: string;   //por si queremos poner foto perfil
    mail?: string;    // Correo electrónico
    nombre?: string;   // Nombre
    apellido?: string; // Apellido (opcional)
    fecha_de_nacimiento?: string;
    //dateBirth?: string; // Fecha de nacimiento (opcional)
    sexo?: string;     // Sexo biologico (opcional)
    peso?: number; // peso en kg (opcional)
    altura?: number;  // Altura en cm (opcional)
    edad?: number; //calculado desde la fecha de nacimiento
    hace_actividad_fisica_regular?: string //"nada" | "bajo" | "medio" | "alto";
    recetas_favoritas?: string[]; //array strings 
    //cambiar tipos una vez definido los modelos
    calendar_event?: any; //esto tiene q ser un array de //eventuales objetos
    vegano?: boolean;
    vegetariano?: boolean;
    celiaco?: boolean;
    events_array: EventDay[]
}

export class UserParaRecetas {
    mail?: string;
    vegetariano?: boolean;
    vegano?: boolean;
    celiaco?: boolean;
    recetas_favoritas?: string[];
    calendar_event?: any; //esto tiene q ser un array de //eventuales objetos
}

//esto era para editar usuario pero claramente los muchachos de FIRESTORAGE no estaban pensando
//en los muchachos de TYPESCRIPT. y no tengo tiempo ni ganas de revisar por qué y cómo.
export class Nueva_data_de_usuario {
    /*nombre: '';
    apellido?: string;
    fecha_de_nacimiento?: string;
    sexo?: string;
    peso?: number;
    altura?: number;
    hace_actividad_fisica_regular?: "nada" | "bajo" | "medio" | "alto";
    recetas_favoritas?: string[]; 
    calendar_event?: any; //esto tiene q ser un array de //eventuales objetos
    vegano?: boolean;
    vegetariano?: boolean;
    celiaco?: boolean; */
}

