import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { SampleDTO } from './sample.dto';
import { SampleEntity } from './sample.entity';
import { SampleMapper } from './sample.mapper';

// Aquí se manejará las peticiones con la bd
// Se puede hacer consultas simples como consultas sql
@Injectable()
export class SampleRepository {

    constructor(
        @InjectRepository(SampleEntity)
        private sampleRepository: Repository<SampleEntity>,
        private mapper: SampleMapper) { }

    getAllSamples(): Promise<SampleEntity[]> {
        return this.sampleRepository.find();
    }

    getSampleById(id): Promise<SampleEntity> {
        return this.sampleRepository.findOne(id);
    }

    newSample(sampleDTO: SampleDTO): Promise<SampleEntity> {
        const newUser = this.mapper.dtoToEntity(sampleDTO);
        return this.sampleRepository.save(newUser);
    }

    async updateSample(id, sampleDTO: SampleDTO): Promise<SampleEntity> {
        sampleDTO.id = id;
        const updateUser = this.mapper.dtoToEntity(sampleDTO);
        await this.sampleRepository.update(id, updateUser);
        return this.sampleRepository.findOne(id);

    }

    deleteSample(id: number): Promise<DeleteResult> {
        return this.sampleRepository.delete(id);
    }

}