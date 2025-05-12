/**
 *perfil de usuarios
 *
 * @export
 * @interface UserProfile
 */
export interface UserProfile {
    uid: string;      // ID único del usuario (proporcionado por Firebase)
    email: string;    // Correo electrónico
    name: string;   // Nombre
    lastName?: string; // Apellido (opcional)
    dateBirth?: string; // Fecha de nacimiento (opcional)
    biologicalSex?: string;     // Sexo biologico (opcional)
    weight?: number;    // Peso en kg (opcional)
    heigth?: number;  // Altura en cm (opcional)
    age?:number; //calculado desde la fecha de nacimiento
}