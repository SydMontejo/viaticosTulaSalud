import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gasto } from '../models/gasto.model';

@Injectable({ providedIn: 'root' })
export class ViaticoService {
  private apiUrl = 'https://mocki.io/v1/YOUR_MOCK_ENDPOINT'; // API de prueba

  constructor(private http: HttpClient) {}

  getGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl);
  }
}
//NOTA: archivo de prueba, puede ser eliminado.