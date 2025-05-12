/**
 *Modelo del perfil de usuarios
 *
 * @export
 * @interface UserProfile
 */
export interface UserProfile {
    uid: string;      // ID único del usuario (proporcionado por Firebase)
    email: string;    // Correo electrónico
    nombre: string;   // Nombre
    apellido?: string; // Apellido (opcional)
    fechaNacimiento?: string; // Fecha de nacimiento (opcional)
    sexo?: string;     // Sexo biologico (opcional)
    peso?: number;    // Peso en kg (opcional)
    altura?: number;  // Altura en cm (opcional)
    edad?:number; //calculado desde la fecha de nacimiento
}