import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuscadorPage } from './buscadorpage';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { BuscadorPageRoutingModule } from './buscador-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    BuscadorPageRoutingModule
  ],
  declarations: [BuscadorPage]
})
export class BuscadorPageModule {}
