import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SpoonacularService } from './services/spoonacular.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { Tab2Page } from './tab2/tab2.page';

@NgModule({
  declarations: [AppComponent, ToolbarComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    //iniciliza firebase
    AngularFireModule.initializeApp(environment.firebase),
    //modulo de autenticación
    AngularFireAuthModule,
    HttpClientModule,
    
    
  ],
  providers: [
    { 
    provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy 
    },
    SpoonacularService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
