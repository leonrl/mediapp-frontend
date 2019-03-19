import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOST, TOKEN_AUTH_USERNAME, TOKEN_AUTH_PASSWORD, TOKEN_NAME } from './../_shared/var.constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = `${HOST}/oauth/token`;

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: string, contrasena: string) {
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(TOKEN_AUTH_USERNAME + ':' + TOKEN_AUTH_PASSWORD))
    });

  }

  estaLogeado() {
    let token = sessionStorage.getItem(TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    this.http.get(`${HOST}/usuarios/anular/${access_token}`).subscribe(() => {
      sessionStorage.clear();
      this.router.navigate(['login']);
    });
  }


  enviarCorreo(correo: string) {
    return this.http.post<number>(`${HOST}/login/enviarCorreo`, correo, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  verificarTokenReset(token: string) {  
    return this.http.get<number>(`${HOST}/login/restablecer/verificar/${token}`);
  }

  restablecer(token: string, clave: string) {
    return this.http.post<number>(`${HOST}/login/restablecer/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }
}
