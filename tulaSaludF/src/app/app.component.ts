import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="h-screen flex flex-col bg-gray-100">
      <nav class="p-4 bg-white shadow flex space-x-4">
        <a routerLink="/" class="text-blue-600 hover:underline">Inicio</a>
        
      </nav>

      <main class="flex-1 p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {}
