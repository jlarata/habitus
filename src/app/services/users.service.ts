import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, setDoc, addDoc, collection, Firestore, getDocs, getFirestore, getDoc, updateDoc } from 'firebase/firestore'
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { EventDay } from '../models/calendar.model';
import { BehaviorSubject } from 'rxjs';

const app = initializeApp(environment.firebase)
const db = getFirestore(app)


@Injectable({
    providedIn: 'root'
})


export class UsersService {

  //armamos el observable para eventos
  private eventosSource = new BehaviorSubject<EventDay[]>([]);
  eventos$ = this.eventosSource.asObservable();

    constructor() { }

    /**
     *
     *Al crear usuario inicializamos una collecion en firestore 
     *con datos preinicializados del usuario. 
     *usamos email como id de la colleccion
     * @param {string} mail
     * @memberof UsersService
     */
    public async crearDataUsuario(mail:string
        ) {
        try {
            const nuevoUsuario:User = {
                UID: "", 
                mail: mail,
                nombre: "",  
                apellido: "", 
                sexo: "X",    
                peso: 0, // Peso en kg (opcional)
                altura: 0,  // Altura en cm (opcional)
                edad:0, //calculado desde la fecha de nacimiento
                hace_actividad_fisica_regular:"medio", 
                celiaco: false,
                recetas_favoritas: [],
                vegano: false,
                vegetariano: false,
                events_array: [],
            };

            //enviamos el email para id de coleccion 
            const docRef = await setDoc(doc(db, "users", mail), nuevoUsuario);

            console.log("Usuario agregado exitosamente. " + docRef);

        } catch (error) {

            console.error("Error guardado datos usuario: " + error)

        }
    }

    /**
     *busca coleccion por id (email) que se le pasa por parametro
     *retorna promesa, datos en forma de la interface User o null si da error
     * @param {string} mail
     * @return {*}  {(Promise<User | null>)}
     * @memberof UsersService
    */
    public async obtenerPerfilUsuario(mail: string): Promise<User | null> {
        //voy a atrapar los errores desde profile.page.ts
        //debug: console.log("probando para ", mail)
        const docRef = doc(db, "users", mail); // referencia al doc por email
        const docSnap = await getDoc(docRef); // obtiene el documento desde Firestore

        if (!docSnap.exists()) {
            throw new Error(`No se encontró perfil de usuario con email: ${mail}`);
        }

        const perfil = docSnap.data() as User;
        //console.log("el servicio devuelve: ", perfil)
        return docSnap.data() as User;
    }
   
    /**
     *busca coleccion de usuraio por email,
     *y actualiza sus eventos 
     *
     * @param {string} email
     * @param {EventDay[]} events_array
     * @memberof UsersService
    */
    async saveEventsArray(email: string, events_array: EventDay[]) {

        const docRef = doc(db, "users", email); // referencia al doc por email

        // Update 
        await updateDoc(docRef, {
            events_array
        });
        
        // actualizar array evento en toda la app
        this.eventosSource.next(events_array);
        
        //console.log(events_array, " updateado para ", email);
    }

    /**
     *actualiza datos de usuario en firestore a partir del email
     *
     * @param {string} mail
     * @param {*} nueva_data_de_usuario
     * @memberof UsersService
    */
    async actualizarUsuario(mail: string, nueva_data_de_usuario:any) {
        const docRef = doc(db, "users", mail); // referencia al doc por email
        await updateDoc(docRef, nueva_data_de_usuario)
    } 

}