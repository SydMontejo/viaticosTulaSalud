// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardService, ViaticoDashboard, DetalleGasto } from '../../services/dashboard.service';
import { BaseChartDirective} from 'ng2-charts';
import { ChartData, ChartOptions, Chart, ArcElement, Tooltip, Legend, PieController   } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  
  viaticos: ViaticoDashboard[] = [];
  estadoFiltro: 'pendiente' | 'aprobado' | 'rechazado' = 'aprobado';

  totalDesayuno = 0;
  totalAlmuerzo = 0;
  totalCena = 0;
  totalHospedaje = 0;
  totalParqueo = 0;
  totalTransporte = 0;
  graficaTotales: ChartData<'pie', number[], string> = {
    labels: ['Desayuno','Almuerzo','Cena','Hospedaje','Parqueo','Transporte'],
    datasets: [{ data: [0,0,0,0,0,0], backgroundColor: ['#36A2EB','#FFCE56','#FF6384','#4BC0C0','#9966FF','#FF9F40'] }]
  };

  graficaOpciones: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarViaticos();
  }

  cargarViaticos() {
    this.dashboardService.getViaticosDashboard(this.estadoFiltro).subscribe({
      next: (data: ViaticoDashboard[]) => {
        this.viaticos = data;
        this.calcularTotales();
      },
      error: err => {
        console.error('Error cargando viáticos:', err);
      }
    });
  }

  calcularTotales() {
    this.totalDesayuno = 0;
    this.totalAlmuerzo = 0;
    this.totalCena = 0;
    this.totalHospedaje = 0;
    this.totalParqueo = 0;
    this.totalTransporte = 0;

    this.viaticos.forEach(v => {
      const detalles: DetalleGasto[] = v.detalles || [];
      detalles.forEach(d => {
        this.totalDesayuno += Number(d.desayuno);
        this.totalAlmuerzo += Number(d.almuerzo);
        this.totalCena += Number(d.cena);
        this.totalHospedaje += Number(d.hospedaje);
        this.totalParqueo += Number(d.parqueo);
        this.totalTransporte += Number(d.transporte);
      });
    });

    this.graficaTotales.datasets[0].data = [
      this.totalDesayuno,
      this.totalAlmuerzo,
      this.totalCena,
      this.totalHospedaje,
      this.totalParqueo,
      this.totalTransporte
    ];
    this.chart?.update();
  }

  cambiarEstado(estado: 'pendiente' | 'aprobado' | 'rechazado') {
    this.estadoFiltro = estado;
    this.cargarViaticos();
  }

  getSubtotal(viatico: ViaticoDashboard, tipo: keyof DetalleGasto): number {
    if (!viatico.detalles) return 0;
    return viatico.detalles.reduce((sum: number, d: DetalleGasto) => sum + Number(d[tipo] || 0), 0);
  }

  
  
}
