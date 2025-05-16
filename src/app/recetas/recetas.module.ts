import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecetasPage } from './recetaspage';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { RecetasPageRoutingModule } from './recetas-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RecetasPageRoutingModule
  ],
  declarations: [RecetasPage]
})
export class RecetasPageModule {}
