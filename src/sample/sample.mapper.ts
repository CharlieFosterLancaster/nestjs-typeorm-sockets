import { Injectable } from "@nestjs/common";
import { SampleDTO } from "./sample.dto";
import { SampleEntity } from "./sample.entity";

// Sirve para trasformar la data
// Si viene de un ep llega como dto y para guardar en la bd debe transformarse a entity
// Viceversa cuando la db devuelve la data y se quiere retornar el resultado
@Injectable()
export class SampleMapper {

    dtoToEntity(sampleDTO: SampleDTO): SampleEntity {
        return new SampleEntity(sampleDTO.id, sampleDTO.name);
    }

    entityToDto(sampleEntity: SampleEntity): SampleDTO {
        return new SampleDTO(sampleEntity.id, sampleEntity.name);
    }

}
