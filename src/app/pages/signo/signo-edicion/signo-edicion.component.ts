import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SignoService } from 'src/app/_service/signo.service';
import { Signo } from 'src/app/_model/signo';
import * as moment from 'moment';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  signo: Signo;
  form: FormGroup;
  myControlPaciente: FormControl = new FormControl();
  edicion: boolean;
  id: number;
  pacienteSeleccionado: Paciente;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  filteredOptions: Observable<any[]>;
  pacientes: Paciente[] = [];

  constructor(private signoService: SignoService, private route: ActivatedRoute, private router: Router,
    private pacienteService: PacienteService, private builder: FormBuilder) { }

  ngOnInit() {
    this.signo = new Signo();

    this.form = this.builder.group({
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

    this.listarPacientes();
    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filterPaciente(val)));
  }

  initForm() {
    if (this.edicion) {
      //cargar la data del servicio hacia el form
      this.signoService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSigno),
          'paciente': new FormControl(data.paciente),
          'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmoRespiratorio': new FormControl(data.ritmo_respiratorio)
        });
      });
    }
  }

  operar() {
    this.signo.idSigno = this.form.value['id'];
    this.signo.paciente = this.form.value['paciente'];
    this.signo.fecha = moment(this.fechaSeleccionada).toISOString();
    this.signo.temperatura = this.form.value['temperatura'];
    this.signo.pulso = this.form.value['pulso'];
    this.signo.ritmo_respiratorio = this.form.value['ritmoRespiratorio'];

    if (this.edicion) {
      this.signoService.modificar(this.signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE MODIFICÓ');
        });
      })
    } else {
      this.signoService.registrar(this.signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE REGISTRÓ');
        });
      });
    }

    this.router.navigate(['signo']);
  }

  
  filterPaciente(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }
}
