import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscadorPage } from './buscadorpage';

const routes: Routes = [
  {
    path: '',
    component: BuscadorPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuscadorPageRoutingModule {}
