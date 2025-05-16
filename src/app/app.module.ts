import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClientModule } from '@angular/common/http';
import { SpoonacularService } from './services/spoonacular.service';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    //iniciliza firebase
    AngularFireModule.initializeApp(environment.firebase),
    //modulo de autenticación
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SpoonacularService],
  bootstrap: [AppComponent],
})
export class AppModule {}
