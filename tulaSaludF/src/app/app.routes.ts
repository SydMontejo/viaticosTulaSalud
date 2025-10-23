import { Routes } from '@angular/router';


export const routes: Routes = [
  // Ruta raíz: carga Home
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
  },
   
  // Para registro de viáticos
  {
    path: 'viaticos',
    children: [
     
      {
        path: 'nuevo',
        // Registro de nuevo viatico
        loadComponent: () =>
          import('./features/viaticos/pages/nuevo-viatico.component').then(
            (c) => c.NuevoViaticoComponent
          ),
      },
       {
      path: 'dashboard',  // <-- nueva ruta
      loadComponent: () =>
        import('./features/dashboard/dashboard.component').then(
          (c) => c.DashboardComponent
        ),
    },
    {
      path: 'gestionar',
        loadComponent: () =>
          import('./features/viaticos/pages/gestionar-viaticos.component').then(
            (c) => c.GestionarViaticosComponent
        ),
    },  
    ],
  },

  { path: '**', redirectTo: '' },
  
];
