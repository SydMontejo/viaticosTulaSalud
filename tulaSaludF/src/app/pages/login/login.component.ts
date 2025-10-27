import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPassword = false;
  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  togglePassword() { this.showPassword = !this.showPassword; }

  async submit() {
    this.error = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    await new Promise(r => setTimeout(r, 600));
    console.log('Login normal:', this.form.getRawValue());
    this.loading = false;
  }

  ngOnInit(): void {
    // Si ya hay sesión, ir al home
    const storedUser = sessionStorage.getItem('google_user');
    if (storedUser) { this.router.navigateByUrl('/home'); return; }

    // Esperar a que cargue el SDK
    const t = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts?.id) {
        clearInterval(t);
        console.log('✅ SDK de Google cargado correctamente');

        // Asegura que no quede auto-selección previa
        google.accounts.id.disableAutoSelect?.();

        google.accounts.id.initialize({
          client_id: '1005433700103-o0ka3mc82hnusoc5km9r1kstl0r77dsf.apps.googleusercontent.com',
          callback: (resp: any) => this.handleCredentialResponse(resp),
          ux_mode: 'popup',          // evita redirect y FedCM “estricto”
          auto_select: false,        // no auto-loguear
          cancel_on_tap_outside: true
        });

        // 👉 Solo botón (sin One-Tap, sin prompt)
        google.accounts.id.renderButton(
          document.getElementById('googleButtonDiv'),
          { theme: 'outline', size: 'large', width: 340, text: 'signin_with' }
        );
      }
    }, 200);
  }

  // NO llamamos google.accounts.id.prompt() en ningún lado

  handleCredentialResponse(response: any) {
    if (!response?.credential) {
      console.error('❌ No se recibió un token válido de Google');
      this.error = 'Error al autenticar con Google.'; return;
    }
    const token = response.credential;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      sessionStorage.setItem('google_user', JSON.stringify(payload));
      this.router.navigateByUrl('/home'); // Navbar ya tendrá sesión disponible
    } catch (e) {
      console.error('❌ Error al procesar token:', e);
      this.error = 'No se pudo procesar la información del usuario.';
    }
  }
}
