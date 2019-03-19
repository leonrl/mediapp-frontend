import { PacienteService } from 'src/app/_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  paciente: Paciente;
  form: FormGroup;
  edicion: boolean;
  id: number;

  constructor(private pacienteService: PacienteService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.paciente = new Paciente();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'direccion': new FormControl(''),
      'telefono': new FormControl(''),
      'email': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;

      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      //cargar la data del servicio hacia el form
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'direccion': new FormControl(data.direccion),
          'telefono': new FormControl(data.telefono),
          'email': new FormControl(data.email)
        });
      });
    }
  }

  operar() {
    this.paciente.idPaciente = this.form.value['id'];
    this.paciente.nombres = this.form.value['nombres'];
    this.paciente.apellidos = this.form.value['apellidos'];
    this.paciente.dni = this.form.value['dni'];
    this.paciente.direccion = this.form.value['direccion'];
    this.paciente.telefono = this.form.value['telefono'];
    this.paciente.email = this.form.value['email'];

    if (this.edicion) {
      this.pacienteService.modificar(this.paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.pacienteCambio.next(data);
          this.pacienteService.mensajeCambio.next('SE MODIFICÓ');
        });
      })
    } else {
      this.pacienteService.registrar(this.paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.pacienteCambio.next(data);
          this.pacienteService.mensajeCambio.next('SE REGISTRÓ');
        });
      });
    }

    this.router.navigate(['paciente']);
  }

}
