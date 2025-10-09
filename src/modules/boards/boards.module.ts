import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initFirebase } from '../../config/firebase.config';
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
