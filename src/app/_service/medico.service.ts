import { HttpClient } from '@angular/common/http';
import { HOST } from './../_shared/var.constants';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Medico } from '../_model/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  medicosCambio = new Subject<Medico[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${HOST}/medicos`;
  
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Medico[]>(this.url);
  }

  listarMedicoPorId(id: number) {
    return this.http.get<Medico>(`${this.url}/${id}`);
  }

  registrar(medico: Medico) {
    return this.http.post(this.url, medico);
  }

  modificar(medico: Medico) {
    return this.http.put(this.url, medico);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
