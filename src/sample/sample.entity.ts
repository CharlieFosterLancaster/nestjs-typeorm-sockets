import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Sirve para manejar la data que viene o va hacia la bd
@Entity('test') // Aquí se indica el nombre de la tabala que se quiere consumir
// Se debe agregar los campos tal cual está en la tabla
export class SampleEntity {

    @PrimaryGeneratedColumn("increment")
    readonly id: number;

    @Column({ nullable: true })
    readonly name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        // console.log('Creo Sample Entity para ' + this.name);
    }

}
