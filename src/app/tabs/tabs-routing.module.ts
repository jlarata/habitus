import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'recetas',
        loadChildren: () => import('../recetas/recetas.module').then(m => m.RecetasPageModule)
      },
      /* {

        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      }, */
      {
        path: 'calendario',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      /* {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      }, */

    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabs/calendario',

    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
