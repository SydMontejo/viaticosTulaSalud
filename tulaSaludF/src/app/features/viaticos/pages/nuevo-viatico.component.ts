import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ViaticoRequest } from '../../../services/viaticos.service';
import { ViaticosService } from '../../../services/viaticos.service';
import { HttpClientModule } from '@angular/common/http';
import NumeroALetras from 'numero-a-letras';

@Component({
  selector: 'app-nuevo-viatico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './nuevo-viatico.component.html',
  providers: [ViaticosService]
})
export class NuevoViaticoComponent {
  viaticoForm: FormGroup;
  gastos: any[] = []; // detalle de gastos
  editIndex: number | null = null;
  empleados: { cui: string, nombre: string }[] = [];
  numeroCasoGuardado: string | null = null;

  productos: string[] = ['A1', 'A2', 'A3'];
  municipios: string[] = [
    'Guatemala', 'Mixco', 'Villa Nueva', 'Chimaltenango', 'Antigua Guatemala'
  ];
  numeroCasoGenerado: string | null = null;


  constructor(private fb: FormBuilder, private viaticosService: ViaticosService) {
    this.viaticoForm = this.fb.group({
      cuiTrabajador: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      nombreTrabajador: ['', Validators.required],
      nombreJefe: ['', Validators.required],
      // campos de totales principales
      cantidadLetra: [''],
      cantidadNumero: [0],
      // campos del gasto (se reutilizan para cada fila)
      fecha: ['', Validators.required],
      resultado: ['', Validators.required],
      producto: ['', Validators.required],
      motivo: ['', Validators.required],
      destino: ['', Validators.required],
      desayuno: [0],
      almuerzo: [0],
      cena: [0],
      hospedaje: [0],
      parqueo: [0],
      transporte: [0],
      // campo total del formulario (solo visual)
      total: [{ value: 0, disabled: true }]
    });

    // recalculamos el "total" de campos gasto en el formulario cada vez que cambian importes
    this.viaticoForm.get('desayuno')!.valueChanges.subscribe(() => this.recalcularTotalFormGasto());
    this.viaticoForm.get('almuerzo')!.valueChanges.subscribe(() => this.recalcularTotalFormGasto());
    this.viaticoForm.get('cena')!.valueChanges.subscribe(() => this.recalcularTotalFormGasto());
    this.viaticoForm.get('hospedaje')!.valueChanges.subscribe(() => this.recalcularTotalFormGasto());
    this.viaticoForm.get('parqueo')!.valueChanges.subscribe(() => this.recalcularTotalFormGasto());
    this.viaticoForm.get('transporte')!.valueChanges.subscribe(() => this.recalcularTotalFormGasto());

    this.viaticoForm.get('cantidadNumero')?.valueChanges.subscribe(valor => {
    if (valor !== null && !isNaN(valor)) {
      const letras = this.numeroALetrasSimple(valor);
      this.viaticoForm.patchValue({ cantidadLetra: letras }, { emitEvent: false });
    }
  });

    // cargamos empleados desde backend
    this.cargarEmpleados();

    // si gastos cambian se puede actualizar cantidadNumero / cantidadLetra llamando a actualizarTotalesPrincipales()
  }

  // recalcula el total de la sección gasto (en el input "total" del form)
  private recalcularTotalFormGasto() {
    const d = Number(this.viaticoForm.get('desayuno')!.value) || 0;
    const a = Number(this.viaticoForm.get('almuerzo')!.value) || 0;
    const c = Number(this.viaticoForm.get('cena')!.value) || 0;
    const h = Number(this.viaticoForm.get('hospedaje')!.value) || 0;
    const p = Number(this.viaticoForm.get('parqueo')!.value) || 0;
    const t = Number(this.viaticoForm.get('transporte')!.value) || 0;
    const total = +(d + a + c + h + p + t).toFixed(2);
    // "total" es formulario disabled, usamos patchValue
    this.viaticoForm.patchValue({ total }, { emitEvent: false });
  }

  cargarEmpleados() {
    this.viaticosService.obtenerEmpleados().subscribe({
      next: (res) => {
        this.empleados = res;
        console.log('Empleados cargados:', res);
      },
      error: (err) => console.error('Error cargando empleados', err)
    });
  }

  seleccionarEmpleado(cui: string) {
    const empleado = this.empleados.find(e => e.cui === cui);
    if (empleado) {
      this.viaticoForm.patchValue({
        cuiTrabajador: empleado.cui,
        nombreTrabajador: empleado.nombre
      });
    }
  }

  // VALIDACIÓN: solo validar campos del gasto (no todo el form)
  agregarGasto() {
    // validar campos del gasto
    const requiredGastoControls = ['fecha', 'resultado', 'producto', 'motivo', 'destino'];
    for (const c of requiredGastoControls) {
      if (!this.viaticoForm.get(c)!.valid) {
        alert('Complete todos los campos del gasto antes de agregar.');
        return;
      }
    }

    // construir el gasto con valores numéricos seguros
    const gasto = {
      fecha: this.viaticoForm.get('fecha')!.value,
      resultado: this.viaticoForm.get('resultado')!.value,
      producto: this.viaticoForm.get('producto')!.value,
      motivo: this.viaticoForm.get('motivo')!.value,
      destino: this.viaticoForm.get('destino')!.value,
      desayuno: Number(this.viaticoForm.get('desayuno')!.value) || 0,
      almuerzo: Number(this.viaticoForm.get('almuerzo')!.value) || 0,
      cena: Number(this.viaticoForm.get('cena')!.value) || 0,
      hospedaje: Number(this.viaticoForm.get('hospedaje')!.value) || 0,
      parqueo: Number(this.viaticoForm.get('parqueo')!.value) || 0,
      transporte: Number(this.viaticoForm.get('transporte')!.value) || 0,
      total: 0
    };

    gasto.total = +(gasto.desayuno + gasto.almuerzo + gasto.cena + gasto.hospedaje + gasto.parqueo + gasto.transporte).toFixed(2);

    if (this.editIndex !== null) {
      // actualizar
      this.gastos[this.editIndex] = gasto;
      this.editIndex = null;
    } else {
      // agregar
      this.gastos.push(gasto);
    }

    // actualizar totales principales (cantidadNumero y cantidadLetra)
    this.actualizarTotalesPrincipales();

    // limpiar campos del gasto (pero conservar datos generales como nombre)
    this.viaticoForm.patchValue({
      fecha: '',
      resultado: '',
      producto: '',
      motivo: '',
      destino: '',
      desayuno: 0,
      almuerzo: 0,
      cena: 0,
      hospedaje: 0,
      parqueo: 0,
      transporte: 0,
      total: 0
    });
  }

  eliminarGasto(index: number) {
    this.gastos.splice(index, 1);
    this.actualizarTotalesPrincipales();
  }

  editarGasto(index: number) {
    const gasto = this.gastos[index];
    // cargar en el form para editar
    this.viaticoForm.patchValue({
      fecha: gasto.fecha,
      resultado: gasto.resultado,
      producto: gasto.producto,
      motivo: gasto.motivo,
      destino: gasto.destino,
      desayuno: gasto.desayuno,
      almuerzo: gasto.almuerzo,
      cena: gasto.cena,
      hospedaje: gasto.hospedaje,
      parqueo: gasto.parqueo,
      transporte: gasto.transporte,
      total: gasto.total
    });
    this.editIndex = index;
  }

  // Actualiza los campos principales: cantidadNumero y cantidadLetra
  private actualizarTotalesPrincipales() {
    const granTotal = this.getGranTotal();
    // cantidadNumero en el form (campo normal)
    this.viaticoForm.patchValue({ cantidadNumero: +granTotal.toFixed(2) }, { emitEvent: false });

    // intentar usar la librería numero-a-letras si existe
    try {
      const letras = (typeof NumeroALetras === 'function') ? NumeroALetras(granTotal) : String(granTotal);
      this.viaticoForm.patchValue({ cantidadLetra: letras }, { emitEvent: false });
    } catch (err) {
      // fallback textual sencillo
      this.viaticoForm.patchValue({ cantidadLetra: `${granTotal.toFixed(2)} GTQ` }, { emitEvent: false });
    }
  }

  // Guarda viático (viatico + todos los detalles)
  guardarViatico() {
  if (this.gastos.length === 0) {
    alert('Debe agregar al menos un gasto');
    return;
  }

  if (!this.viaticoForm.get('cuiTrabajador')?.valid ||
      !this.viaticoForm.get('nombreTrabajador')?.valid) {
    alert('Por favor complete todos los datos del trabajador');
    return;
  }

  // Calcular totales antes de enviar
  const cantidadNumero = this.getGranTotal();
  const cantidadLetra = this.numeroALetrasSimple(cantidadNumero);

  const viaticoData: ViaticoRequest = {
    cui: this.viaticoForm.get('cuiTrabajador')?.value,
    nombreTrabajador: this.viaticoForm.get('nombreTrabajador')?.value,
    nombreJefe: 'Por definir', // puedes añadirlo en tu formulario si deseas
    cantidadLetra,
    cantidadNumero,
    gastos: this.gastos
  };

  // Llamar al servicio para guardar en backend
  this.viaticosService.guardarViatico(viaticoData).subscribe({
    next: (response) => {
      // Mostrar ventana emergente con el número de caso
      alert(`✅ Viático guardado exitosamente.\nNúmero de caso asignado: ${response.numeroCaso}`);

      // También puedes mostrarlo en pantalla:
      this.numeroCasoGenerado = response.numeroCaso;

      // Limpiar formulario y gastos
      this.limpiarFormularioCompleto();
    },
    error: (error) => {
      console.error('Error al guardar viático:', error);
      alert(' Error al guardar el viático.');
    }
  });
}


  // suma total de columna
  getTotalColumna(campo: keyof typeof this.gastos[0]): number {
    return this.gastos.reduce((sum, g) => sum + (Number(g[campo]) || 0), 0);
  }

  // suma total de totales
  getGranTotal(): number {
    return this.gastos.reduce((sum, g) => sum + (Number(g.total) || 0), 0);
  }

  private limpiarFormularioCompleto() {
    // reset form pero mantener lista de empleados cargada
    this.viaticoForm.reset();
    // reinit algunos campos
    this.viaticoForm.patchValue({
      desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, parqueo: 0, transporte: 0, total: 0, cantidadNumero: 0, cantidadLetra: ''
    });
    this.gastos = [];
    this.editIndex = null;
  }

  private numeroALetrasSimple(num: number): string {
    const entero = Math.floor(num);
    const decimales = Math.round((num - entero) * 100);
    return `${entero}quetzales${decimales > 0 ? ' con ' + decimales + '/100':''}`;
}

}
