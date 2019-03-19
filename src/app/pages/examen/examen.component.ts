import { ExamenService } from './../../_service/examen.service';
import { Examen } from './../../_model/examen';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {

  displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];
  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  mensaje: string;

  constructor(private examenService: ExamenService, public snackBar: MatSnackBar) {  }

  ngOnInit() {

    this.examenService.examenesCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    
    this.examenService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.examenService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(idExamen: number) {
    this.examenService.eliminar(idExamen).subscribe(data => {
      this.examenService.listar().subscribe(data => {
        this.examenService.examenesCambio.next(data);
        this.examenService.mensajeCambio.next('Se eliminó');
      });
    });
  }


}
