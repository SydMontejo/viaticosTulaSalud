import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// 👇 Ajustá esta ruta según dónde esté tu navbar
// si está en src/app/components/navbar/
import { NavbarComponent } from './components/navbar/navbar.component';
// si está en src/app/pages/navbar/ usa:
// import { NavbarComponent } from './pages/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class App {
  protected readonly title = signal('sistema-viaticos-front');
  mostrarNavbar = false;

  private router = inject(Router);

  constructor() {
    // 🔹 Muestra u oculta la navbar dependiendo de la ruta actual
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarNavbar = event.urlAfterRedirects !== '/';
      });
  }
}
