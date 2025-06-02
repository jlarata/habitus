import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, setDoc,addDoc, collection, Firestore, getDocs, getFirestore, getDoc, updateDoc } from 'firebase/firestore'
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

const app = initializeApp(environment.firebase)
const db =  getFirestore(app)

@Injectable({
    providedIn: 'root'
})


export class UsersService {

    constructor() { }

    public async obtenerUsuarios() {

        /* console.log(getDocs(collection(db, "users"))) */
        const querySnapshot = await getDocs(collection(db, "users"));
        console.log(querySnapshot.docs[1].data())
        console.log('mail id: '+querySnapshot.docs[1].data()['mail'])
        console.log('recetas favoritas: '+querySnapshot.docs[1].data()['recetas_favoritas'])
        console.log('es veganx?: '+ querySnapshot.docs[1].data()['vegano'])
        console.log('es celiacx?: '+querySnapshot.docs[1].data()['celiaco'])
        console.log('se ejercita?: '+querySnapshot.docs[1].data()[' hace_actividad_fisica_regular'])
        console.log('peso: '+querySnapshot.docs[1].data()['peso']+'Kgs')
        console.log('eventos agendados?: '+querySnapshot.docs[1].data()['calendar_event']['title'])
        /* querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        }); */
    }
    
    /**
     *
     *Al crear usuario inicializamos una collecion en firestore 
     *con datos preinicializados del usuario. 
     *usamos eail como id de la colleccion
     * @param {string} email
     * @param {*} uid
     * @memberof UsersService
     */
    public async crearDataUsuario(email:string, uid:any) {
        try {
            const nuevoUsuario:User = {
                uid: uid, // voy a almacenar el id uduario por las dudas
                image:"",
                email: email,
                name: "",  
                lastName: "", 
                dateBirth: "", //dd/mm/yy
                biologicalSex: "X",    
                weight: 0,   // Peso en kg (opcional)
                heigth: 0,  // Altura en cm (opcional)
                age:0, //calculado desde la fecha de nacimiento
                levelActivity:"Media", //Baja, Media, Alta
                calendar_event: [], //esto tiene q ser un array de 
                //eventuales objetos
                celiaco: false,
                recetas_favoritas: [],
                vegano: false,
                vegetariano: false
            };

            //pone id random a la colleccion
            //const docRef = await addDoc(collection(db, "users"),nuevoUsuario);

            //enviamos el email para id de coleccion
            const docRef = await setDoc(doc(db, "users", email), nuevoUsuario);

            console.log("Usuario agregado exitosamente. "+  docRef);

        } catch (error) {

            console.error("Error guardado datos usuario: " + error)
            
        }
    }
    
    /**
     *busca coleccion por id (email) que se le pasa por parametro
     *retorna promesa datos en forma de la interface User o null si da error
     * @param {string} email
     * @return {*}  {(Promise<User | null>)}
     * @memberof UsersService
    */
    public async obtenerPerfilUsuario(email: string): Promise<User | null> {
        //voy a atrapar los errores desde profile.page.ts
        const docRef = doc(db, "users", email); // referencia al doc por email
        const docSnap = await getDoc(docRef); // obtiene el documento desde Firestore

        if (!docSnap.exists()) {
            throw new Error(`No se encontró perfil de usuario con email: ${email}`);
        }

        return docSnap.data() as User;
    }
    
    /**
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
    public async actualizarPerfilUsuario(email: string, datosActualizados: Partial<User>): Promise<void> {
        const docRef = doc(db, "users", email); 
        await updateDoc(docRef, datosActualizados);
    }


}