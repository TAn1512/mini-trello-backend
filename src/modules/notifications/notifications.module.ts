import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { ConfigService } from '@nestjs/config';
import { initFirebase } from 'src/config/firebase.config';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService, {
    provide: 'FIREBASE',
    inject: [ConfigService],
    useFactory: () => initFirebase(),
  },],
  exports: [NotificationsService, NotificationsGateway],

})
export class NotificationsModule { }
