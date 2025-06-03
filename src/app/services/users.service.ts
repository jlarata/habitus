import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, setDoc, addDoc, collection, Firestore, getDocs, getFirestore, getDoc, updateDoc } from 'firebase/firestore'
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { EventDay } from '../models/calendar.model';

const app = initializeApp(environment.firebase)
const db = getFirestore(app)


@Injectable({
    providedIn: 'root'
})


export class UsersService {

    constructor() { }

    /**
     *
     *Al crear usuario inicializamos una collecion en firestore 
     *con datos preinicializados del usuario. 
     *usamos email como id de la colleccion
     * @param {string} mail
     * @param {*} uid //POR AHORA NO LO USAMOS
     * @memberof UsersService
     */
    public async crearDataUsuario(mail:string//, uid:any POR AHORA SACO ESTO SI NO LO USAMOS
        ) {
        try {
            const nuevoUsuario:User = {
                UID: "", // AQUÍ HABRÍA QUE HACER UN MÉTODO EN DOS PASOS. PRIMERO AWAIT CREAR USER 
                // EN FIREBASE AUTTH, LUEGO GET ESOS DATOS INCLUYENDO MAIL Y UID Y USAR ESO PARA LA BBDD EN FIRESTORE
                // voy a almacenar el id uduario por las dudas
                //image:"",
                mail: mail,
                nombre: "",  
                apellido: "", 
                //dateBirth: "", //dd/mm/yy
                sexo: "X",    
                peso: 0, // Peso en kg (opcional)
                altura: 0,  // Altura en cm (opcional)
                edad:0, //calculado desde la fecha de nacimiento
                hace_actividad_fisica_regular:"medio", //Baja, Media, Alta
                calendar_event: [], //esto tiene q ser un array de 
                //eventuales objetos
                celiaco: false,
                recetas_favoritas: [],
                vegano: false,
                vegetariano: false,
                events_array: [],
            };

            //pone id random a la colleccion
            //const docRef = await addDoc(collection(db, "users"),nuevoUsuario);

            //enviamos el email para id de coleccion <- qué era esto? ya no sirve?
            const docRef = await setDoc(doc(db, "users", mail), nuevoUsuario);

            console.log("Usuario agregado exitosamente. " + docRef);

        } catch (error) {

            console.error("Error guardado datos usuario: " + error)

        }
    }

    /**
     *busca coleccion por id (email) que se le pasa por parametro
     *retorna promesa datos en forma de la interface User o null si da error
     * @param {string} mail
     * @return {*}  {(Promise<User | null>)}
     * @memberof UsersService
    */
    public async obtenerPerfilUsuario(mail: string): Promise<User | null> {
        //voy a atrapar los errores desde profile.page.ts
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
     * Ariel: SI NO ME EQUIVOCO este método queda obsoleto por el otro que armé más abajo. Lo comento por ahora
     * si luego nada se rompe vemos de borrarlo.
     *
     *updateDoc() → Actualiza solo los campos enviados (método de firestore)
     *Partial<T> es un tipo genérico en TypeScript
     *Partial<User> → Permite que solo pases los datos que quieres modificar.
     *pero email y uid es obligatorio creo(ver)
     *
     * @param {string} email
     * @param {Partial<User>} datosActualizados
     * @return {*}  {Promise<void>}
     * @memberof UsersService
    */
    /*public async actualizarPerfilUsuario(email: string, datosActualizados: Partial<User>): Promise<void> {
        const docRef = doc(db, "users", email); 
        await updateDoc(docRef, datosActualizados);
    }*/

    /*este es el método para updatear desde el calendario no? documentémoslo si es así
    no se por qué hablo en plural si lo hice yo, debería comentarlo yo
    bueno estoy inseguro*/
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





    //funcion para probar cositas, probablemente la eliminaremos de prod
    
    /* public async obtenerUsuarios() {

        // console.log(getDocs(collection(db, "users")))

        const querySnapshot = await getDocs(collection(db, "users"));
        console.log(querySnapshot.docs[1].data())
        console.log('mail id: '+querySnapshot.docs[1].data()['mail'])
        console.log('recetas favoritas: '+querySnapshot.docs[1].data()['recetas_favoritas'])
        console.log('es veganx?: '+ querySnapshot.docs[1].data()['vegano'])
        console.log('es celiacx?: '+querySnapshot.docs[1].data()['celiaco'])
        console.log('se ejercita?: '+querySnapshot.docs[1].data()['hace_actividad_fisica_regular'])
        console.log('peso: '+querySnapshot.docs[1].data()['peso']+'Kgs')
        console.log('eventos agendados?: '+querySnapshot.docs[1].data()['calendar_event']['title'])
        // querySnapshot.forEach((doc) => {
          //  console.log(`${doc.id} => ${doc.data()}`);
        //}); 
    } */


}