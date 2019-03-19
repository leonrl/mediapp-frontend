import { SignoService } from './../../_service/signo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { MatTableDataSource, MatTable, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { Signo } from 'src/app/_model/signo';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  displayedColumns = ['idSigno', 'paciente', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Signo>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  cantidad: number;

  constructor(private signoService: SignoService, private snackBar: MatSnackBar,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.listar();

    this.signoService.signoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.pedirPaginado();
  }

  eliminar(idSigno: number) {
    this.signoService.eliminar(idSigno).subscribe(() => {
      this.signoService.listar().subscribe(data => {
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next('SE ELIMINÓ');
      });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  mostrarMas(e: any) {
    this.pedirPaginado(e);
  }

  pedirPaginado(e?: any) {
    let pageIndex = 0;
    let pageSize = 10;

    if (e != null) {
      pageIndex = e.pageIndex;
      pageSize = e.pageSize;      
    }

    this.signoService.listarPageable(pageIndex, pageSize).subscribe((data: any) => {
      let signo = data.content;
      this.cantidad = data.totalElements;

      this.dataSource = new MatTableDataSource(signo);
      this.dataSource.sort = this.sort;
    });

  }
}
