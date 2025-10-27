import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// 👇 importa tu navbar (ruta según la estructura de tu amigo)
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  mostrarNavbar = false;
  title = 'tulaSaludF';

  private router = inject(Router);

  constructor() {
    // 🔹 Muestra navbar en todas las rutas excepto login ('/')
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarNavbar = event.urlAfterRedirects !== '/';
      });
  }
}
