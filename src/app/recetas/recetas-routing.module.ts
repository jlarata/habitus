import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecetasPage } from './recetaspage';

const routes: Routes = [
  {
    path: '',
    component: RecetasPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecetasPageRoutingModule {}
