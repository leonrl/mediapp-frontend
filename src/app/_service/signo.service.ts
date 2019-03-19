import { HOST } from '../_shared/var.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signo } from '../_model/signo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignoService {

  signoCambio = new Subject<Signo[]>();
  mensajeCambio = new Subject<string>();

  url: string = HOST;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Signo[]>(`${this.url}/signos`);
  }

  listarPageable(p: number, s: number) {
    return this.http.get(`${this.url}/signos/pageable?page=${p}&size=${s}`);
  }

  listarPorId(idSigno: number) {
    return this.http.get<Signo>(`${this.url}/signos/${idSigno}`);
  }

  registrar(signo: Signo) {
    return this.http.post(`${this.url}/signos`, signo);
  }

  modificar(signo: Signo) {
    return this.http.put(`${this.url}/signos`, signo);
  }

  eliminar(idSigno: number) {
    return this.http.delete(`${this.url}/signos/${idSigno}`);
  }
}
