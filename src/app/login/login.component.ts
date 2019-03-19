import { MenuService } from './../_service/menu.service';
import { Router } from '@angular/router';
import { TOKEN_NAME } from './../_shared/var.constants';
import { LoginService } from './../_service/login.service';
import { Component, OnInit } from '@angular/core';
import '../login-animation.js';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string = "";
  error: string = "";

  constructor(private loginService : LoginService, private router: Router, private menuService : MenuService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

  iniciarSesion(){
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      if(data){
        const helper = new JwtHelperService();

        let token = JSON.stringify(data);
        sessionStorage.setItem(TOKEN_NAME, token);

        let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
        const decodedToken = helper.decodeToken(tk.access_token);
        console.log("mirar ronalddddd");
        console.log(decodedToken);

        this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
          this.menuService.menuCambio.next(data);
        });
        
        this.router.navigate(['paciente']);

      }
    });
  }

}
