import { TOKEN_NAME } from './../../_shared/var.constants';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  listaRolXUsuario: any[] = [];
  constructor() { }

  ngOnInit() {
    this.obtenerUsuarioYRoles();
  }

  obtenerUsuarioYRoles(){
    const helper = new JwtHelperService();
    let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    const decodedToken = helper.decodeToken(tk.access_token);
    this.usuario = decodedToken.user_name;
    this.listaRolXUsuario = decodedToken.authorities;
    console.log(decodedToken);
  }
}
