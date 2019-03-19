import { PasswordValidation } from './match';
import { LoginService } from './../../../_service/login.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  form: FormGroup;
  token: string;
  mensaje: string;
  error: string;
  rpta: number;
  tokenValido: boolean;

  constructor(fb: FormBuilder, private router: Router, private route: ActivatedRoute, private loginService: LoginService) {
    this.form = fb.group({
      password: [''],
      confirmPassword: ['']
    }, { validator: PasswordValidation.MatchPassword });
  }

  ngOnInit() {
    this.route.params.subscribe( (params: Params) => {
      this.token = params['token'];
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
        if(data === 1){
          this.tokenValido = true;
        }else{
          this.tokenValido = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000)
        }
      });
    });
  }

  onSubmit() {
    let clave: string = this.form.value.confirmPassword;
    this.loginService.restablecer(this.token, clave).subscribe(data => {
      if (data === 1) {
        this.rpta = 1;
      }
    }, err => {
      
    });
  }


}
