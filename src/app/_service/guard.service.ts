import { MenuService } from './menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TOKEN_NAME } from './../_shared/var.constants';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router, private menuService: MenuService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();

    let rpta = this.loginService.estaLogeado();

    //si esta logeado
    if (!rpta) {
      this.limpiarSesion();
    } else {
      //si el token esta expirado
      let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
      if (!helper.isTokenExpired(token.access_token)) {
        //verificando roles de usuario
        const decodedToken = helper.decodeToken(token.access_token);

        //1 saber la url que quiere entrar
        let url = state.url;

        //2 traer la informacion de los menu de un usuario
        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map(data => {
          this.menuService.menuCambio.next(data);

          //3 algoritmo de coincidencias
          let cont = 0;
          for (let m of data) {
            if (m.url === url) {
              cont++;
              break;
            }
          }

          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['not-401']);
            return false;
          }
        }));
      } else {
        this.limpiarSesion();
      }
      return true;
    }
  }

  limpiarSesion() {
    sessionStorage.clear();
    this.router.navigate(['login']);
    return false;
  }
}
