import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { componenteRecetasPage } from './componente-recetas.page';

const routes: Routes = [
  {
    path: '',
    component: componenteRecetasPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponenteRecetasPageRoutingModule {}
