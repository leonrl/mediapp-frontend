import { Component, OnInit, ViewChild } from '@angular/core';
import { Medico } from 'src/app/_model/medico';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { MedicoService } from 'src/app/_service/medico.service';
import { DialogoComponent } from './dialogo/dialogo.component';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  displayedColumns = ['idmedico', 'nombres', 'apellidos', 'cmp', 'acciones'];
  dataSource: MatTableDataSource<Medico>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private medicoService: MedicoService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.medicoService.medicosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.medicoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', { duration: 2000 });
    });


    this.medicoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(medico?: Medico){
    let med = medico != null ? medico : new Medico();
    this.dialog.open(DialogoComponent, {
      width: '250px',
      data: med
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(medico: Medico) {
    this.medicoService.eliminar(medico.idMedico).subscribe(data => {
      this.medicoService.listar().subscribe(medicos => {
        this.medicoService.medicosCambio.next(medicos);
        this.medicoService.mensajeCambio.next("Se elimino");
      });
    });
  }

}
