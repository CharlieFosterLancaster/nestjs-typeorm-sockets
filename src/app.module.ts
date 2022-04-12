import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { SampleModule } from './sample/sample.module';
import { SampleService } from './sample/sample.service';
import { SampleRepository } from './sample/sample.repository';
import { SampleMapper } from './sample/sample.mapper';
import { SampleEntity } from './sample/sample.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true
    }),
    SampleModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, SampleService,],
})
export class AppModule { }
