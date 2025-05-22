import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, Firestore, getDocs, getFirestore } from 'firebase/firestore'
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


}