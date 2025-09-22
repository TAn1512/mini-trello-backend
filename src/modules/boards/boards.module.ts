import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initFirebase } from 'src/config/firebase.config';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ConfigModule, NotificationsModule],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    {
      provide: 'FIREBASE',
      inject: [ConfigService],
      useFactory: () => initFirebase(),
    }
  ],
  exports: [BoardsService],
})
export class BoardsModule { }
