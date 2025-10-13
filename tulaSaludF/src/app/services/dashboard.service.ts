// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Modelo de detalle de gasto
export interface DetalleGasto {
  desayuno: number;
  almuerzo: number;
  cena: number;
  hospedaje: number;
  parqueo: number;
  transporte: number;
}

// Modelo de viático para el dashboard
export interface ViaticoDashboard {
  id_viatico: number;
  numero_caso: string;
  nombre_empleado: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  cantidad_letra: string;
  cantidad_numero: number;
  nombre_jefe: string;
  fecha_creacion: string;
  fecha_aprobacion?: string | null;
  detalles: DetalleGasto[]; 
  desayuno?: number;
  almuerzo?: number;
  cena?: number;
  hospedaje?: number;
  parqueo?: number;
  transporte?: number;

}

interface DashboardResponse {
  success: boolean;
  data: ViaticoDashboard[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/viaticos/dashboard'; 

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los viáticos para el dashboard, filtrando por estado si se pasa.
   * @param estado 'pendiente' | 'aprobado' | 'rechazado'
   */
  getViaticosDashboard(
    estado?: 'pendiente' | 'aprobado' | 'rechazado'
  ): Observable<ViaticoDashboard[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<DashboardResponse>(this.apiUrl, { params }).pipe(
      map(res => (res.success ? res.data : []))
    );
  }
}


