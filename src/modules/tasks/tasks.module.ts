import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ConfigService } from '@nestjs/config';
import { initFirebase } from 'src/config/firebase.config';
import { TasksGateway } from './tasks.gateway';


@Module({
  controllers: [TasksController],
  providers: [TasksService, {
    provide: 'FIREBASE',
    inject: [ConfigService],
    useFactory: () => initFirebase(),
  }, TasksGateway],
})
export class TasksModule { }
