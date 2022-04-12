import { Injectable } from '@nestjs/common';
import { SampleDTO } from './sample.dto';
import { SampleEntity } from './sample.entity';
import { SampleMapper } from './sample.mapper';
import { SampleRepository } from './sample.repository';

// Maneja el flujo entre los eps y la conexión con la bd
@Injectable()
export class SampleService {

    constructor(
        private sampleRepository: SampleRepository,
        private mapper: SampleMapper
    ) { }

    async getAllSamples(): Promise<SampleDTO[]> {
        const samples: SampleEntity[] = await this.sampleRepository.getAllSamples()
        return samples.map(sample => this.mapper.entityToDto(sample));
    }

    async getSampleById(id: number): Promise<SampleDTO> {
        const sample: SampleEntity = await this.sampleRepository.getSampleById(id);
        return this.mapper.entityToDto(sample);
    }

    async newSample(sampleDTO: SampleDTO): Promise<SampleDTO> {
        const newSample: SampleEntity = await this.sampleRepository.newSample(sampleDTO);
        return this.mapper.entityToDto(newSample);
    }

    async updateSample(id: number, sampleDTO: SampleDTO): Promise<SampleDTO> {
        const updateSample = await this.sampleRepository.updateSample(id, sampleDTO);
        return this.mapper.entityToDto(updateSample);
    }

    async deleteSample(id: number): Promise<void> {
        await this.sampleRepository.deleteSample(id);
    }

}