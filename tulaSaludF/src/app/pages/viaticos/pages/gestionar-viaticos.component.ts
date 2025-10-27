import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViaticosService } from '../../../services/viaticos.service';

@Component({
  selector: 'app-gestionar-viaticos',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, CurrencyPipe],
  templateUrl: './gestionar-viaticos.component.html',
})
export class GestionarViaticosComponent {
  buscarNumeroCaso: string = '';
  viaticos: any[] = [];
  buscado = false;

  viaticoSeleccionado: any = null;
  nuevoEstado: string = '';
  nombreJefe: string = '';

  constructor(private viaticosService: ViaticosService) {}

  buscarViaticos() {
    if (!this.buscarNumeroCaso.trim()) return;

    this.viaticosService.obtenerViaticoPorNumeroCaso(this.buscarNumeroCaso).subscribe({
      next: (res) => {
        if (res.success && res.data.length > 0) {
          this.viaticos = res.data;
          this.buscado = true;
        } else {
          this.viaticos = [];
          alert('No se encontraron viáticos para este número de caso.');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al buscar viáticos.');
      },
    });
  }

  get totalGeneral(): number {
    return this.viaticos.reduce((sum, v) => {
      const total = Number(v.total_detalle) || 0;
      return sum + total;
    }, 0);
  }

  abrirModal(viatico: any) {
    this.viaticoSeleccionado = viatico;
  }

  cerrarModal() {
    this.viaticoSeleccionado = null;
    this.nuevoEstado = '';
    this.nombreJefe = '';
  }

  guardarCambio() {
    if (!this.nuevoEstado || !this.nombreJefe) {
      alert('Debe ingresar el estado y el nombre del jefe.');
      return;
    }

    const numeroCaso = this.viaticos[0]?.numero_caso;

    this.viaticosService.actualizarEstado(numeroCaso, this.nuevoEstado, this.nombreJefe).subscribe({
      next: (res) => {
        if (res.success) {
          alert(res.message);
          this.buscarViaticos(); // refresca tabla
          this.nuevoEstado = '';
          this.nombreJefe = '';
        } else {
          alert('No se pudo actualizar el estado.');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar estado.');
      },
    });
  }
}
