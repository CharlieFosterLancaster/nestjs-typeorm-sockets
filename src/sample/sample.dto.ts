import { ApiProperty } from "@nestjs/swagger";

// Data Transfer Object, sirve para manejar la data que llegua desde afuera y también internamente
export class SampleDTO {
    @ApiProperty()
    id?: number; // el "?" es para indicar un campo opcional, id lo establecemos como opcional ya que en la creación no se va a pasar

    @ApiProperty()
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}