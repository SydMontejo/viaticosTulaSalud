import { Routes } from '@angular/router';

export const routes: Routes = [
  // 🟢 Ruta raíz: tu login
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },

  // 🏠 Home de tu amigo
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },

  // 📊 Sección de viáticos de tu amigo
  {
    path: 'viaticos',
    children: [
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/viaticos/pages/nuevo-viatico.component').then(
            (c) => c.NuevoViaticoComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'gestionar',
        loadComponent: () =>
          import('./pages/viaticos/pages/gestionar-viaticos.component').then(
            (c) => c.GestionarViaticosComponent
          ),
      },
    ],
  },

  // 🚫 Cualquier ruta no válida → login
  { path: '**', redirectTo: '' },
];
