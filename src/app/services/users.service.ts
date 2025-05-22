import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, setDoc,addDoc, collection, Firestore, getDocs, getFirestore } from 'firebase/firestore'
import { environment } from 'src/environments/environment';

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

    public async crearDataUsuario(email:string, uid:any) {
        try {
            const nuevoUsuario = {
                mail: email,
                hace_actividad_fisica_regular: false,
                UID: uid, //la alternativa es que al crear el usuario 
                //le hagas un get para saber la ID,
                calendar_event: [], //esto tiene q ser un array de 
                //eventuales objetos
                celiaco: false,
                edad: 0, //acá podemos implementar un
                // "fecha de nacimiento" como quieran
                fechaNacimiento: "15/05/00",
                peso: 0,
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




}