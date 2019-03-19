import { Paciente } from 'src/app/_model/paciente';
export class Signo {
    idSigno: number;
    paciente: Paciente;
    fecha: string; //ISODATE 2019-02-10T05:00:00
    temperatura: string;
    pulso: string;
    ritmo_respiratorio: string;
}