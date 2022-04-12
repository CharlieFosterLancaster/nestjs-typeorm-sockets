import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { sample } from 'rxjs';
import { SampleDTO } from './sample.dto';
import { SampleService } from './sample.service';

// Se indica los eps para consumir como api rest
@Controller('samples')
export class SampleController {

    constructor(private sampleService: SampleService) { }

    @Get()
    async getAllSamples(): Promise<SampleDTO[]> {
        return await this.sampleService.getAllSamples();
    }

    @Get(':id')
    async getSampleById(@Param('id') id: number): Promise<SampleDTO> {
        return await this.sampleService.getSampleById(id);
    }

    @Post()
    async newSample(@Body() sample: SampleDTO): Promise<SampleDTO> {
        return await this.sampleService.newSample(sample);
    }

    @Put(':id')
    async updateSample(@Param('id') id: number, @Body() sample: SampleDTO): Promise<SampleDTO> {
        return await this.sampleService.updateSample(id, sample);
    }

    @Delete(':id')
    async deleteSample(@Param('id') id: number): Promise<void> {
        return await this.sampleService.deleteSample(id);
    }

}