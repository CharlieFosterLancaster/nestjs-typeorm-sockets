import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEntity } from './sample.entity';
import { SampleController } from './sample.controller';
import { SampleMapper } from './sample.mapper';
import { SampleRepository } from './sample.repository';
import { SampleService } from './sample.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEntity]),],
  controllers: [SampleController],
  providers: [SampleService, SampleMapper, SampleRepository],
  exports: [SampleService, SampleMapper, SampleRepository],
})
export class SampleModule { }
