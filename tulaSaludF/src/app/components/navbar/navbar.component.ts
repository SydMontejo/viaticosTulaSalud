import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const google: any; // necesario para usar el SDK de Google

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  user: any = null;
  menuOpen = false;
  mobileOpen = false;

  private router = inject(Router);

  ngOnInit(): void {
    // 🔹 Recuperar usuario desde sessionStorage
    const data = sessionStorage.getItem('google_user');
    if (data) {
      this.user = JSON.parse(data);
    } else {
      // Si no hay sesión, volver al login (raíz '/')
      this.router.navigateByUrl('/');
      return;
    }

    // 🔹 Desactivar auto login del SDK de Google
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.disableAutoSelect();
    }

    // 🔹 Cerrar menús automáticamente al cambiar de página
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menuOpen = false;
        this.mobileOpen = false;
      });
  }

  // 🔹 Alternar menús
  toggleUserMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  // 🔹 Cerrar sesión y volver al login
  logout(): void {
    try {
      // 1️⃣ Limpiar datos locales
      sessionStorage.removeItem('google_user');
      sessionStorage.clear();

      // 2️⃣ Limpiar sesión del SDK de Google
      if (typeof google !== 'undefined' && google.accounts?.id) {
        google.accounts.id.disableAutoSelect();

        if (typeof google.accounts.id.cancel === 'function') {
          google.accounts.id.cancel();
        }
      }

      // 3️⃣ Limpiar el contenedor del botón si existe
      const btn = document.getElementById('googleButtonDiv');
      if (btn) btn.innerHTML = '';

      // 4️⃣ Redirigir al login (raíz '/')
      this.router.navigateByUrl('/');
    } catch (e) {
      console.error('Error en logout:', e);
    }
  }
}
