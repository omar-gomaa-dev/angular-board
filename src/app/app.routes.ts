import { Routes } from '@angular/router';
import { BoardsHomeComponent } from './components/board/boards-home';
import { BoardComponent } from './components/board/board';
// import { SettingsComponent } from './components/settings/settings';

export const routes: Routes = [
  // أول ما يفتح يروح للـ home اللي فيها كل البوردات
  { path: '', redirectTo: 'boards', pathMatch: 'full' },

  // صفحة عرض كل البوردات + إنشاء بورد جديد
  { path: 'boards', component: BoardsHomeComponent },

  // صفحة عرض بورد واحد (نحدد الـ id بتاعه في الـ URL)
  {
    path: 'boards/:id',
    component: BoardComponent,
    runGuardsAndResolvers: 'paramsChange',
  },

  // { path: 'settings', component: SettingsComponent },

  // في حالة أي URL غلط → نرجع للـ boards
  { path: '**', redirectTo: 'boards' },
];
