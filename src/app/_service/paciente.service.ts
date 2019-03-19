import { HOST } from './../_shared/var.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../_model/paciente';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  pacienteCambio = new Subject<Paciente[]>();
  mensajeCambio = new Subject<string>();

  url: string = HOST;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Paciente[]>(`${this.url}/pacientes`);
  }

  listarPageable(p: number, s: number) {
    return this.http.get(`${this.url}/pacientes/pageable?page=${p}&size=${s}`);
  }

  listarPorId(idPaciente: number) {
    return this.http.get<Paciente>(`${this.url}/pacientes/${idPaciente}`);
  }

  registrar(paciente: Paciente) {
    return this.http.post(`${this.url}/pacientes`, paciente);
  }

  modificar(paciente: Paciente) {
    return this.http.put(`${this.url}/pacientes`, paciente);
  }

  eliminar(idPaciente: number) {
    return this.http.delete(`${this.url}/pacientes/${idPaciente}`);
  }
}
