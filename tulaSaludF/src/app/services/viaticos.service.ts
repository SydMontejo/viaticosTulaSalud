import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Gasto {
  fecha: string;
  resultado: string;
  producto: string;
  motivo: string;
  destino: string;
  desayuno: number;
  almuerzo: number;
  cena: number;
  hospedaje: number;
  parqueo: number;
  transporte: number;
  total: number;
}

export interface ViaticoRequest {
  cui: string;
  nombreTrabajador: string;
  nombreJefe: string;
  cantidadLetra: string;
  cantidadNumero: number;
  gastos: Gasto[];
}

export interface ViaticoResponse {
  success: boolean;
  numeroCaso: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViaticosService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  guardarViatico(viatico: ViaticoRequest): Observable<ViaticoResponse> {
    return this.http.post<ViaticoResponse>(`${this.apiUrl}/viaticos`, viatico);
  }

  obtenerViaticosPorCui(cui: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/viaticos/${cui}`);
  }

  obtenerEmpleados(): Observable<{cui: string, nombre: string}[]> {
  return this.http.get<{cui: string, nombre: string}[]>(`${this.apiUrl}/empleados`);
}

}