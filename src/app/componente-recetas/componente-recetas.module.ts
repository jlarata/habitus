import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { componenteRecetasPage } from './componente-recetas.page';
import { ComponenteRecetasPageRoutingModule } from './componente-recetas-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ComponenteRecetasPageRoutingModule
  ],
  declarations: [componenteRecetasPage]
})
export class ComponenteRecetasPageModule { }
