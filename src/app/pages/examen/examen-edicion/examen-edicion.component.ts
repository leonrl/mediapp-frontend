import { ActivatedRoute, Router, Params } from '@angular/router';
import { ExamenService } from './../../../_service/examen.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Examen } from './../../../_model/examen';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-examen-edicion',
  templateUrl: './examen-edicion.component.html',
  styleUrls: ['./examen-edicion.component.css']
})
export class ExamenEdicionComponent implements OnInit {

  id: number;
  examen: Examen;
  form: FormGroup;
  edicion: boolean = false;


  constructor(private examenService: ExamenService, private route: ActivatedRoute, private router: Router) {
    this.examen = new Examen();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl(''),
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.examenService.listarExamenPorId(this.id).subscribe(data => {
        let id = data.idExamen;
        let nombre = data.nombre;
        let descripcion = data.descripcion

        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(descripcion)
        });
      });
    }
  }

  operar() {
    this.examen.idExamen = this.form.value['id'];
    this.examen.nombre = this.form.value['nombre'];
    this.examen.descripcion = this.form.value['descripcion'];

    if (this.examen != null && this.examen.idExamen > 0) {
      this.examenService.modificar(this.examen).subscribe(data => {
        this.examenService.listar().subscribe(especialidad => {
          this.examenService.examenesCambio.next(especialidad);
          this.examenService.mensajeCambio.next("Se modifico");
        });
      });
    } else {
      this.examenService.registrar(this.examen).subscribe(data => {
        this.examenService.listar().subscribe(especialidad => {
          this.examenService.examenesCambio.next(especialidad);
          this.examenService.mensajeCambio.next("Se registro");
        });
      });
    }

    this.router.navigate(['examen']);
  }
}
