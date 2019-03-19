import { DialogoDetalleComponent } from './dialogo-detalle/dialogo-detalle.component';
import { FiltroConsulta } from './../../_model/filtroConsulta';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { Consulta } from './../../_model/consulta';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup;
  displayedColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Consulta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  maxFecha: Date = new Date();

  constructor(private consultaService: ConsultaService, private dialog: MatDialog) {   
  }

  ngOnInit() {
    this.form = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });
  }

  buscar(){
    let filtro = new FiltroConsulta(this.form.value['dni'], this.form.value['nombreCompleto'], this.form.value['fechaConsulta']);
    filtro.nombreCompleto = filtro.nombreCompleto.toLowerCase();

    if(filtro.fechaConsulta){
      filtro.fechaConsulta.setHours(0);
      filtro.fechaConsulta.setMinutes(0);
      filtro.fechaConsulta.setSeconds(0);
      filtro.fechaConsulta.setMilliseconds(0);

      delete filtro.dni;
      delete filtro.nombreCompleto;      

      this.consultaService.buscar(filtro).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
    }else{
      delete filtro.fechaConsulta;

      if (filtro.dni.length === 0) {
        delete filtro.dni;
      }

      if (filtro.nombreCompleto.length === 0) {
        delete filtro.nombreCompleto
      }
      
      this.consultaService.buscar(filtro).subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
      });
    }
  }

  verDetalle(consulta: Consulta) {    
    this.dialog.open(DialogoDetalleComponent, {      
      data: consulta
    });
  }

}
