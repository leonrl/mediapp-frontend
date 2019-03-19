import { ConsultaService } from './../../../_service/consulta.service';
import { ConsultaListaExamen } from './../../../_model/consultaListaExamen';
import { Consulta } from './../../../_model/consulta';
import { MatSnackBar } from '@angular/material';
import { DetalleConsulta } from './../../../_model/detalleConsulta';
import { ExamenService } from './../../../_service/examen.service';
import { Examen } from './../../../_model/examen';
import { MedicoService } from 'src/app/_service/medico.service';
import { Especialidad } from './../../../_model/especialidad';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { map } from 'rxjs/operators';
import { Medico } from 'src/app/_model/medico';
import * as moment from 'moment';

@Component({
  selector: 'app-especial',
  templateUrl: './especial.component.html',
  styleUrls: ['./especial.component.css']
})
export class EspecialComponent implements OnInit {

  form: FormGroup;
  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();

  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];
  medicos: Medico[] = [];
  examenes: Examen[] = [];

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  filteredOptions: Observable<any[]>;
  filteredOptionsMedico: Observable<any[]>;

  pacienteSeleccionado: Paciente;
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;

  constructor(private builder: FormBuilder, private pacienteService: PacienteService,
    private examenService: ExamenService, private especialidadService: EspecialidadService,
    private medicoService: MedicoService, private consultaService: ConsultaService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.form = this.builder.group({
      'paciente': this.myControlPaciente,
      'especialidad': new FormControl(),
      'medico': this.myControlMedico,
      'fecha': new FormControl(new Date()),
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });

    this.listarPacientes();
    this.listarEspecilidad();
    this.listarMedicos();
    this.listarExamenes();

    //formulario instanciado en ts

    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
    this.filteredOptionsMedico = this.myControlMedico.valueChanges.pipe(map(val => this.filterMedico(val)));
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  listarEspecilidad() {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }

  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  filterMedico(val: any) {
    if (val != null && val.idMedico > 0) {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.cmp.includes(val.cmp));
    } else {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.cmp.includes(val));
    }
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  displayFnMedico(val: Medico) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  agregar() {

    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico = null;
      this.tratamiento = null;
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tramiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  seleccionarMedico(e: any) {
    this.medicoSeleccionado = e.option.value;
  }

  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null || this.medicoSeleccionado === null || this.pacienteSeleccionado === null);
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }
  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  aceptar() {
    let consulta = new Consulta();
    consulta.especialidad = this.form.value['especialidad'];
    consulta.paciente = this.form.value['paciente']; //this.pacienteSeleccionado;
    consulta.medico = this.form.value['medico'];
    consulta.detalleConsulta = this.detalleConsulta;
    consulta.fecha = moment(this.fechaSeleccionada).toISOString();

    let consultaListExamen = new ConsultaListaExamen();
    consultaListExamen.consulta = consulta;
    consultaListExamen.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrar(consultaListExamen).subscribe(() => {
      this.snackBar.open("Se registró", "Aviso", { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.medicoSeleccionado = null;
    this.examenSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
  }

}
