import { ExamenService } from './../../../_service/examen.service';
import { ConsultaListaExamen } from './../../../_model/consultaListaExamen';
import { Consulta } from './../../../_model/consulta';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialogo-detalle',
  templateUrl: './dialogo-detalle.component.html',
  styleUrls: ['./dialogo-detalle.component.css']
})
export class DialogoDetalleComponent implements OnInit {

  consulta: Consulta;
  examenes: ConsultaListaExamen[];

  constructor(public dialogRef: MatDialogRef<DialogoDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private examenService: ExamenService) { }

  ngOnInit() {
    this.consulta = this.data;
    this.listarExamenes();
  }

  listarExamenes() {
    this.examenService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe((data) => {
      this.examenes = data;
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

}
